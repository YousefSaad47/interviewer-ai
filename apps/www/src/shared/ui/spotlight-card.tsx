"use client";

import { useRef, useState } from "react";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(52, 211, 153, 0.10)",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) => {
  const divRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <section
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-[#F4FBF8] p-8 shadow-slate-900/8 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.10)] dark:border-[rgba(167,243,208,0.10)] dark:from-[rgba(20,32,38,0.98)] dark:to-[rgba(12,20,24,0.98)] dark:shadow-black/30 dark:hover:border-[rgba(52,211,153,0.28)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.24)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </section>
  );
};
