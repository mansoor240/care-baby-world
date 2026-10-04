# 🧸 CareBabyStore Baby Store — MERN E-commerce Template

A complete, production-quality e-commerce MVP for small local baby-product
shops. Built with **MongoDB + Express + React (Vite) + Node.js** using **plain
JavaScript (JSX)**.

## ✨ Features

- Modern, warm, mobile-first storefront
- Product catalogue with search, filters, sort, and pagination
- Category pages with SEO-friendly slugs
- Product detail with gallery, variants, pincode check
- Cart with persistence (localStorage)
- Coupon validation (server-side)
- Checkout with Indian address fields + COD + online payment abstraction
- Order confirmation page
- WhatsApp integration throughout
- Wishlist
- Protected admin dashboard (products, orders, categories, coupons)
- Server-side price/total calculation (never trusts client)
- Sample products and categories with seed script

## 🧱 Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT
**Frontend:** React 18, Vite, React Router, Tailwind CSS, Zustand, Axios

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone <your-repo> CareBabyStore
cd CareBabyStore

# Backend
cd server && npm install

# Frontend
cd ../client && npm install