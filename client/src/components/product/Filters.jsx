import { useState } from "react";

export default function Filters({ value, onChange, categories = [] }) {
  const [open, setOpen] = useState(false);
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="rounded-3xl bg-white p-4 shadow-card dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5">
      <button
        className="flex w-full items-center justify-between md:hidden"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-ink-900 dark:text-night-50">Filters</span>
        <span className="text-ink-500 dark:text-night-300">{open ? "−" : "+"}</span>
      </button>

      <div className={`${open ? "block" : "hidden"} md:block mt-4 space-y-6`}>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-900 dark:text-night-50">Category</h4>
          <select
            value={value.category || ""}
            onChange={(e) => set({ category: e.target.value })}
            className="w-full rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm text-ink-900 dark:border-white/10 dark:bg-night-700 dark:text-night-50 focus:outline-none"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-900 dark:text-night-50">Price (₹)</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={value.minPrice || ""}
              onChange={(e) => set({ minPrice: e.target.value })}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:placeholder:text-night-400"
            />
            <span className="text-ink-500 dark:text-night-400">–</span>
            <input
              type="number"
              placeholder="Max"
              value={value.maxPrice || ""}
              onChange={(e) => set({ maxPrice: e.target.value })}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 dark:border-white/10 dark:bg-night-700 dark:text-night-50 dark:placeholder:text-night-400"
            />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-900 dark:text-night-50">Age</h4>
          <div className="flex flex-wrap gap-2">
            {["0-3m", "3-6m", "6-12m", "1y+"].map((a) => (
              <button
                key={a}
                onClick={() => set({ age: value.age === a ? "" : a })}
                className={`rounded-full px-3 py-1.5 text-xs border transition ${
                  value.age === a
                    ? "border-blush-400 bg-blush-50 text-blush-500 dark:border-blush-300 dark:bg-blush-400/20 dark:text-blush-300"
                    : "border-ink-900/10 bg-white text-ink-700 dark:border-white/10 dark:bg-night-700 dark:text-night-100"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onChange({
            category: "",
            minPrice: "",
            maxPrice: "",
            age: "",
            sort: "popular",
            page: 1,
          })}
          className="w-full rounded-full border border-ink-900/10 py-2 text-sm text-ink-700 hover:bg-cream dark:border-white/10 dark:text-night-100 dark:hover:bg-night-700 transition"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}