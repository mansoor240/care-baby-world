import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import { requireCustomer } from "../middleware/customerAuth.js";

const router = Router();

function signToken(customerId) {
  return jwt.sign({ role: "customer", customerId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// POST /api/customers/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ error: "Name, mobile and password are required" });
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: "Enter a valid 10-digit Indian mobile number" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await Customer.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ error: "An account with this mobile already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      mobile,
      email: email || "",
      passwordHash,
    });

    const token = signToken(customer._id);
    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create account" });
  }
});

// POST /api/customers/login
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ error: "Mobile and password are required" });
    }

    const customer = await Customer.findOne({ mobile });
    if (!customer) {
      return res.status(401).json({ error: "Invalid mobile or password" });
    }

    const ok = await bcrypt.compare(password, customer.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid mobile or password" });
    }

    const token = signToken(customer._id);
    res.json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not log in" });
  }
});

// GET /api/customers/me
router.get("/me", requireCustomer, async (req, res) => {
  const customer = await Customer.findById(req.customerId).select("-passwordHash");
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

// PUT /api/customers/me — update name/email/addresses
router.put("/me", requireCustomer, async (req, res) => {
  const { name, email, addresses } = req.body;
  const update = {};
  if (name) update.name = name;
  if (email !== undefined) update.email = email;
  if (addresses) update.addresses = addresses;

  const customer = await Customer.findByIdAndUpdate(req.customerId, update, { new: true }).select("-passwordHash");
  res.json(customer);
});

// GET /api/customers/me/orders — order history
router.get("/me/orders", requireCustomer, async (req, res) => {
  const customer = await Customer.findById(req.customerId);
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  // Find orders by this customer's mobile (matches guest orders too)
  const orders = await Order.find({ "customer.mobile": customer.mobile })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(orders);
});

export default router;