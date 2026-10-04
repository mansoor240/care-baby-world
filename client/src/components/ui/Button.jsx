export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  const variants = {
    primary: "bg-ink-900 text-white hover:bg-ink-700",
    blush: "bg-blush-400 text-white hover:bg-blush-500",
    outline: "border border-ink-900/15 bg-white text-ink-900 hover:bg-cream",
    ghost: "text-ink-900 hover:bg-cream",
    soft: "bg-blush-100 text-blush-500 hover:bg-blush-200",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}