"use client";
import { useState, useEffect } from "react";

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
    document.body.classList.add("loaded");
  }, []);

  return (
    isRendered ? children : (
      <div className="flex items-center justify-center w-screen h-[100vh]">
        <div className="text-[30pt] sm:text-[40pt] md:text-[50pt] lg:text-[60pt] xl:text-[80pt] animate-pulse">
          💪💪🏻💪🏼💪🏽💪🏾💪🏿
        </div>
      </div>)
  )
}
