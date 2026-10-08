import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="hidden md:grid fixed bottom-24 right-6 z-30 h-11 w-11 place-items-center rounded-full bg-ink-900 text-white shadow-soft transition-all hover:bg-ink-700 hover:-translate-y-0.5 active:scale-95"
    >
      <ArrowUp size={18} />
    </button>
  );
}