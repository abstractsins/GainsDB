import { createContext, useState, useEffect, ReactNode } from "react";
import { User, UserSettings } from "@/app/types/types";

// Define the shape of the context
interface AuthContextType {
    user: User | null;
    preferences: UserSettings;
    setUser: (user: User | null) => void;
    setPreferences: (prefs: UserSettings) => void;
}

// Create Context with default values
export const AuthContext = createContext<AuthContextType>({
    user: null,
    preferences: {} as UserSettings,
    setUser: () => {},
    setPreferences: () => {}
});

// AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("user") || "null");
        }
        return null;
    });

    const [preferences, setPreferences] = useState<UserSettings>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("preferences") || "{}");
        }
        return {} as UserSettings;
    });

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

    return (
        <AuthContext.Provider value={{ user, setUser, preferences, setPreferences }}>
            {children}
        </AuthContext.Provider>
    );
}
