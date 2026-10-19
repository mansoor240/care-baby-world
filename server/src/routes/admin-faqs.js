import { Router } from "express";
import FAQ from "../models/FAQ.js";
import Question from "../models/Question.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAdmin);

// ─── FAQ MANAGEMENT ────────────────────────────────────

// GET /api/admin-faqs — all FAQs (published + unpublished)
router.get("/", async (_req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load FAQs" });
  }
});

// POST /api/admin-faqs — create FAQ
router.post("/", async (req, res) => {
  try {
    const { question, answer, category, order, published } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Question and answer are required" });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: (category || "General").trim(),
      order: Number(order) || 0,
      published: published !== false,
    });

    res.status(201).json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create FAQ" });
  }
});

// PUT /api/admin-faqs/:id — update FAQ
router.put("/:id", async (req, res) => {
  try {
    const { question, answer, category, order, published } = req.body;

    const update = {};
    if (question !== undefined) update.question = question.trim();
    if (answer !== undefined) update.answer = answer.trim();
    if (category !== undefined) update.category = category.trim();
    if (order !== undefined) update.order = Number(order) || 0;
    if (published !== undefined) update.published = Boolean(published);

    const faq = await FAQ.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update FAQ" });
  }
});

// DELETE /api/admin-faqs/:id — delete FAQ
router.delete("/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete FAQ" });
  }
});

// ─── CUSTOMER QUESTIONS ────────────────────────────────

// GET /api/admin-faqs/questions — all customer questions
router.get("/questions", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "answered", "ignored"].includes(status)) {
      filter.status = status;
    }
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load questions" });
  }
});

// PATCH /api/admin-faqs/questions/:id — update status
router.patch("/questions/:id", async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ["pending", "answered", "ignored"];

    const update = {};
    if (status && allowed.includes(status)) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const question = await Question.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update question" });
  }
});

// DELETE /api/admin-faqs/questions/:id
router.delete("/questions/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete question" });
  }
});

export default router;