import React from "react";

interface ClayBackgroundProps {
  className?: string;
}

export function ClayBackground({ className = "" }: ClayBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none bg-[#F9F5EF] ${className}`}
      aria-hidden="true"
    >
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />

      {/* Blob 1: top-left 600x400px, #F5F0E8, border-radius 60% 40% 30% 70% / 60% 30% 70% 40% */}
      <div
        className="absolute -top-12 -left-16 w-[600px] h-[400px] pointer-events-none"
        style={{
          backgroundColor: "#F5F0E8",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          filter: "blur(40px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.02)",
        }}
      />

      {/* Blob 2: top-right 500x500px, #EDE7DE, border-radius 40% 60% 70% 30% */}
      <div
        className="absolute -top-10 -right-16 w-[500px] h-[500px] pointer-events-none"
        style={{
          backgroundColor: "#EDE7DE",
          borderRadius: "40% 60% 70% 30% / 50% 50% 50% 50%",
          filter: "blur(40px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.02)",
        }}
      />

      {/* Blob 3: bottom-right 700x400px, #E8DCC8 peach soft at 60% opacity */}
      <div
        className="absolute -bottom-16 -right-20 w-[700px] h-[400px] pointer-events-none"
        style={{
          backgroundColor: "#E8DCC8",
          opacity: 0.6,
          borderRadius: "50% 50% 40% 60% / 40% 60% 50% 50%",
          filter: "blur(40px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.02)",
        }}
      />

      {/* Blob 4: bottom-left small 300x300px, #D6E8E5 mint at 40% opacity like in image */}
      <div
        className="absolute bottom-12 -left-12 w-[300px] h-[300px] pointer-events-none"
        style={{
          backgroundColor: "#D6E8E5",
          opacity: 0.4,
          borderRadius: "55% 45% 40% 60% / 50% 60% 40% 50%",
          filter: "blur(40px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.02)",
        }}
      />

      {/* Blob 5: bottom-center 400x400px glass transparent blob like in image */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] pointer-events-none"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(24px)",
          borderRadius: "60% 40% 50% 50% / 50% 50% 40% 60%",
          filter: "blur(40px)",
          boxShadow: "0 20px 60px rgba(255, 255, 255, 0.6)",
        }}
      />
    </div>
  );
}
