import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// GET /api/products?search=&category=&minPrice=&maxPrice=&age=&sort=&page=&limit=&featured=&bestseller=
router.get("/", async (req, res) => {
  const {
    search = "",
    category = "",
    minPrice,
    maxPrice,
    age,
    sort = "popular",
    page = 1,
    limit = 12,
    featured,
    bestseller,
  } = req.query;

    const filter = {};

  if (search && search.trim()) {
    const rx = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: rx },
      { description: rx },
      { brand: rx },
      { tags: rx },
    ];
  }
  if (category) filter.categorySlug = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (age) filter.ageRange = { $regex: age, $options: "i" };
  if (featured === "true") filter.featured = true;
  if (bestseller === "true") filter.bestseller = true;

  const sortMap = {
    popular: { rating: -1, reviewCount: -1 },
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.popular).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

router.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ error: "Product not found" });

  const related = await Product.find({
    categorySlug: product.categorySlug,
    _id: { $ne: product._id },
  })
    .limit(4)
    .select("name slug images price originalPrice rating reviewCount stock");

  res.json({ product, related });
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;