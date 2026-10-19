import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue } from "framer-motion";

export default function CategoryCard3D({ category, index }) {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -15);
    rotateY.set(x * 15);
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
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="group rounded-3xl bg-white p-4 text-center shadow-card transition-shadow duration-300 hover:shadow-soft dark:bg-night-800 dark:shadow-none dark:ring-1 dark:ring-white/5"
        >
          {/* Rotating emoji/icon */}
          <div
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-50 transition-transform duration-300 group-hover:scale-110 dark:bg-blush-400/15"
            style={{ transform: "translateZ(30px)" }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
              className="text-2xl select-none"
              aria-hidden="true"
            >
              {category.emoji || "🧸"}
            </motion.span>
          </div>
          <div
            className="mt-3 text-sm font-medium text-ink-900 transition-colors group-hover:text-blush-500 dark:text-night-50 dark:group-hover:text-blush-300"
            style={{ transform: "translateZ(20px)" }}
          >
            {category.name}
          </div>
        </motion.div>
      </div>
    </Link>
  );
}