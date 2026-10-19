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

    // Re-scan on DOM changes (dynamic content)
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(() => {
        const newEls = document.querySelectorAll(
          ".reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)"
        );
        newEls.forEach((el) => observer.observe(el));
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}