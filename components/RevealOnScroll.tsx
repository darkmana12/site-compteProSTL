"use client";

import { useEffect, useRef } from "react";

export function RevealOnScroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    el.querySelectorAll(".reveal-on-scroll").forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className || undefined}>
      {children}
    </div>
  );
}
