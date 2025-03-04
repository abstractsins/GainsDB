import { toTitleCase } from "@/utils/utils";

interface Props {
    exercises: string[];
}

export default function WorkoutCardDetails({ exercises }: Props) {
    return (
        <div className="workout-card-details-body">
        <ul>
            {
                exercises.exercises.map(exercise => {
                    console.log(exercise)
                    return (
                        <li className="exe-card-exe-container" key={exercise}>
                            <span className="workout-card-exe-name workout-detail-exercise">{toTitleCase(exercise)}</span>
                            <ul className="workout-detail-exercise-sets">
                                {
                                    exercises[exercise].map(set => {
                                        console.log(set);
                                        const order = set[0] + (set[0] == 1 ? 'st' : (set[0] == 2 ? 'nd' : (set[0] == 3 ? 'rd' : 'th')));
                                        const weight = set[1] + ' lbs';
                                        const reps = set[2];
                                        return <li key={set[0]} className="exe-card-set">
                                            <span className="order">
                                                {`${order}: `}
                                            </span>
                                            <span>{`${weight}`}</span>
                                            <span>{` x ${reps} reps`}</span>
                                        </li>
                                    })
                                }
                            </ul>
                        </li>
                    );
                })
            }
        </ul>
    </div>
    )
}