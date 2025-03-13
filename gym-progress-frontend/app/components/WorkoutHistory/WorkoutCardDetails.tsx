import { toTitleCase } from "@/utils/utils";

import { RiCloseFill } from "react-icons/ri";

import { SetArr } from "@/app/types/types";
import { useEffect } from "react";

interface Props {
    exerciseName: string | null;
    exerciseData: SetArr | null;
    exerciseCategory: string | null;
    onClose: () => void;
}

export default function WorkoutCardDetails({ exerciseName, exerciseData, exerciseCategory, onClose }: Props) {

    useEffect(() => {
        console.log("WorkoutCardDetails received new exerciseData:", exerciseData);
    }, [exerciseData]);
    

    return (
        <div className={`workout-card-details-body ${exerciseCategory}`}>
            { exerciseCategory !== null && <span className="exercise-name"> {toTitleCase(exerciseName || undefined)} </span>}
            <button type="button" id="cancel-button" onClick={onClose}><RiCloseFill /></button>
            {/* <button onClick={onClose}>close</button> */}
            <ul className="workout-detail-exercise-sets">
                {
                    exerciseData?.map(set => {

                        const order = set[0];
                        const weight = set[1];
                        const weightUnit = ' lbs';
                        const reps = set[2];
                        const repUnit = ` rep${set[2] != 1 ? 's' : ''}`;

                        return (
                            <li className="set" key={order}>
                                <span className="set-order">{order + (order == 1 ? 'st' : (order == 2 ? 'nd' : (order == 3 ? 'rd' : 'th')))}:</span>
                                <span className="set-weight">{weight}</span><span className="unit">{weightUnit}</span> 
                                <span className="x">x</span> 
                                <span className="set-reps">{reps}</span><span className="unit">{repUnit}</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}