// External libraries
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
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
    trigger: () => void;
}

const SCROLL_OFFSET = 68;

export default function SuggestionBoard({ trigger }: Props) {
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFirst, setIsFirst] = useState(true);
    const [isLast, setIsLast] = useState(false);

    const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";
    const token = session?.user?.authToken || localStorage.getItem("token");

    const scrollToSuggestion = (direction: "left" | "right") => {
        const board = document.querySelector(".suggestion-board");
        const containers = document.querySelectorAll(".suggestion-container");

        if (!board || containers.length === 0) return;

        const positions = Array.from(containers).map(
            (container) => (container as HTMLElement).offsetLeft
        );

        let newIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;
        newIndex = Math.max(0, Math.min(newIndex, positions.length - 1));
        setIsFirst(newIndex === 0);
        setIsLast(suggestions ? newIndex === suggestions.length - 1 : true);

        gsap.to(board, {
            scrollTo: { x: positions[newIndex] - SCROLL_OFFSET, autoKill: false },
            duration: 0.6,
            ease: "power2.inOut",
        });


        setCurrentIndex(newIndex);
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
        } catch (err) {
            console.error("❌ Error fetching suggestions:", err);
            setError("Something went wrong while retrieving suggestions.");
        } finally {
            setLoading(false);
        }
    }, [server, token]);

    const animateSuggestions = () => {
        const board = document.querySelector(".suggestion-board");
        const items = document.querySelectorAll(".suggestion-container");

        if (!board || items.length === 0) return;

        gsap.to(board, {
            scrollTrigger: {
                trigger: board,
                start: "left center",
                scrub: 1,
                snap: {
                    snapTo: "labels",
                    duration: { min: 0.2, max: 0.5 },
                    ease: "power1.inOut",
                },
                horizontal: true,
                invalidateOnRefresh: true,
            },
        });
    };

    useEffect(() => {
        getSuggestions();
    }, [trigger]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        animateSuggestions();
    }, [suggestions]);

    if (error) return <p>{error}</p>;
    if (loading) return <p>Loading...</p>;

    return (
        <div className="suggestion-board-container">
            <div className="suggestion-board-container-header">
                <h3>Here&#39;s what people are saying:</h3>
            </div>

            <div className="suggestion-board">
                <div className="suggestion-board-track">
                    {loading
                        ? (<SuggestionLISkeleton />)
                        : (suggestions?.map((suggestion, i) => (
                            <SuggestionLI
                                key={i}
                                id={suggestion.id}
                                date={suggestion.date}
                                name={suggestion.name}
                                suggestion={suggestion.suggestion}
                            />
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
