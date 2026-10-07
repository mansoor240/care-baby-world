import { useEffect } from "react";

/**
 * Adds `.visible` class to elements with reveal classes
 * when they enter the viewport.
 *
 * Runs on mount, and re-runs whenever the DOM changes
 * (so dynamic content like loaded categories also animates).
 */
export function useReveal() {
  useEffect(() => {
    let observer;

    const setup = () => {
      // Clean up previous observer
      if (observer) observer.disconnect();

      const els = document.querySelectorAll(
        ".reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)"
      );

      if (typeof IntersectionObserver === "undefined") {
        els.forEach((el) => el.classList.add("visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );

      els.forEach((el) => observer.observe(el));
    };

    // Initial scan
    setup();

    // Re-scan when DOM changes (dynamic content)
    const mutationObserver = new MutationObserver(() => {
      // Debounce: only run once per frame
      requestAnimationFrame(setup);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (observer) observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}