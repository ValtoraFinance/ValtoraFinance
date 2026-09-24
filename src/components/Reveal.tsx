"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `is-in` to every `.reveal` element as it scrolls into view. One
 * observer for the whole page keeps sections free of wrapper elements,
 * which would otherwise break grid and flex layouts.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const scan = () => {
      document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
