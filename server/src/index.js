import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import ordersRouter from "./routes/orders.js";
import couponsRouter from "./routes/coupons.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
});