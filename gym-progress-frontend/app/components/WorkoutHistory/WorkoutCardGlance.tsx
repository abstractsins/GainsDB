import { DateObj } from "@/app/types/types";

import { toTitleCase } from "@/utils/utils";

interface Props {
    exercises: DateObj;
}

export default function WorkoutCardGlance({ exercises }: Props) {

    console.log(exercises);
    return (
        <div className="workout-card-glance-body">
            <ul>
                {exercises.exercises.map((exe, index) => {
                    console.log(exe);
                    return (
                        <li
                            key={index}
                            className={`glance-exe ${exe[1]}`}
                        >
                            {toTitleCase(exe[0])}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}