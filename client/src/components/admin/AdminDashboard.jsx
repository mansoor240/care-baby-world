import { useEffect, useState } from "react";
import api from "../../api/client";
import { formatPrice } from "../../lib/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Overview of your store</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products", value: stats?.products },
          { label: "Orders", value: stats?.orders },
          { label: "Coupons", value: stats?.coupons },
          { label: "Revenue", value: stats ? formatPrice(stats.revenue) : null },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl bg-white p-5 shadow-card">
            <div className="text-xs text-ink-500">{s.label}</div>
            <div className="mt-1 font-display text-2xl">{s.value ?? "…"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}