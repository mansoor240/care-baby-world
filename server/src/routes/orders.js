import { Router } from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Customer from "../models/Customer.js";
import { calculateTotals } from "../utils/totals.js";
import { optionalCustomer } from "../middleware/customerAuth.js";

const router = Router();

function genOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TN-${ts}${rand}`;
}

// Lazy-init Razorpay only when keys are configured.
// If keys are missing, online payments are disabled.
async function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  const { default: Razorpay } = await import("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// GET /api/orders/payment-methods — tells frontend what's enabled
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

    if (paymentMethod === "online") {
      const rzp = await getRazorpay();
      if (!rzp) {
        return res.status(400).json({
          error: "Online payments are not enabled. Please choose Cash on Delivery.",
        });
      }
    }

    const validated = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product)
        return res.status(400).json({ error: `Product not found: ${it.productId}` });
      if (product.stock < it.quantity)
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });

      validated.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: it.quantity,
        variant: it.variant || "",
      });
    }

    let coupon = null;
    if (couponCode)
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });

    const { subtotal, discount, deliveryFee, total } = calculateTotals(validated, coupon);

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

    await Promise.all(
      validated.map((it) =>
        Product.updateOne({ _id: it.productId }, { $inc: { stock: -it.quantity } })
      )
    );

    if (coupon) await Coupon.updateOne({ _id: coupon._id }, { $inc: { usageCount: 1 } });

    // If online payment, create Razorpay order
    if (paymentMethod === "online") {
      const rzp = await getRazorpay();
      const razorpayOrder = await rzp.orders.create({
        amount: Math.round(total * 100), // paise
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
// Called by frontend after Razorpay success. Verifies signature.
router.post("/verify-payment", async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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
  if (!orderNumber || !mobile) {
    return res.status(400).json({ error: "Order number and mobile required" });
  }
  const order = await Order.findOne({
    orderNumber: orderNumber.trim(),
    "customer.mobile": mobile.trim(),
  });
  if (!order) return res.status(404).json({ error: "No order found with these details" });
  res.json(order);
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