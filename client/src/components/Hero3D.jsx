import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax - different depths move differently
  const cloudLeftX = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
  const cloudLeftY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);
  const cloudRightX = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
  const cloudRightY = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const teddyX = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const teddyY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);
  const starsX = useTransform(mouseX, [-0.5, 0.5], [-35, 35]);
  const starsY = useTransform(mouseY, [-0.5, 0.5], [-25, 25]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-4xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        background:
          "linear-gradient(135deg, #FDF2F5 0%, #FDFBF7 40%, #F0F6FB 100%)",
      }}
    >
      {/* Soft pastel blobs (background depth) */}
      <motion.div
        style={{
          x: cloudLeftX,
          y: cloudLeftY,
          transformStyle: "preserve-3d",
        }}
        className="absolute -top-12 -left-12 h-64 w-64 rounded-full opacity-60 blur-2xl"
      >
        <div className="h-full w-full rounded-full bg-blush-200" />
      </motion.div>

      <motion.div
        style={{
          x: cloudRightX,
          y: cloudRightY,
          transformStyle: "preserve-3d",
        }}
        className="absolute -bottom-16 -right-8 h-72 w-72 rounded-full opacity-50 blur-2xl"
      >
        <div className="h-full w-full rounded-full bg-sky-200" />
      </motion.div>

      {/* Floating stars layer */}
      <motion.div
        style={{ x: starsX, y: starsY }}
        className="absolute inset-0 pointer-events-none"
      >
        <span className="absolute left-[15%] top-[20%] text-2xl animate-twinkle">
          ⭐
        </span>
        <span
          className="absolute right-[20%] top-[30%] text-lg animate-twinkle"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </span>
        <span
          className="absolute left-[70%] top-[15%] text-xl animate-twinkle"
          style={{ animationDelay: "2s" }}
        >
          ⭐
        </span>
        <span
          className="absolute left-[25%] bottom-[25%] text-sm animate-twinkle"
          style={{ animationDelay: "0.5s" }}
        >
          ✨
        </span>
      </motion.div>

      {/* Left cloud */}
      <motion.div
        style={{ x: cloudLeftX, y: cloudLeftY }}
        className="absolute left-[8%] top-[15%] text-5xl animate-float-slow select-none pointer-events-none"
      >
        ☁️
      </motion.div>

      {/* Right cloud */}
      <motion.div
        style={{ x: cloudRightX, y: cloudRightY }}
        className="absolute right-[10%] top-[25%] text-4xl animate-float select-none pointer-events-none"
        aria-hidden="true"
      >
        ☁️
      </motion.div>

      {/* Center teddy */}
      <motion.div
        style={{ x: teddyX, y: teddyY }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative flex flex-col items-center">
          {/* Teddy with slight float */}
          <div className="text-[140px] sm:text-[180px] leading-none animate-float select-none pointer-events-none drop-shadow-2xl">
            🧸
          </div>

          {/* Small decorations under teddy */}
          <div className="absolute -bottom-4 flex gap-2">
            <span className="text-2xl animate-float-rotate-opp select-none pointer-events-none">
              🎀
            </span>
            <span
              className="text-2xl animate-float-rotate select-none pointer-events-none"
              style={{ animationDelay: "0.5s" }}
            >
              ⭐
            </span>
            <span
              className="text-2xl animate-float-rotate-opp select-none pointer-events-none"
              style={{ animationDelay: "1s" }}
            >
              🎀
            </span>
          </div>
        </div>
      </motion.div>

      {/* Rocking horse (side) */}
      <motion.div
        style={{ x: cloudLeftX, y: cloudLeftY }}
        className="absolute left-[5%] bottom-[12%] text-4xl animate-float-rotate select-none pointer-events-none"
      >
        🐴
      </motion.div>

      {/* Baby blocks (bottom right) */}
      <motion.div
        style={{ x: cloudRightX, y: cloudRightY }}
        className="absolute right-[8%] bottom-[10%] flex gap-1 text-3xl animate-float-slow select-none pointer-events-none"
      >
        <span>🧱</span>
        <span style={{ animationDelay: "1s" }}>🧸</span>
      </motion.div>

      {/* Subtle sparkle dots (bottom) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        <span className="h-2 w-2 rounded-full bg-blush-300 animate-twinkle" />
        <span
          className="h-2 w-2 rounded-full bg-sky-300 animate-twinkle"
          style={{ animationDelay: "0.5s" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-sand-300 animate-twinkle"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}