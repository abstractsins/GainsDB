"use client";
import { useState, useEffect } from "react";

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
    document.body.classList.add("loaded");
  }, []);

  return isRendered ? children : <div className="flex justify-center w-screen h-screen"><div className="text-[20pt] sm:text-[50pt] md:text-[65pt] lg:text-[70pt] xl:text-[80pt]">💪💪🏻💪🏼💪🏽💪🏾💪🏿</div></div>;
}
