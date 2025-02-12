"use client"; // Mark this as a client component

import { useState, useEffect } from "react";

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
    document.body.classList.add("loaded"); // Apply loaded class to body
  }, []);

  return isRendered ? children : <p className="loading-text">Loading...</p>;
}
