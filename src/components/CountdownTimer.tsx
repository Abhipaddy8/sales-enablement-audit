"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  variant?: "light" | "dark"; // light = for dark backgrounds (white text), dark = for light backgrounds
  size?: "sm" | "md";
}

export default function CountdownTimer({ variant = "light", size = "md" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

  useEffect(() => {
    let start = localStorage.getItem("sea_timer_start");
    if (!start) {
      start = Date.now().toString();
      localStorage.setItem("sea_timer_start", start);
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - parseInt(start!);
      const remaining = Math.max(0, 48 * 60 * 60 * 1000 - elapsed);
      setTimeLeft({
        hours: Math.floor(remaining / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLight = variant === "light";
  const boxClass = isLight ? "bg-white/10" : "bg-[#032d60]";
  const numClass = isLight ? "text-white" : "text-white";
  const labelClass = isLight ? "text-blue-300" : "text-blue-200";
  const colonClass = isLight ? "text-white" : "text-[#032d60]";
  const numSize = size === "sm" ? "text-xl" : "text-2xl";

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`${boxClass} rounded-lg px-3 py-2 min-w-[48px] text-center`}>
        <span className={`${numSize} font-bold ${numClass} tabular-nums`}>{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className={`text-[10px] ${labelClass} block -mt-1`}>HRS</span>
      </div>
      <span className={`text-lg font-bold ${colonClass}`}>:</span>
      <div className={`${boxClass} rounded-lg px-3 py-2 min-w-[48px] text-center`}>
        <span className={`${numSize} font-bold ${numClass} tabular-nums`}>{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className={`text-[10px] ${labelClass} block -mt-1`}>MIN</span>
      </div>
      <span className={`text-lg font-bold ${colonClass}`}>:</span>
      <div className={`${boxClass} rounded-lg px-3 py-2 min-w-[48px] text-center`}>
        <span className={`${numSize} font-bold ${numClass} tabular-nums`}>{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className={`text-[10px] ${labelClass} block -mt-1`}>SEC</span>
      </div>
    </div>
  );
}
