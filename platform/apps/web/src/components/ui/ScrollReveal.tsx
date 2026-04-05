"use client";

import { useEffect, useRef, ReactNode } from "react";

export const ScrollReveal = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out z-20 relative animate-on-scroll ${className}`}
    >
      {children}
    </div>
  );
};
