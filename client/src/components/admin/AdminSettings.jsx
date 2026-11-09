import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

const POLICY_TABS = [
  { key: "shipping", label: "Shipping" },
  { key: "returns", label: "Returns & Refunds" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms & Conditions" },
];

export default function AdminSettings() {
  const [coupons, setCoupons] = useState([]);
  const [homeOffer, setHomeOffer] = useState("");
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [savingOffer, setSavingOffer] = useState(false);

  const [policies, setPolicies] = useState({
    shipping: "",
    returns: "",
    privacy: "",
    terms: "",
  });
  const [activeTab, setActiveTab] = useState("shipping");
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [savingPolicies, setSavingPolicies] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/admin/coupons"),
      api.get("/settings/admin/home-offer"),
    ])
      .then(([c, s]) => {
        setCoupons(c.data || []);
        setHomeOffer(s.data.homeOfferCouponCode || "");
      })
      .catch(() => toast.error("Could not load offer settings"))
      .finally(() => setLoadingCoupons(false));

    api
      .get("/settings/admin/policies")
      .then((r) => {
        setPolicies({
          shipping: r.data.policies?.shipping || "",
          returns: r.data.policies?.returns || "",
          privacy: r.data.policies?.privacy || "",
          terms: r.data.policies?.terms || "",
        });
        setLastUpdated(r.data.lastUpdated || null);
      })
      .catch(() => toast.error("Could not load policies"))
      .finally(() => setLoadingPolicies(false));
  }, []);

  const saveOffer = async () => {
    setSavingOffer(true);
    try {
      await api.put("/settings/admin/home-offer", {
        homeOfferCouponCode: homeOffer,
      });
      toast.success(homeOffer ? "Banner updated" : "Banner hidden");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save");
    } finally {
      setSavingOffer(false);
    }
  };

  const savePolicies = async () => {
    setSavingPolicies(true);
    try {
      await api.put("/settings/admin/policies", { policies });
      setLastUpdated(new Date().toISOString());
      toast.success("Policies saved");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save policies");
    } finally {
      setSavingPolicies(false);
    }
  };

  const activeCoupons = coupons.filter((c) => c.active);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Control what shoppers see on the home page and in the footer.
      </p>

      {/* ── Home offer banner ── */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Home page offer banner</h2>
        <p className="mt-1 text-sm text-ink-500">
          Pick which active coupon to feature on the home page, or choose "No
          banner" to hide it.
        </p>

        {loadingCoupons ? (
          <div className="mt-4 h-12 skeleton rounded-2xl" />
        ) : (
          <>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-ink-700">
                Featured coupon
              </span>
              <select
                value={homeOffer}
                onChange={(e) => setHomeOffer(e.target.value)}
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

            {homeOffer && activeCoupons.find((c) => c.code === homeOffer) && (
              <div className="mt-4 rounded-2xl bg-blush-50 p-4 text-sm text-ink-700">
                Preview: On the home page, shoppers will see{" "}
                <span className="font-semibold">"Use code {homeOffer}"</span>{" "}
                with the discount above.
              </div>
            )}

            {!activeCoupons.length && (
              <div className="mt-4 rounded-2xl bg-sand-50 p-4 text-sm text-ink-700">
                You have no active coupons yet. Create one in{" "}
                <a href="/admin/coupons" className="underline">
                  Coupons
                </a>{" "}
                first.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveOffer}
                disabled={savingOffer}
                className="rounded-full bg-ink-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
              >
                {savingOffer ? "Saving…" : "Save banner"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Policies ── */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg">Store policies</h2>
            <p className="mt-1 text-sm text-ink-500">
              These appear on the footer pages: /policies/shipping,
              /policies/returns, /policies/privacy, /policies/terms.
            </p>
          </div>
        </div>

        {lastUpdated && (
          <p className="mt-2 text-xs text-ink-400">
            Last updated:{" "}
            {new Date(lastUpdated).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}

        {loadingPolicies ? (
          <div className="mt-4 h-64 skeleton rounded-2xl" />
        ) : (
          <>
            {/* Tabs */}
            <div className="mt-4 flex flex-wrap gap-1 border-b border-ink-900/10">
              {POLICY_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`rounded-t-xl px-4 py-2 text-sm font-medium transition ${
                    activeTab === t.key
                      ? "bg-blush-50 text-blush-600 border-b-2 border-blush-500"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="mt-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink-700">
                  Content for{" "}
                  {POLICY_TABS.find((t) => t.key === activeTab)?.label}
                </span>
                <textarea
                  rows={14}
                  value={policies[activeTab] || ""}
                  onChange={(e) =>
                    setPolicies({ ...policies, [activeTab]: e.target.value })
                  }
                  className="w-full rounded-2xl border border-ink-900/10 bg-cream px-4 py-3 text-sm font-mono leading-relaxed"
                  placeholder="Write the policy text here. Line breaks are preserved on the storefront."
                />
              </label>

              <p className="mt-2 text-xs text-ink-400">
                Line breaks are preserved. Use plain text — no HTML.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <a
                href={`/policies/${activeTab}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ink-900/10 px-5 py-2.5 text-sm"
              >
                Preview →
              </a>
              <button
                onClick={savePolicies}
                disabled={savingPolicies}
                className="rounded-full bg-ink-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
              >
                {savingPolicies ? "Saving…" : "Save policies"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}