"use client";

import PopupModal from "@/components/PopupModal";
import { createContext, ReactNode, useContext, useState } from "react";

export interface PopupContextValue {
  setPopup: (options: PopupOptions) => void;
  closePopup: () => void;
}

export enum PopupType {
  Error = "error",
  Notification = "notification",
}

export interface PopupOptions {
  type: PopupType;
  title: string;
  message: string;
  buttons: ReactNode[];
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [buttons, setButtons] = useState<ReactNode[]>([]);
  const [type, setType] = useState<PopupType>();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const setPopup = (options: PopupOptions) => {
    const { type, title, message, buttons } = options;
    setType(type);
    setTitle(title);
    setMessage(message);
    setButtons(buttons);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setMessage("");
  };

  const props = {
    title,
    message,
    buttons,
  };

  return (
    <PopupContext.Provider value={{ setPopup, closePopup }}>
      {isPopupVisible && <PopupModal props={props} />}
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within PopupProvider");
  }
  return context;
};
