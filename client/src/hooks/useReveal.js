import { useEffect } from "react";

/**
 * Adds `.visible` class to elements with reveal classes
 * when they enter the viewport.
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    // If IntersectionObserver isn't supported (very old browsers), show immediately
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}