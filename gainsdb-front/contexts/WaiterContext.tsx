"use client";

import Waiter, { WaiterMessage } from "@/components/Waiter";
import { createContext, ReactNode, useContext, useState } from "react";

interface WaiterContextProps {
  setWaiter: (text: WaiterMessage | false) => void;
  isWaiting: boolean;
}

const WaiterContext = createContext<WaiterContextProps | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: ReactNode }) => {
  const [waiterText, setWaiterText] = useState<WaiterMessage | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const msgPositioner = (el: HTMLElement) => {
    const bounds = el.getBoundingClientRect();
    const width = bounds.width;
    const halfWidth = width / 2;
    const elContainer = el.parentElement;
    if (elContainer) {
      elContainer.style.transform = "translateX(-" + halfWidth + "px)";
    }
  };

  const setTextWrapperElement = (el: HTMLElement) => {
    if (el.textContent) {
      msgPositioner(el);
      el.style.visibility = "visible";
    }
  };

  const setWaiter = (setting: WaiterMessage | false) => {
    if (typeof setting === "string") {
      setWaiterText(setting);
      setIsWaiting(true);
    } else if (setting === false) {
      setWaiterText(null);
      setIsWaiting(false);
    }
  };

  return (
    <WaiterContext.Provider value={{ setWaiter, isWaiting }}>
      {waiterText && (
        <Waiter
          msg={waiterText}
          setTextWrapperElement={setTextWrapperElement}
        />
      )}
      {children}
    </WaiterContext.Provider>
  );
};

export const useWaiter = () => {
  const context = useContext(WaiterContext);
  if (!context) throw new Error("useWaiter must be used within WaiterProvider");
  return context;
};
