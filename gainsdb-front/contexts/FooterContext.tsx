// context/FooterContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FooterContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <FooterContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) throw new Error("useFooter must be used within FooterProvider");
  return context;
};
