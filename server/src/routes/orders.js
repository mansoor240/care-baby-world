import { Router } from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Customer from "../models/Customer.js";
import { calculateTotals } from "../utils/totals.js";
import { optionalCustomer } from "../middleware/customerAuth.js";
import { storeConfig } from "../config/store.js";

const router = Router();

function genOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TN-${ts}${rand}`;
}

async function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  const { default: Razorpay } = await import("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// GET /api/orders/payment-methods
router.get("/payment-methods", (_req, res) => {
  const online = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  res.json({
    cod: true,
    online,
    razorpayKeyId: online ? process.env.RAZORPAY_KEY_ID : null,
  });
});

// POST /api/orders
router.post("/", optionalCustomer, async (req, res) => {
  try {
    const { customer, items, paymentMethod, couponCode } = req.body;

    if (!customer || !items?.length)
      return res.status(400).json({ error: "Missing customer or items" });

    const { deliveryPincodePrefixes = [] } = storeConfig;
    const pincode = customer.pincode || "";
    const isDeliverable = deliveryPincodePrefixes.some((prefix) =>
      pincode.startsWith(prefix)
    );
    if (!isDeliverable) {
      return res.status(400).json({
        error:
          "We currently deliver only in Hyderabad. Contact us on WhatsApp for special requests.",
      });
    }

    if (paymentMethod === "online") {
      const rzp = await getRazorpay();
      if (!rzp) {
        return res.status(400).json({
          error: "Online payments are not enabled. Please choose Cash on Delivery.",
        });
      }
    }

    // ─── Validate items + resolve variant + variant stock ───
    const validated = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product)
        return res.status(400).json({ error: `Product not found: ${it.productId}` });

      let variant = null;

      if (product.variants && product.variants.length > 0) {
        // Try by variantId first, then fall back to sku / name / index
        if (it.variantId) {
          variant = product.variants.id(it.variantId);
        }
        if (!variant && it.variantSku) {
          variant = product.variants.find((v) => v.sku === it.variantSku);
        }
        if (!variant && it.variantName) {
          variant = product.variants.find((v) => v.name === it.variantName);
        }
        if (!variant && Number.isInteger(it.variantIndex)) {
          variant = product.variants[it.variantIndex] || null;
        }

        if (!variant) {
          return res
            .status(400)
            .json({ error: `Variant not found for ${product.name}` });
        }

        if ((variant.stock || 0) < it.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for ${product.name} (${variant.name})`,
          });
        }
      } else {
        if ((product.stock || 0) < it.quantity) {
          return res
            .status(400)
            .json({ error: `Insufficient stock for ${product.name}` });
        }
      }

      validated.push({
        productId: product._id,
        variantId: variant ? variant._id : null,
        variantName: variant ? variant.name : "",
        variantSku: variant ? variant.sku : "",
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || "",
        price: variant ? variant.price : product.price,
        quantity: it.quantity,
      });
    }

    let coupon = null;
    if (couponCode)
      coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
      });

    const { subtotal, discount, deliveryFee, total } = calculateTotals(
      validated,
      coupon
    );

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      customer,
      customerId: req.customerId || null,
      items: validated,
      subtotal,
      deliveryFee,
      discount,
      total,
      couponCode: coupon?.code || "",
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
    });

    // Auto-save address
    if (req.customerId) {
      const cust = await Customer.findById(req.customerId);
      if (cust && cust.addresses.length < 5) {
        const already = cust.addresses.find(
          (a) => a.house === customer.house && a.pincode === customer.pincode
        );
        if (!already) {
          cust.addresses.push({
            label: "Home",
            fullName: customer.fullName,
            mobile: customer.mobile,
            house: customer.house,
            street: customer.street,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
          });
          await cust.save();
        }
      }
    }

    // ─── Decrement stock (variant-aware) ───
    await Promise.all(
      validated.map(async (it) => {
        if (it.variantId) {
          await Product.updateOne(
            { _id: it.productId, "variants._id": it.variantId },
            { $inc: { "variants.$.stock": -it.quantity, stock: -it.quantity } }
          );
        } else if (it.variantSku) {
          await Product.updateOne(
            { _id: it.productId, "variants.sku": it.variantSku },
            { $inc: { "variants.$.stock": -it.quantity, stock: -it.quantity } }
          );
        } else {
          await Product.updateOne(
            { _id: it.productId },
            { $inc: { stock: -it.quantity } }
          );
        }
      })
    );

    if (coupon)
      await Coupon.updateOne({ _id: coupon._id }, { $inc: { usageCount: 1 } });

    if (paymentMethod === "online") {
      const rzp = await getRazorpay();
      const razorpayOrder = await rzp.orders.create({
        amount: Math.round(total * 100),
        currency: "INR",
        receipt: order.orderNumber,
        notes: { orderId: order._id.toString() },
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        ...order.toObject(),
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});

// POST /api/orders/verify-payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification data" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not verify payment" });
  }
});

// GET /api/orders/track
router.get("/track", async (req, res) => {
  const { orderNumber, mobile } = req.query;

  if (!mobile) {
    return res.status(400).json({ error: "Mobile number required" });
  }

  if (orderNumber) {
    const order = await Order.findOne({
      orderNumber: orderNumber.trim().toUpperCase(),
      "customer.mobile": mobile.trim(),
    });

    if (!order) {
      return res.status(404).json({ error: "No order found with these details" });
    }

    return res.json({ orders: [order], single: true });
  }

  const orders = await Order.find({ "customer.mobile": mobile.trim() })
    .sort({ createdAt: -1 })
    .limit(10);

  if (orders.length === 0) {
    return res.status(404).json({
      error: "No orders found for this mobile number. Check the number and try again.",
    });
  }

  res.json({ orders, single: false });
});

// GET /api/orders/by-id/:id
router.get("/by-id/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch {
    res.status(400).json({ error: "Invalid order id" });
  }
});

// GET /api/orders/:orderNumber
router.get("/:orderNumber", async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;