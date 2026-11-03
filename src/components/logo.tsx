import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconWrapperSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const imgSizes = {
    sm: "h-5 w-5",
    md: "h-6.5 w-6.5",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={`group flex items-center gap-2.5 sm:gap-3 transition-all ${className}`}>
      {/* Icon Badge with Smart Logo */}
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-950/40 p-1 shadow-[0_0_18px_rgba(245,158,11,0.22)] backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/60 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] ${iconWrapperSizes[size]}`}
      >
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />
        
        <img
          src="/smart-logo-white.png"
          alt="Signal"
          className={`relative z-10 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.35)] transition-transform duration-300 group-hover:scale-105 ${imgSizes[size]}`}
        />
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className={`font-display font-bold tracking-tight text-[color:var(--foreground)] ${textSizes[size]}`}>
          Signal
        </span>
      )}
    </div>
  );
}
