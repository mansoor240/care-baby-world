import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";
import { categoriesSeed, productsSeed } from "./seedProducts.js";

async function run() {
  await connectDB();
  console.log("🧹 Clearing old data…");
  await Promise.all([Product.deleteMany({}), Category.deleteMany({}), Coupon.deleteMany({})]);

  console.log("🌱 Seeding categories…");
  await Category.insertMany(categoriesSeed);

  console.log("🌱 Seeding products…");
  await Product.insertMany(productsSeed);

  console.log("🎟️  Seeding coupons…");
  await Coupon.insertMany([
    {
      code: "WELCOME10", type: "percentage", value: 10,
      minOrderAmount: 499, active: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      code: "TINY100", type: "fixed", value: 100,
      minOrderAmount: 799, active: true,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log("✅ Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});