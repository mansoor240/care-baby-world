import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PRODUCTS = [
  { emoji: "🧸", name: "Plush Teddy", color: "from-blush-100 to-blush-200 dark:from-blush-400/20 dark:to-blush-400/10", delay: 0, dir: "left" },
  { emoji: "🍼", name: "Feeding Bottle", color: "from-sky-100 to-sky-200 dark:from-sky-400/20 dark:to-sky-400/10", delay: 0.15, dir: "top" },
  { emoji: "🧣", name: "Soft Swaddle", color: "from-sage-100 to-sage-200 dark:from-sage-400/20 dark:to-sage-400/10", delay: 0.3, dir: "right" },
  { emoji: "🪀", name: "Wooden Rattle", color: "from-lavender-100 to-lavender-200 dark:from-lavender-400/20 dark:to-lavender-400/10", delay: 0.45, dir: "bottom" },
  { emoji: "🧦", name: "Tiny Socks", color: "from-sand-100 to-sand-200 dark:from-sand-400/20 dark:to-sand-400/10", delay: 0.6, dir: "left" },
];

const initialPositions = {
  left: { x: -200, y: 0, rotate: -25 },
  right: { x: 200, y: 0, rotate: 25 },
  top: { x: 0, y: -150, rotate: 15 },
  bottom: { x: 0, y: 150, rotate: -15 },
};

export default function ScrollShowcase() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Camera/zoom effect
  const containerScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);
  const containerRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  // Headline reveal
  const headlineOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.3, 0.5], [30, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-cream via-lavender-50 to-cream py-24 dark:from-night-900 dark:via-night-800 dark:to-night-900"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-blush-200 blur-3xl dark:bg-blush-400" />
        <div className="absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-sky-200 blur-3xl dark:bg-sky-400" />
        <div className="absolute bottom-[10%] left-[30%] h-40 w-40 rounded-full bg-sage-200 blur-3xl dark:bg-sage-400" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blush-500 shadow-card backdrop-blur dark:bg-night-800/80 dark:text-blush-300">
            ✨ Little Wonders
          </div>
          <h2 className="mt-4 font-display text-3xl text-ink-900 sm:text-4xl md:text-5xl dark:text-night-50">
            A World of <span className="text-blush-400 dark:text-blush-300">Little</span> Wonders
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-500 dark:text-night-300">
            Handpicked baby essentials, crafted with love for the smallest members of your family.
          </p>
        </motion.div>

        {/* Floating products scene */}
        <div className="relative mt-16 h-[500px] md:h-[600px]" style={{ perspective: 1200 }}>
          <motion.div
            style={{ scale: containerScale, rotateZ: containerRotate }}
            className="relative h-full w-full"
          >
            {PRODUCTS.map((product, i) => {
              const start = initialPositions[product.dir];
              return (
                <motion.div
                  key={product.name}
                  initial={{
                    opacity: 0,
                    x: start.x * 2,
                    y: start.y * 2,
                    rotate: start.rotate * 2,
                    scale: 0.5,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 1.2,
                    delay: product.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`absolute ${
                    i === 0 ? "left-[8%] top-[10%]" :
                    i === 1 ? "right-[12%] top-[15%]" :
                    i === 2 ? "left-[20%] bottom-[20%]" :
                    i === 3 ? "right-[20%] bottom-[15%]" :
                    "left-[45%] top-[40%]"
                  }`}
                >
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      rotate: [-3, 3, -3],
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                    className={`relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${product.color} shadow-soft md:h-40 md:w-40 dark:shadow-none`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span className="text-6xl md:text-7xl select-none">{product.emoji}</span>

                    {/* Small floating dot */}
                    <motion.div
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: product.delay }}
                      className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-white shadow-card dark:bg-night-700"
                    />
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: product.delay + 0.6, duration: 0.4 }}
                    className="mt-3 text-center text-xs font-medium text-ink-700 dark:text-night-100"
                  >
                    {product.name}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Cinematic headline reveal */}
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-blush-400 dark:text-blush-300">
              LittleOnes
            </div>
            <h3 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl md:text-6xl dark:text-night-50">
              Little Things. <br />
              <span className="italic text-blush-400 dark:text-blush-300">Endless Love.</span>
            </h3>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-white hover:bg-ink-700 transition-all hover:shadow-soft hover:-translate-y-0.5 active:scale-95 dark:bg-blush-500 dark:hover:bg-blush-400"
          >
            Explore All Products
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}