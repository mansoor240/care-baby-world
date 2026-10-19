import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollRevealText({ text, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <h2 ref={ref} className={`${className} flex flex-wrap gap-x-2 gap-y-1`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        const y = useTransform(scrollYProgress, [start, end], [20, 0]);

        return (
          <motion.span
            key={i}
            style={{ opacity, y }}
            className="inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </h2>
  );
}