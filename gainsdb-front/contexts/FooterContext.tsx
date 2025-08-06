// context/FooterContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FooterContextType = {
    isLoggedIn: boolean;
    isInRegistration: boolean;
    setIsLoggedIn: (val: boolean) => void;
    setIsInRegistration: (val: boolean) => void;
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
    const [isInRegistration, setIsInRegistration] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <FooterContext.Provider value={{ isLoggedIn, isInRegistration, setIsLoggedIn, setIsInRegistration }}>
            {children}
        </FooterContext.Provider>
    );
};

export const useFooter = () => {
    const context = useContext(FooterContext);
    if (!context) throw new Error("useFooter must be used within FooterProvider");
    return context;
};
