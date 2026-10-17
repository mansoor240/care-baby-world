import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the initial fade-in actually animates
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        mounted
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
    >
      {children}
    </div>
  );
}