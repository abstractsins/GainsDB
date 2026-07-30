// contexts/LoadedContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type LoadedContextType = {
  isLoaded: boolean;
  setPageLoaded: (loaded: boolean) => void;
};

const LoadedContext = createContext<LoadedContextType | undefined>(undefined);

export function LoadedProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setLoaded] = useState(false);

  const setPageLoaded = useCallback((loaded: boolean) => {
    setLoaded(loaded);
    console.log(loaded);
  }, []);

  return (
    <LoadedContext.Provider value={{ isLoaded, setPageLoaded }}>
      {children}
    </LoadedContext.Provider>
  );
}

export function useLoaded() {
  const context = useContext(LoadedContext);

  if (!context) {
    throw new Error("useLoaded must be used inside LoadedProvider");
  }

  return context;
}
