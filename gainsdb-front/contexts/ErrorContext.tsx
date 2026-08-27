"use client";

import ErrorReportBanner from "@/components/ErrorReportBanner";
import {
  HttpResponseCodes,
  ResponseLikeObject,
} from "@/constants/fetchConstants";
import { ExerciseError } from "@/constants/errorMessages";
import { Environments } from "@/constants/generalConstants";
import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface ResponseErrorProps {
  response: ResponseLikeObject;
  key: ErrorKey; // contextualizes the error along with other optional params
  exercise?: string;
  user?: number;
  message?: string;
}

export interface ErrorContextValue {
  setBannerError: (message: string) => void;
  setPopupError: (settings: SetErrorPopupOptions) => void;
  clearError: () => void;
  handleResponseError: (props: ResponseErrorProps) => void;
  handleNoToken: () => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export enum ErrorReportType {
  Banner = "banner",
  Popup = "popup",
}

export enum ErrorKey {
  Dashboard = "dashboard",
  ExcerciseList = "exerciseList",
  LatestWorkout = "latestWorkout",
  NewWorkout = "newWorkout",
}

export interface SetErrorPopupOptions {
  message: string;
  header?: string;
  buttons?: ReactNode[];
}

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [isReportableError, setIsReportableError] = useState<ErrorReportType>();
  const [bannerMessageText, setBannerMessageText] = useState("");
  const router = useRouter();

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
    setIsReportableError(undefined);
  };

  const handleResponseError = (props: ResponseErrorProps) => {
    const { response, key, exercise } = props;
    if (response.status === HttpResponseCodes.Forbidden) {
      // todo: popup message that they will be redirected to log in
      router.replace("/");
    } else if (response.status === HttpResponseCodes.NotFound) {
      switch (key) {
        case ErrorKey.ExcerciseList:
          console.warn(
            `${ExerciseError.NoWorkoutDataForExercise}: ${exercise}`,
          );
          break;
        case ErrorKey.LatestWorkout:
          console.warn(
            `${ExerciseError.NoWorkoutDataForExercise}: ${exercise}`,
          );
          break;
      }
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV !== Environments.Prod) {
      console.error("❌ Error fetching dashboard data:");
      setBannerError(
        "⚠️ Failed to load dashboard data. Check console for more information.",
      );
    } else {
      setBannerError("Failed to load dashboard data. Please try again later.");
    }
  };

  const handleNoToken = () => {
    // todo: popup message that they will be redirected to log in
    router.replace("/");
  };

  return (
    <ErrorContext.Provider
      value={{
        clearError,
        setBannerError,
        setPopupError,
        handleResponseError,
        handleNoToken,
      }}
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
  if (!context) {
    throw new Error("useErrorReporter must be used within ErrorProvider");
  }
  return context;
};
