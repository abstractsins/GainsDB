import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";

import SuggestionLI from "@/components/coming-soon/SuggestionLI"
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

interface Suggestion {
    id: string;
    date: string;
    name: string;
    suggestion: string;
}

interface Props {
    trigger: () => void;
}

export default function SuggestionBoard({ trigger }: Props) {
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);

    const server = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000'
    const token = session?.user?.authToken || localStorage.getItem("token");

    // GSAP
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToSuggestion = (direction: "left" | "right") => {
        const board = document.querySelector(".suggestion-board");
        const containers = document.querySelectorAll(".suggestion-container");
    
        if (!board || containers.length === 0) return;
    
        // Get positions of each SuggestionLI
        const positions = Array.from(containers).map((container) => (container as HTMLElement).offsetLeft);
    
        let newIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;
    
        // Ensure the index stays within bounds
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= positions.length) newIndex = positions.length - 1;
    
        // Scroll smoothly to the target position
        gsap.to(board, {
            scrollTo: { x: positions[newIndex]-68, autoKill: false },
            duration: 0.6,
            ease: "power2.inOut",
        });
    
        setCurrentIndex(newIndex); // Update index
    };
    

    const getSuggestions = useCallback(async () => {
        const res = await fetch(`${server}/api/suggestions`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const responseData = await res.json();
        console.log("🔵 API Response:", responseData);

        if (res.ok) {
            setLoading(false);
            setSuggestions(responseData);
        } else {
            alert("Error retrieving suggestions.");
            setError('something went wrong');
        }
    }, [server, token, setLoading, setSuggestions])


    useEffect(() => {
        getSuggestions();
    }, [trigger])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        const board = document.querySelector(".suggestion-board");
        // const items = document.querySelectorAll(".suggestion-board > div");
        const items = document.querySelectorAll(".suggestion-container");

        if (board && items.length > 0) {
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
                    // markers: true,
                    invalidateOnRefresh: true,
                },
            });
        }
    }, [suggestions]);

    if (error) {
        return <p>{error}</p>
    } else if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="suggestion-board-container">
            <div className="suggestion-board-container-header">
                <h3>Here&#39;s what people are saying:</h3>
            </div>

            <div className="suggestion-board">
                <div className="suggestion-board-track">

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        suggestions?.map((suggestion, i) =>
                            <SuggestionLI
                                key={i}
                                id={suggestion.id}
                                date={suggestion.date}
                                name={suggestion.name}
                                suggestion={suggestion.suggestion}
                            />
                        )
                    )}
                </div>
                <div className="nav-button" id="left" onClick={() => scrollToSuggestion("left")}>
                    <BsArrowLeftSquareFill />
                </div>
                <div className="nav-button" id="right" onClick={() => scrollToSuggestion("right")}>
                    <BsArrowRightSquareFill />
                </div>
            </div>


        </div>
    );
}