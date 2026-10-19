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
          className="group rounded-3xl bg-white p-4 text-center shadow-card transition-shadow duration-300 hover:shadow-soft"
        >
          <div
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-50 text-2xl transition-transform duration-300 group-hover:scale-110"
            style={{ transform: "translateZ(30px)" }}
          >
            {category.emoji || "🧸"}
          </div>
          <div
            className="mt-3 text-sm font-medium text-ink-900 transition-colors group-hover:text-blush-500"
            style={{ transform: "translateZ(20px)" }}
          >
            {category.name}
          </div>
        </motion.div>
      </div>
    </Link>
  );
}