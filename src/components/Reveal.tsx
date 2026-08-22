"use client";

import React, { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const delayClass =
    delay >= 150
      ? "delay-4"
      : delay >= 100
      ? "delay-3"
      : delay >= 80
      ? "delay-2"
      : delay >= 60
      ? "delay-1"
      : "";

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
