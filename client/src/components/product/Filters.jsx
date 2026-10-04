import { useState } from "react";

export default function Filters({ value, onChange, categories = [] }) {
  const [open, setOpen] = useState(false);
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="rounded-3xl bg-white p-4 shadow-card">
      <button
        className="flex w-full items-center justify-between md:hidden"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium">Filters</span>
        <span className="text-ink-500">{open ? "−" : "+"}</span>
      </button>

      <div className={`${open ? "block" : "hidden"} md:block mt-4 space-y-6`}>
        {/* Category */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Category</h4>
          <select
            value={value.category || ""}
            onChange={(e) => set({ category: e.target.value })}
            className="w-full rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Price (₹)</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={value.minPrice || ""}
              onChange={(e) => set({ minPrice: e.target.value })}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm"
            />
            <span>–</span>
            <input
              type="number"
              placeholder="Max"
              value={value.maxPrice || ""}
              onChange={(e) => set({ maxPrice: e.target.value })}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Age */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Age</h4>
          <div className="flex flex-wrap gap-2">
            {["0-3m", "3-6m", "6-12m", "1y+"].map((a) => (
              <button
                key={a}
                onClick={() => set({ age: value.age === a ? "" : a })}
                className={`rounded-full px-3 py-1.5 text-xs border transition ${
                  value.age === a
                    ? "border-blush-400 bg-blush-50 text-blush-500"
                    : "border-ink-900/10 bg-white text-ink-700"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
  onClick={() =>
    onChange({
      category: "",
      minPrice: "",
      maxPrice: "",
      age: "",
      sort: "popular",
      page: 1,
    })
  }
  className="w-full rounded-full border border-ink-900/10 py-2 text-sm text-ink-700 hover:bg-cream"
>
  Clear filters
</button>
      </div>
    </div>
  );
}