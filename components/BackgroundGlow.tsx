'use client';
import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";

export default function BackgroundGlow() {
  const [glow1, setGlow1] = useState({ x: 0, y: 0, r: 0 });
  const [glow2, setGlow2] = useState({ x: 0, y: 0, r: 0 });

  useAnimationFrame((t) => {
    setGlow1({
      x: Math.sin(t / 1200) * 80,
      y: Math.cos(t / 900) * 60,
      r: Math.sin(t / 1800) * 8,
    });
    setGlow2({
      x: Math.cos(t / 900) * 120,
      y: Math.sin(t / 700) * 90,
      r: Math.cos(t / 1600) * 10,
    });
  });

  return (
    <>
      {/* Glow-Effekte */}
      <motion.div
        className="pointer-events-none fixed left-[10%] top-[10%] z-0"
        style={{
          width: 600,
          height: 400,
          filter: "blur(120px)",
          background: "radial-gradient(circle, #ff0000 0%, transparent 70%)",
          opacity: 0.18,
          x: glow1.x,
          y: glow1.y,
          rotate: glow1.r,
        }}
      />
      <motion.div
        className="pointer-events-none fixed right-[5%] top-[40%] z-0"
        style={{
          width: 400,
          height: 320,
          filter: "blur(100px)",
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          opacity: 0.1,
          x: glow2.x,
          y: glow2.y,
          rotate: glow2.r,
        }}
      />
      <div
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 z-0"
        style={{
          width: 900,
          height: 400,
          filter: "blur(120px)",
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          opacity: 0.13,
        }}
      />
    </>
  );
}
