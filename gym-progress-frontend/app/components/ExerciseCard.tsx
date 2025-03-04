"use client";

import React, { useState, useEffect } from "react";
import normalizeDate from "@/app/components/normalizeDate";
import ExerciseVolumeChart from "./ExerciseVolumeChart";
import { useSession } from "next-auth/react";
import { toTitleCase } from "@/utils/utils";


interface Exercise {
    id: number;
    name: string;
    category: string;
    last_logged_date: string;
}

interface WorkoutSet {
    set_order: number;
    weight: number;
    reps: number;
}

interface WorkoutData {
    workout_id: number;
    workout_date: string;
    sets: WorkoutSet[];
}

interface Props {
    exercise: Exercise;
    isExpanded: boolean;
    setExpandedExerciseId: (exerciseId: number | null) => void;
    resetInnerExpansion: boolean;
    popupData: (popup: boolean, id: string) => void;
    onClick: () => void;
}






const ExerciseCard: React.FC<Props> = ({ exercise, isExpanded: isThisExpanded, setExpandedExerciseId, resetInnerExpansion, popupData, onClick }: Props) => {

    const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const { data: session } = useSession(); // Ensure this is defined before use
    const userId = session?.user?.id || localStorage.getItem("userId");
    const server = process.env.NEXT_PUBLIC_BACKEND;
    const [moreDisabled, setMoreDisabled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [logPopup, setLogPopup] = useState<boolean>(false);
    const [logExerciseId, setLogExererciseId] = useState<string>('0');

    
    useEffect(() => {
        if (!isThisExpanded) {
            setIsExpanded(false);
            setIsExpanded2(false); // Collapse chart section when this card is collapsed
        } else {
            setIsExpanded(true);
        }
    }, [isThisExpanded]);
    
    
    const token = session?.user?.authToken || localStorage.getItem("token");
    if (!token) {
        setError("No authentication session found. Please log in.");
        return;
    }

    const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
        console.log(`${exercise.name} clicked`);



        if ((e.target as HTMLElement).closest('.exe-card-bottom')) {
            e.stopPropagation(); // Prevent collapsing
            return;
        }

        setIsExpanded2(false);

        if (!(e.target as HTMLElement).classList.contains('click-for-more')
            && !(e.target as HTMLElement).classList.contains('exe-card-bottom')
            && !(e.target as HTMLElement).classList.contains('greater-chart-area')
            && !(e.target as HTMLElement).classList.contains('exe-card-bottom-body')
            && !(e.target as HTMLElement).classList.contains('exe-card-bottom-header-text')
            && !(e.target as HTMLElement).classList.contains('exe-card-bottom-header')
        ) {
            setLoading(true);

            const clickedLi = e.currentTarget;

            const name = clickedLi?.getAttribute('name') ? `${clickedLi.getAttribute('name')}` : 'null';
            setLogExererciseId(name);

            clickedLi.classList.remove('expand2');

            if (isExpanded) {
                setExpandedExerciseId(null);
                setIsExpanded(false);
                setIsExpanded2(false);
                console.log(clickedLi)
                clickedLi.classList.toggle('active');
                return;
            } else {
                // console.log(`setExpandedExerciseId(null);`);
                setIsExpanded(true)
                setExpandedExerciseId(null);
                setTimeout(() => setExpandedExerciseId(exercise.id), 300);
            }


            // Remove 'active' class from all sibling <li> elements
            document.querySelectorAll(".exercise-card.active").forEach((el) => el.classList.remove("active"));

            if (Number(setExpandedExerciseId) == exercise.id) {
                setExpandedExerciseId(null);
                clickedLi.classList.remove('active');
                return; // Collapse the card
            } else {
                clickedLi.classList.add('active');
            }

            try {
                const response = await fetch(`${server}/api/user/${userId}/exercises/${exercise.id}/latest-workout`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) console.error("Failed to fetch workout data");
                const data = await response.json();
                setWorkoutData(data.length ? data : null);
                if (workoutData !== null) {
                    setMoreDisabled(true);
                }
            } catch (error) {
                console.error("Error fetching workout data:", error);
                setWorkoutData(null);
            } finally {
                setLoading(false);
            }

        }
    };



    const moreClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (workoutData) {

            console.log((e.target as HTMLElement).closest('li'));

            const clickedLi = (e.target as HTMLElement).closest('li');
            if ((clickedLi as HTMLElement).classList.contains('expand2')) {
                (clickedLi as HTMLElement).classList.remove('expand2');
            } else {
                (clickedLi as HTMLElement).classList.add('expand2');
            }

            if (isExpanded2) {
                setIsExpanded2(false);
                return;
            } else {
                setExpandedExerciseId(exercise.id);
                setTimeout(() => setIsExpanded2(true), 300); // Expand the clicked card
            }
        }
    }

    function SkeletonLoader() {
        return (
            <div className="set-list-skeleton animate-pulse">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }

    const launchPopupLog = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        popupData(true, logExerciseId);
    }


    return (
        <li id={`${exercise.id}`} name={`${exercise.name.replace(/\s/g, '-')}`} className={`exercise-card ${exercise.category}`} onClick={handleClick}>
            <div className="exe-card-top">

                <div className="exe-card-left">
                    <h2 className="exercise-list text-xl">{toTitleCase(exercise.name)}</h2>
                    {isThisExpanded
                        && <div className="expansion-button-container">
                            <button className={`direct-log`} onClick={launchPopupLog}>{`Log`}</button>
                            <button className={`${workoutData ? '' : 'disabled'} click-for-more`} onClick={moreClickHandler}>{`${isExpanded2 ? 'Less...' : 'Chart...'}`}</button>
                        </div>
                    }
                    <span className="text-[12pt] font-thin">
                        Last logged: {normalizeDate(exercise.last_logged_date, true)}
                    </span>
                </div>

                {isThisExpanded && (
                    <div className="expanded-lvl-1">
                        {loading ? (
                            <SkeletonLoader />
                            // <Loading />
                        ) : workoutData ? (
                            <div className="lvl-1-exe-data">
                                <ul>
                                    {workoutData.map((set, index) => (
                                        <li key={index}>
                                            <span className="order">{set.set_order +  (set.set_order == 1 ? 'st' : (set.set_order == 2 ? 'nd' : (set.set_order == 3 ? 'rd' : 'th')))}:</span>
                                            <span>{Math.floor(Number(set.weight))} lbs x {set.reps} rep{`${Number(set.reps) > 1 ? 's' : ''}`}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No recent workout found for this exercise.</p>
                        )}
                    </div>
                )}
            </div>
            {isExpanded2 &&
                <div key={isExpanded2 ? "open" : "closed"} className="exe-card-bottom">
                    <div className="exe-card-bottom-header">
                    </div>
                    <div className="exe-card-bottom-body">
                        <div className="greater-chart-area">
                            <ExerciseVolumeChart
                                exerciseId={exercise.id}
                            />
                        </div>
                    </div>
                </div>
            }
        </li>
    );
};

export default ExerciseCard;
