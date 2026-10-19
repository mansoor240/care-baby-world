import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue } from "framer-motion";

export function MagneticButton({
  children,
  className = "",
  strength = 30,
  href,
  ...props
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="inline-block"
    >
      {href ? (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      ) : (
        <Link className={className} {...props}>
          {children}
        </Link>
      )}
    </motion.div>
  );
}

export default MagneticButton;