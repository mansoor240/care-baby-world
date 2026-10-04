import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

router.get("/", async (_req, res) => {
  const cats = await Category.find().sort({ order: 1, name: 1 });
  res.json(cats);
});

router.get("/:slug", async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ error: "Category not found" });
  res.json(cat);
});

export default router;