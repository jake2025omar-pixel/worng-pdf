import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface FloatingShapes3DProps {
  className?: string;
  variant?: "hero" | "subtle";
}

export function FloatingShapes3D({ className = "", variant = "hero" }: FloatingShapes3DProps) {
  // Gentle mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 60 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 35;
      const y = (e.clientY - innerHeight / 2) / 35;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Dynamic Parallax Container */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="relative w-full h-full min-h-screen"
      >
        {/* 9. Large Sphere (340px behind) */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 30% 30%, #F5D6A2 0%, #F5B297 50%, #C78997 100%)",
            boxShadow: "inset -20px -20px 30px rgba(0,0,0,0.08), 0 30px 60px rgba(199,137,151,0.22)",
            opacity: 0.65,
            filter: "blur(0.5px)",
            animation: "floatDynamic 8.5s ease-in-out infinite",
            ["--duration" as any]: "8.5s",
            ["--r" as any]: "0deg",
          }}
        />

        {/* 1. Gemini Star Large (180px, top-right) */}
        <div
          className="absolute top-12 right-[5%] sm:right-[12%] w-[180px] h-[180px]"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            background: "radial-gradient(circle at 30% 30%, #F5D6A2, #F5B297, #C78997)",
            boxShadow: "0 0 40px rgba(245,178,151,0.55)",
            opacity: 0.88,
            animation: "floatDynamic 6.2s ease-in-out infinite",
            ["--duration" as any]: "6.2s",
            ["--r" as any]: "15deg",
          }}
        />

        {/* 2. Gemini Stars Small x3 (30-50px scattered) */}
        {/* Star 1: Dusty Rose */}
        <div
          className="absolute top-[28%] left-[8%] w-[42px] h-[42px]"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            background: "radial-gradient(circle at 30% 30%, #F5D6A2, #C78997)",
            boxShadow: "0 0 20px rgba(199,137,151,0.45)",
            opacity: 0.85,
            animation: "floatDynamic 5.4s ease-in-out infinite",
            ["--duration" as any]: "5.4s",
            ["--r" as any]: "-12deg",
          }}
        />

        {/* Star 2: Slate Blue */}
        <div
          className="absolute top-[55%] right-[6%] w-[48px] h-[48px]"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            background: "radial-gradient(circle at 30% 30%, #F5E4C4, #8A99B1)",
            boxShadow: "0 0 25px rgba(138,153,177,0.5)",
            opacity: 0.88,
            animation: "floatDynamic 7.1s ease-in-out infinite",
            ["--duration" as any]: "7.1s",
            ["--r" as any]: "24deg",
          }}
        />

        {/* Star 3: Light Sand */}
        <div
          className="absolute bottom-[18%] left-[22%] w-[32px] h-[32px]"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            background: "radial-gradient(circle at 30% 30%, #FFFFFF, #F5D6A2)",
            boxShadow: "0 0 16px rgba(245,214,162,0.6)",
            opacity: 0.9,
            animation: "floatDynamic 5.8s ease-in-out infinite",
            ["--duration" as any]: "5.8s",
            ["--r" as any]: "-8deg",
          }}
        />

        {/* 3. Torus Ring Large (160px, bottom-left) */}
        <div
          className="absolute bottom-[12%] left-[4%] w-[160px] h-[160px] rounded-full"
          style={{
            border: "20px solid rgba(245,178,151,0.78)",
            boxShadow: "0 20px 40px rgba(199,137,151,0.25), inset 0 4px 12px rgba(255,255,255,0.4)",
            opacity: 0.88,
            backdropFilter: "blur(8px)",
            animation: "floatDynamic 7.8s ease-in-out infinite",
            ["--duration" as any]: "7.8s",
            ["--r" as any]: "20deg",
          }}
        />

        {/* 4. Torus Ring Small (90px, top-center) */}
        <div
          className="absolute top-[8%] left-[28%] w-[90px] h-[90px] rounded-full"
          style={{
            border: "12px solid rgba(138,153,177,0.65)",
            boxShadow: "0 10px 25px rgba(138,153,177,0.3)",
            opacity: 0.85,
            backdropFilter: "blur(6px)",
            animation: "floatDynamic 6.6s ease-in-out infinite",
            ["--duration" as any]: "6.6s",
            ["--r" as any]: "-15deg",
          }}
        />

        {/* 5. Organic Blob (200px, center-right) */}
        <div
          className="absolute top-[42%] right-[10%] w-[200px] h-[200px]"
          style={{
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            background: "linear-gradient(135deg, #C78997, #F5B297)",
            boxShadow: "0 25px 60px rgba(199,137,151,0.35)",
            opacity: 0.82,
            filter: "blur(0.5px)",
            animation: "floatDynamic 8.2s ease-in-out infinite",
            ["--duration" as any]: "8.2s",
            ["--r" as any]: "10deg",
          }}
        />

        {/* 6. Crystal Diamond (70px, bottom-right) */}
        <div
          className="absolute bottom-[16%] right-[18%] w-[70px] h-[70px]"
          style={{
            transform: "rotate(45deg)",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F5E4C4 50%, #F5D6A2 100%)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 15px 35px rgba(245,214,162,0.45)",
            opacity: 0.88,
            backdropFilter: "blur(10px)",
            animation: "floatDynamic 6.9s ease-in-out infinite",
            ["--duration" as any]: "6.9s",
            ["--r" as any]: "45deg",
          }}
        />

        {/* 7. Squircle Superellipse (85px, top-left) */}
        <div
          className="absolute top-[16%] left-[4%] w-[85px] h-[85px]"
          style={{
            borderRadius: "32%",
            background: "linear-gradient(135deg, #8A99B1, #76859e)",
            boxShadow: "0 15px 35px rgba(138,153,177,0.4)",
            opacity: 0.88,
            animation: "floatDynamic 7.4s ease-in-out infinite",
            ["--duration" as any]: "7.4s",
            ["--r" as any]: "-10deg",
          }}
        />

        {/* 8. Capsule Pill (120x50px, middle-left) */}
        <div
          className="absolute top-[52%] left-[6%] w-[120px] h-[50px]"
          style={{
            borderRadius: "50px",
            background: "linear-gradient(135deg, #F5D6A2, #F5B297)",
            boxShadow: "0 12px 30px rgba(245,178,151,0.4)",
            opacity: 0.88,
            transform: "rotate(-20deg)",
            animation: "floatDynamic 6.5s ease-in-out infinite",
            ["--duration" as any]: "6.5s",
            ["--r" as any]: "-20deg",
          }}
        />

        {/* 10. Small Sphere (60px) */}
        <div
          className="absolute top-[36%] left-[36%] w-[60px] h-[60px] rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #9db1cb, #8A99B1)",
            boxShadow: "inset -6px -6px 12px rgba(0,0,0,0.15), 0 12px 28px rgba(138,153,177,0.4)",
            opacity: 0.88,
            animation: "floatDynamic 5.9s ease-in-out infinite",
            ["--duration" as any]: "5.9s",
            ["--r" as any]: "0deg",
          }}
        />
      </motion.div>
    </div>
  );
}
