import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue } from "framer-motion";
import { getCategoryIcon } from "./categoryIcons";

export default function CategoryCard3D({ category, index }) {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -12);
    rotateY.set(x * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <Link to={`/category/${category.slug}`} className="block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative overflow-hidden rounded-3xl bg-white p-5 text-center shadow-card transition-shadow duration-300 hover:shadow-soft dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
        >
          {/* subtle blush gradient behind icon */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-b from-blush-50 to-transparent dark:from-blush-400/10" />

          <div
            className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-50 text-blush-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-blush-100 dark:bg-blush-400/15 dark:text-blush-300 dark:group-hover:bg-blush-400/25"
            style={{ transform: "translateZ(30px)" }}
          >
            {getCategoryIcon(category.slug)}
          </div>

          <div
            className="relative mt-4 text-sm font-medium text-ink-900 transition-colors group-hover:text-blush-500 dark:text-night-50 dark:group-hover:text-blush-300"
            style={{ transform: "translateZ(20px)" }}
          >
            {category.name}
          </div>

          <div className="relative mt-1 text-[11px] uppercase tracking-wider text-ink-300 dark:text-night-400">
            Shop now
          </div>
        </motion.div>
      </div>
    </Link>
  );
}