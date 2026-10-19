import { Router } from "express";
import FAQ from "../models/FAQ.js";
import Question from "../models/Question.js";

const router = Router();

// ─── PUBLIC ROUTES ─────────────────────────────────────

// GET /api/faqs — public list (only published)
router.get("/", async (_req, res) => {
  try {
    const faqs = await FAQ.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .select("question answer category order");

    res.json(faqs);
  } catch (err) {
    console.error("FAQ list error:", err);
    res.status(500).json({ error: "Could not load FAQs" });
  }
});

// POST /api/faqs/ask — customer submits a question
router.post("/ask", async (req, res) => {
  try {
    const { name, mobile, email, question } = req.body;

    if (!question || question.trim().length < 5) {
      return res
        .status(400)
        .json({ error: "Question must be at least 5 characters" });
    }

    const q = await Question.create({
      name: (name || "Anonymous").trim(),
      mobile: (mobile || "").trim(),
      email: (email || "").trim(),
      question: question.trim(),
    });

    res.status(201).json({
      ok: true,
      message: "Thanks! We'll get back to you soon.",
      id: q._id,
    });
  } catch (err) {
    console.error("FAQ ask error:", err);
    res.status(500).json({ error: "Could not submit question" });
  }
});

export default router;