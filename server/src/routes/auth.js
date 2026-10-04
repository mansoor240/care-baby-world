import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// POST /api/auth/admin-login { username, password }
router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
});

export default router;