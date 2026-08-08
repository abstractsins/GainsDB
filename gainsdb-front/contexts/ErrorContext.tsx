"use client";

import ErrorReportBanner from "@/components/ErrorReportBanner";
import ErrorReportPopup from "@/components/ErrorReportPopup";
import { createContext, ReactNode, useContext, useState } from "react";

export interface ErrorContextValue {
  setBannerError: (message: string) => void;
  setPopupError: (settings: SetErrorPopupOptions) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export enum ErrorReportType {
  Banner = "banner",
  Popup = "popup",
}

export interface SetErrorPopupOptions {
  message: string;
  header?: string;
  buttons?: ReactNode[];
}

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [isReportableError, setIsReportableError] = useState<ErrorReportType>();
  const [popupMessageText, setPopupMessageText] = useState<string[] | null>(
    null,
  );
  const [bannerMessageText, setBannerMessageText] = useState("");

  const setBannerError = (messageText: string) => {
    setIsReportableError(ErrorReportType.Banner);
    setBannerMessageText(messageText);
  };

  const setPopupError = (options: SetErrorPopupOptions) => {
    // todo
    setIsReportableError(ErrorReportType.Popup);
    console.log(options);
  };

  const clearError = () => {
    setPopupMessageText(null);
    setIsReportableError(undefined);
  };

  return (
    <ErrorContext.Provider
      value={{ clearError, setBannerError, setPopupError }}
    >
      {isReportableError === ErrorReportType.Banner && (
        <ErrorReportBanner messageText={bannerMessageText} />
      )}
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorReporter = () => {
  const context = useContext(ErrorContext);
  if (!context)
    throw new Error("useErrorReporter must be used within ErrorProvider");
  return context;
};
