# 🧸 CareBabyStore — MERN E-commerce Platform

A complete, production-ready e-commerce platform for small local baby-product shops.

Built with **MongoDB + Express + React (Vite) + Node.js**. Fully customizable and self-hostable.

---

## ✨ Features

### Storefront
- Modern, mobile-first design with soft baby-friendly colors
- Home page with hero, categories, featured products, bestsellers, reviews
- Product catalogue with search, category filter, price filter, age filter
- Product detail pages with image gallery, variants, pincode check
- Shopping cart with persistence (survives page refresh)
- Coupon codes (percentage & fixed discounts)
- Guest checkout + optional customer account
- Cash on Delivery + online payment support (Razorpay-ready)
- Order tracking by order number + mobile
- Customer account dashboard with order history and saved addresses
- Wishlist (persisted locally)
- WhatsApp contact buttons throughout
- Scroll animations, loading skeletons, empty states

### Admin Dashboard
- JWT-secured login
- Live dashboard with stats (products, orders, coupons, revenue)
- Product management (add / edit / delete / update stock / mark featured)
- Order management (view all orders, update status)
- Category management
- Coupon management
- Manual WhatsApp notify for order status changes

### Technical
- Server-side price recalculation (never trusts client)
- Stock validation on order placement
- JWT authentication for admin + customers
- MongoDB Atlas compatible
- Deployable to Vercel (frontend) + Render (backend)
- Seed script with demo products

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, Zustand, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## 📁 Project Structure
