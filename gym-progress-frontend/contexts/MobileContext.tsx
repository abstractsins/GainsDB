import { createContext, useContext } from "react";

export const MobileContext = createContext<boolean | undefined>(undefined);

export const useIsMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error("useIsMobile must be used within a MobileProvider");
  }
  return context;
};
