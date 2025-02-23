"use client";

import React, { useState, useEffect } from "react";
import normalizeDate from "@/app/components/normalizeDate";
import { useSession } from "next-auth/react";
import toTitleCase from '@/utils/toTitleCase';






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
}








const ExerciseCard: React.FC<Props> = ({ exercise, isExpanded, setExpandedExerciseId, resetInnerExpansion }) => {

    const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const { data: session } = useSession(); // Ensure this is defined before use
    const userId = session?.user?.id || localStorage.getItem("userId");
    const server = process.env.NEXT_PUBLIC_BACKEND;

    useEffect(() => {
        if (resetInnerExpansion) {
            console.log("Resetting inner expansion for:", exercise.name);
            setIsExpanded2(false);
            setExpandedExerciseId(null);
            console.log(`isExpanded2 after reset: ${isExpanded2}`);
        }
    }, [resetInnerExpansion]); 


    const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
        console.log(`${exercise.name} clicked`);

        console.log(e);

        if (!e.target.classList.contains('click-for-more') 
            && !e.target.classList.contains('exe-card-bottom')
            && !e.target.classList.contains('greater-chart-area')
            && !e.target.classList.contains('exe-card-bottom-body')
            && !e.target.classList.contains('exe-card-bottom-header-text')
            && !e.target.classList.contains('exe-card-bottom-header')
        ) {

            const clickedLi = e.currentTarget;
            console.log(clickedLi);

            if (isExpanded) {
                setExpandedExerciseId(null);
                setIsExpanded2(false);
                clickedLi.classList.toggle('active');
                clickedLi.classList.remove('expand2');
                return;
            } else {
                setExpandedExerciseId(null);
                setTimeout(() => setExpandedExerciseId(exercise.id), 300); 
            }

            setLoading(true);


            // Remove 'active' class from all sibling <li> elements
            document.querySelectorAll(".exercise-card.active").forEach((el) => {
                console.log(exercise)
                console.log(el)
                el.classList.remove("active");
            });

            if (Number(setExpandedExerciseId) == exercise.id) {
                clickedLi.classList.remove('active');
                return; // Collapse the card
            } else {
                clickedLi.classList.add('active');
            }

            try {
                const response = await fetch(`${server}/api/user/${userId}/exercises/${exercise.id}/latest-workout`);
                if (!response.ok) throw new Error("Failed to fetch workout data");

                const data = await response.json();
                setWorkoutData(data.length ? data : null);
            } catch (error) {
                console.error("Error fetching workout data:", error);
                setWorkoutData(null);
            } finally {
                setLoading(false);
            }
        }
    };



    const moreClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {

        console.log(e.target.closest('li'));

        const clickedLi = e.target.closest('li');
        if (clickedLi.classList.contains('expand2')) {
            clickedLi.classList.remove('expand2');
        } else {
            clickedLi.classList.add('expand2');
        }   

        if (isExpanded2) {
            console.log('isExpanded2 = true');
            setIsExpanded2(false);
            return;
        } else {
            console.log('isExpanded2 = false');
            setTimeout(() => setIsExpanded2(true), 300); // Expand the clicked card
        }
    }


    console.log(`isExpanded2 before render for ${exercise.name}:`, isExpanded2);


    return (
        <li className={`exercise-card ${exercise.category}`} onClick={handleClick}>
            <div className="exe-card-top">

                <div className="exe-card-left">
                    <h2 className="exercise-list text-xl">{toTitleCase(exercise.name)}</h2>
                    {isExpanded
                        && <div className="expansion-button-container">
                            <button className="click-for-more" onClick={moreClickHandler}>{`${isExpanded2 ? 'Less...' : 'More...'}`}</button>
                        </div>
                    }
                    <span className="text-[12pt] font-thin">
                        Last logged: {normalizeDate(exercise.last_logged_date, true)}
                    </span>
                </div>

                {isExpanded && (
                    <div className="expanded-lvl-1">
                        {loading ? (
                            <p>Loading workout data...</p>
                            // <Loading />
                        ) : workoutData ? (
                            <div className="lvl-1-exe-data">
                                <ul>
                                    {workoutData.map((set, index) => (
                                        <li key={index}>
                                            <span>Set {set.set_order}: {Math.floor(Number(set.weight))} lbs x {set.reps} rep{`${Number(set.reps) > 1 ? 's' : ''}`}</span>
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
                        <h3 className="exe-card-bottom-header-text">Progress Over Time</h3>
                    </div>
                    <div className="exe-card-bottom-body">
                        <div className="greater-chart-area"></div>
                    </div>
                </div>
            }
        </li>
    );
};

export default ExerciseCard;
