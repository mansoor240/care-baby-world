import jwt from "jsonwebtoken";

export function requireCustomer(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Please log in" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "customer") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.customerId = payload.customerId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

// Optional auth — doesn't fail if no token, but attaches customerId if present
export function optionalCustomer(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === "customer") {
      req.customerId = payload.customerId;
    }
  } catch {
    // silent — treat as guest
  }
  next();
}