"use client";

import Waiter, { WaiterMessage } from "@/components/Waiter";
import { createContext, ReactNode, useContext, useState } from "react";

interface WaiterContextProps {
  setWaiter: (text: WaiterMessage | false) => void;
  isWaiting: boolean;
}

const WaiterContext = createContext<WaiterContextProps | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: ReactNode }) => {
  const [waiterText, setWaiterText] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const setWaiter = (setting: WaiterMessage | false) => {
    if (typeof setting === "string") {
      setWaiterText(setting);
      setIsWaiting(true);
    } else if (setting === false) {
      setWaiterText("");
      setIsWaiting(false);
    }
  };

  return (
    <WaiterContext.Provider value={{ setWaiter, isWaiting }}>
      {waiterText && <Waiter msg={waiterText} />}
      {children}
    </WaiterContext.Provider>
  );
};

export const useWaiter = () => {
  const context = useContext(WaiterContext);
  if (!context) throw new Error("useWaiter must be used within WaiterProvider");
  return context;
};
