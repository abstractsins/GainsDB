"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { User, UserSettings } from "@/types/types";

interface AuthContextType {
  user: User | null;
  preferences: UserSettings;
  setUser: (user: User | null) => void;
  setPreferences: (prefs: UserSettings) => void;
  isLoggedIn: boolean;
  setUserLoggedIn: () => void;
  setUserLoggedOut: () => void;
}

// Create Context with default values
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const getUser = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("user") || "null");
    }
    return null;
  };

  const getPreferences = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("preferences") || "{}");
    }
    return {} as UserSettings;
  };

  const [user, setUser] = useState<User | null>(getUser);
  const [preferences, setPreferences] = useState<UserSettings>(getPreferences);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setUserLoggedIn = () => setIsLoggedIn(true);
  const setUserLoggedOut = () => setIsLoggedIn(false);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Update localStorage when preferences change
  useEffect(() => {
    if (preferences) {
      localStorage.setItem("preferences", JSON.stringify(preferences));
    }
  }, [preferences]);

  useEffect(() => {}, [isLoggedIn]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      preferences,
      setPreferences,
      isLoggedIn,
      setUserLoggedIn,
      setUserLoggedOut,
    }),
    [user, preferences, isLoggedIn, setUserLoggedIn, setUserLoggedOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
