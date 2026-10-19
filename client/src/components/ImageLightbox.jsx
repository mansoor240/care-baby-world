import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({
  images,
  activeIndex,
  onClose,
  onChange,
}) {
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && canGoPrev) onChange(activeIndex - 1);
    if (e.key === "ArrowRight" && canGoNext) onChange(activeIndex + 1);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-ink-900/95 p-4"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Prev */}
        {canGoPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(activeIndex - 1);
            }}
            className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next */}
        {canGoNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(activeIndex + 1);
            }}
            className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Image */}
        <motion.img
          key={activeIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          src={images[activeIndex]}
          alt={`Image ${activeIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}