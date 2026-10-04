import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { calculateTotals } from "../utils/totals.js";

const router = Router();

function genOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TN-${ts}${rand}`;
}

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { customer, items, paymentMethod, couponCode } = req.body;

    if (!customer || !items?.length)
      return res.status(400).json({ error: "Missing customer or items" });

    // Validate & re-price every item from DB (never trust client prices)
    const validated = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(400).json({ error: `Product not found: ${it.productId}` });
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
    if (couponCode) coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });

    const { subtotal, discount, deliveryFee, total } = calculateTotals(validated, coupon);

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      customer,
      items: validated,
      subtotal,
      deliveryFee,
      discount,
      total,
      couponCode: coupon?.code || "",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      status: "pending",
    });

    // Decrement stock
    await Promise.all(
      validated.map((it) =>
        Product.updateOne({ _id: it.productId }, { $inc: { stock: -it.quantity } })
      )
    );

    if (coupon) await Coupon.updateOne({ _id: coupon._id }, { $inc: { usageCount: 1 } });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});

// GET /api/orders/:orderNumber (public — for confirmation page)
router.get("/:orderNumber", async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;