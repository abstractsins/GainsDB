"use client";

import Waiter, { WaiterMessage } from "@/components/Waiter";
import { createContext, ReactNode, useContext, useState } from "react";

interface WaiterContextProps {
  setWaiter: (text: WaiterMessage | false) => void;
}

const WaiterContext = createContext<WaiterContextProps | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: ReactNode }) => {
  const [waiterText, setWaiterText] = useState("");

  const setWaiter = (setting: WaiterMessage | false) => {
    if (typeof setting === "string") {
      setWaiterText(setting);
    } else if (setting === false) {
      setWaiterText("");
    }
  };

  return (
    <WaiterContext.Provider value={{ setWaiter }}>
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
