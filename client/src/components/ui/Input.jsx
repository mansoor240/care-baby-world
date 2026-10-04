export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-blush-400 focus:outline-none ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}