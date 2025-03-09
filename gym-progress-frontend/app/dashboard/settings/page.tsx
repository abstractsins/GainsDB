"use client";

import ToggleSlider from "@/app/components/ToggleSlider";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { AuthContext } from "@/contexts/AuthContext";


export default function Settings() {

    useEffect(() => {
        fetchSettings();
    }, []);

    const authContext = useContext(AuthContext);
    const { preferences, setPreferences } = authContext;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    const server = process.env.NEXT_PUBLIC_BACKEND || `http://localhost:5000`;
    const id = session?.user?.id;


    async function fetchSettings() {
        const token = session?.user?.authToken || localStorage.getItem("token");

        if (!token) {
            setError("No authentication session found. Please log in.");
            return;
        }

        try {
            const response = await fetch(`${server}/api/user/${id}/preferences`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch preferences");
            }

            const data = await response.json();
            console.log(data[0]);
            setPreferences(data.preferences);
        } catch (error: unknown) {
            console.error("Error fetching preferences:", error);
            setError("Failed to fetch preferences.");
        } finally {
            setLoading(false);
        }
    };

    const updatePreferencesOnServer = async (newPreferences: any) => {
        const token = session?.user?.authToken || localStorage.getItem("token");

        if (!token) {
            console.error("No authentication token found.");
            return;
        }

        try {
            await fetch(`${server}/api/users/preferences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ✅ Fix incorrect quotation mark
                },
                body: JSON.stringify(newPreferences),
            });

            console.log("Preferences updated successfully.");
        } catch (error) {
            console.error("Error updating preferences:", error);
        }
    };


    if (!authContext) {
        return <p>Error: AuthContext is not available.</p>;
    } else if (error) {
        return <p>{error}</p>;
    } else if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div id="settings-page">
            <div className="header-container">
                <h1 className="page-header">Settings</h1>
            </div>

            <div className="settings-body">

                {/* THEME */}
                <div className="settings-module" id="theme-module">
                    <div className="settings-module-header">
                        <h2>Color Theme</h2>
                        <div className="theme-selection-container">
                            <span className="option-text">Dark</span>
                            <ToggleSlider
                                defaultSetting={preferences.theme === "dark"}
                                selectionSetting={(newState) => {
                                    const newPreferences = { ...preferences, theme: newState ? "dark" : "light" };
                                    setPreferences(newPreferences);
                                    updatePreferencesOnServer(newPreferences);
                                }}
                            />
                            <span className="option-text">Light</span>
                        </div>
                    </div>
                </div>

                {/* UNITS */}
                <div className="settings-module" id="units-module">
                    <div className="settings-module-header">
                        <h2>Units</h2>
                        <p className="coming-soon animate-pulse">Coming in next release!</p>
                        <div className="units-selection-container">
                            <span className="option-text">Lbs</span>
                            <ToggleSlider
                                disabled={true}
                                defaultSetting={preferences.unit === "lbs"}
                                selectionSetting={(newState) => {
                                    const newPreferences = { ...preferences, unit: newState ? "kg" : "lbs" };
                                    setPreferences(newPreferences);
                                    updatePreferencesOnServer(newPreferences);
                                }}
                            />
                            <span className="option-text">Kg</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="settings-footer">
                <div className="app-signature">
                    <span className="app-signature">{`GainsDB v${process.env.NEXT_PUBLIC_VERSION}, released ${process.env.NEXT_PUBLIC_RELEASE_DATE}`}</span>
                </div>
            </div>
        </div>
    );
}
