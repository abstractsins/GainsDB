"use client";

import { createContext, useContext, type ReactNode } from "react";
import { mobileMaxWidth } from "@/constants/generalConstants";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const MobileContext = createContext<boolean | undefined>(undefined);

export function MobileProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery(`(max-width: ${mobileMaxWidth}px)`);

  return (
    <MobileContext.Provider value={isMobile}>
      {children}
    </MobileContext.Provider>
  );
}

export const useIsMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error("useIsMobile must be used within a MobileProvider");
  }
  return context;
};
