import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

export default function AdminSettings() {
  const [coupons, setCoupons] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/admin/coupons"),
      api.get("/settings/admin/home-offer"),
    ])
      .then(([c, s]) => {
        setCoupons(c.data || []);
        setSelected(s.data.homeOfferCouponCode || "");
      })
      .catch(() => toast.error("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/settings/admin/home-offer", {
        homeOfferCouponCode: selected,
      });
      toast.success(selected ? "Banner updated" : "Banner hidden");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const activeCoupons = coupons.filter((c) => c.active);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Control what shoppers see on the home page.
      </p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Home page offer banner</h2>
        <p className="mt-1 text-sm text-ink-500">
          Pick which active coupon to feature on the home page. Choose
          "No banner" to hide it.
        </p>

        {loading ? (
          <div className="mt-4 h-12 skeleton rounded-2xl" />
        ) : (
          <>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-ink-700">
                Featured coupon
              </span>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm"
              >
                <option value="">— No banner (hide from home) —</option>
                {activeCoupons.map((c) => (
                  <option key={c._id} value={c.code}>
                    {c.code} ·{" "}
                    {c.type === "percentage"
                      ? `${c.value}% off`
                      : `₹${c.value} off`}
                    {c.minOrderAmount > 0
                      ? ` · min ₹${c.minOrderAmount}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            {selected && activeCoupons.find((c) => c.code === selected) && (
              <div className="mt-4 rounded-2xl bg-blush-50 p-4 text-sm text-ink-700">
                Preview: On the home page, shoppers will see
                <span className="mx-1 font-semibold">"Use code {selected}"</span>
                with the discount described above.
              </div>
            )}

            {!activeCoupons.length && (
              <div className="mt-4 rounded-2xl bg-sand-50 p-4 text-sm text-ink-700">
                You have no active coupons yet. Create one in{" "}
                <a href="/admin/coupons" className="underline">
                  Coupons
                </a>{" "}
                first, then come back here.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-full bg-ink-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-cream p-6 text-sm text-ink-600">
        <div className="font-semibold text-ink-900 mb-1">How it works</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Only <strong>active</strong> coupons appear in the dropdown.</li>
          <li>If you deactivate the featured coupon later, the banner auto-hides.</li>
          <li>Select "No banner" to turn it off entirely.</li>
        </ul>
      </div>
    </div>
  );
}