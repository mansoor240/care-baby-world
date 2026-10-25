import { Router } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import { requireAdmin } from "../middleware/auth.js";
import { slugify } from "../utils/slugify.js";

const router = Router();
router.use(requireAdmin);

/* ── Products ───────────────────────────────────────── */
router.get("/products", async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/products", async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug) body.slug = slugify(body.name);

    // Auto-set hasVariants + recalc parent price/stock from variants
    if (Array.isArray(body.variants) && body.variants.length > 0) {
      body.hasVariants = true;
      body.stock = body.variants.reduce(
        (sum, v) => sum + (Number(v.stock) || 0),
        0
      );
      body.price = Math.min(
        ...body.variants.map((v) => Number(v.price) || 0)
      );
    } else {
      body.hasVariants = false;
      body.variants = [];
    }

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const body = { ...req.body };

    // ─── Desync guard ────────────────────────────────
    // If this product ALREADY has variants in DB, but the request
    // didn't send `variants` (e.g. quick +/-, or batch stock update),
    // don't overwrite the auto-calculated parent stock/price.
    if (!body.variants) {
      const existing = await Product.findById(req.params.id).select(
        "variants hasVariants"
      );
      if (existing?.hasVariants && existing.variants?.length > 0) {
        delete body.stock;
        delete body.price;
      }
    }

    // If variants ARE sent → recalc parent price/stock from them
    if (Array.isArray(body.variants)) {
      if (body.variants.length > 0) {
        body.hasVariants = true;
        body.stock = body.variants.reduce(
          (sum, v) => sum + (Number(v.stock) || 0),
          0
        );
        body.price = Math.min(
          ...body.variants.map((v) => Number(v.price) || 0)
        );
      } else {
        // Variants array explicitly emptied → flip to simple product
        body.hasVariants = false;
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ── Orders ─────────────────────────────────────────── */
router.get("/orders", async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(order);
});

// DELETE /api/admin/orders/:id
// Only cancelled orders can be deleted (prevents accidental data loss)
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "cancelled") {
      return res.status(400).json({
        error: "Only cancelled orders can be deleted. Cancel it first.",
      });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete order" });
  }
});

/* ── Categories ─────────────────────────────────────── */
router.get("/categories", async (_req, res) => {
  const cats = await Category.find().sort({ order: 1, name: 1 });
  res.json(cats);
});

router.post("/categories", async (req, res) => {
  const body = { ...req.body };
  if (!body.slug) body.slug = slugify(body.name);
  const cat = await Category.create(body);
  res.status(201).json(cat);
});

router.put("/categories/:id", async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(cat);
});

router.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ── Coupons ────────────────────────────────────────── */
router.get("/coupons", async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

router.post("/coupons", async (req, res) => {
  const body = { ...req.body };
  body.code = body.code?.toUpperCase();
  const coupon = await Coupon.create(body);
  res.status(201).json(coupon);
});

router.put("/coupons/:id", async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(coupon);
});

router.delete("/coupons/:id", async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ── Stats ──────────────────────────────────────────── */
router.get("/stats", async (_req, res) => {
  const [products, orders, coupons, revenueAgg] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Coupon.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);
  res.json({
    products,
    orders,
    coupons,
    revenue: revenueAgg[0]?.total || 0,
  });
});

export default router;