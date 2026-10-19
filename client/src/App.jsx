import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useReveal } from "./hooks/useReveal";
import PageTransition from "./components/PageTransition";


import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import BottomNav from "./components/layout/BottomNav";
import WhatsAppFloat from "./components/whatsapp/WhatsAppButton";
import ScrollTop from "./components/layout/ScrollTop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Policies from "./pages/Policies";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyAccount from "./pages/MyAccount";
import OrderDetail from "./pages/OrderDetail";
import TrackOrder from "./pages/TrackOrder";

import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminCategories from "./components/admin/AdminCategories";
import AdminCoupons from "./components/admin/AdminCoupons";
import AdminLayout from "./components/admin/AdminLayout";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RequireAdmin({ children }) {
  const { isAdmin, ready } = useAuth();
  if (!ready) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppFloat />
      <ScrollTop />
    </div>
  );
}

export default function App() {
  useReveal();
  return (
    <AuthProvider>
      <CustomerProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Routes>
              {/* Store */}
              <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
              <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
              <Route path="/category/:slug" element={<StoreLayout><Category /></StoreLayout>} />
              <Route path="/product/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
              <Route path="/search" element={<StoreLayout><Search /></StoreLayout>} />
              <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
              <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
              <Route path="/order/:orderNumber" element={<StoreLayout><OrderConfirmation /></StoreLayout>} />
              <Route path="/wishlist" element={<StoreLayout><Wishlist /></StoreLayout>} />
              <Route path="/account" element={<StoreLayout><MyAccount /></StoreLayout>} />
              <Route path="/account/orders/:id" element={<StoreLayout><OrderDetail /></StoreLayout>} />
              <Route path="/policies/:slug" element={<StoreLayout><Policies /></StoreLayout>} />
               <Route path="/faq" element={<StoreLayout><FAQ /></StoreLayout>} />
              <Route path="/track" element={<StoreLayout><TrackOrder /></StoreLayout>} />
              <Route path="/signup" element={<StoreLayout><Signup /></StoreLayout>} />
              <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>

              <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}
  