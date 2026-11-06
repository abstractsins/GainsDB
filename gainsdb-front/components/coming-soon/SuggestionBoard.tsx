// External libraries
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";

// Internal components
import SuggestionLI from "@/components/coming-soon/SuggestionLI";
import SuggestionLISkeleton from "@/components/coming-soon/SuggestionLISkeleton";

// Types
interface Suggestion {
    id: string;
    date: string;
    name: string;
    suggestion: string;
}

interface Props {
    trigger: boolean;
}

export default function SuggestionBoard({ trigger }: Props) {
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";
    const token = session?.user?.authToken || localStorage.getItem("token");

    const totalSuggestions = suggestions?.length ?? 0;
    const isFirst = currentIndex === 0;
    const isLast = totalSuggestions === 0 || currentIndex >= totalSuggestions - 1;

    const scrollToSuggestion = (direction: "left" | "right") => {
        if (totalSuggestions === 0) return;

        setCurrentIndex((prevIndex) => {
            const rawNextIndex = direction === "right" ? prevIndex + 1 : prevIndex - 1;
            return Math.max(0, Math.min(rawNextIndex, totalSuggestions - 1));
        });
    };

    const getSuggestions = useCallback(async () => {
        try {
            const res = await fetch(`${server}/api/suggestions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = await res.json();
            console.log("🔵 API Response:", responseData);

            if (!res.ok) throw new Error("Failed to fetch suggestions");

            setSuggestions(responseData);
            setCurrentIndex(0);
        } catch (err) {
            console.error("❌ Error fetching suggestions:", err);
            setError("Something went wrong while retrieving suggestions.");
        } finally {
            setLoading(false);
        }
    }, [server, token]);

    useEffect(() => {
        getSuggestions();
    }, [getSuggestions, trigger]);

    if (error) return <p>{error}</p>;
    if (loading) return <p>Loading...</p>;

    return (
        <div className="suggestion-board-container">
            <div className="suggestion-board-container-header">
                <h3>Here&#39;s what people are saying:</h3>
            </div>

            <div className="suggestion-board">
                <div
                    className="suggestion-board-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {loading
                        ? (
                            <div className="suggestion-board-slide">
                                <SuggestionLISkeleton />
                            </div>
                        )
                        : (suggestions?.map((suggestion, i) => (
                            <div key={suggestion.id || i} className="suggestion-board-slide">
                                <SuggestionLI
                                    id={suggestion.id}
                                    date={suggestion.date}
                                    name={suggestion.name}
                                    suggestion={suggestion.suggestion}
                                />
                            </div>
                        )))
                    }
                </div>

                <button
                    className={`nav-button ${isFirst ? "disabled" : ""}`}
                    id="left"
                    aria-label="Scroll left"
                    disabled={isFirst}
                    onClick={() => scrollToSuggestion("left")}
                >
                    <BsArrowLeftSquareFill />
                </button>
                <button
                    className={`nav-button ${isLast ? "disabled" : ""}`}
                    id="right"
                    aria-label="Scroll right"
                    disabled={isLast}
                    onClick={() => scrollToSuggestion("right")}
                >
                    <BsArrowRightSquareFill />
                </button>
            </div>
        </div>
    );
}
