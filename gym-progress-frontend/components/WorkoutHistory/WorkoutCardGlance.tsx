import { DateObj } from "@/app/types/types";

import { toTitleCase } from "@/utils/utils";
import { ReactEventHandler } from "react";

interface Props {
    exercises: DateObj;
    clickHandler: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export default function WorkoutCardGlance({ exercises, clickHandler }: Props) {

    return (
        <div className="workout-card-glance-body">
            <ul>
                {exercises.exercises.map((exe, index) => {
                    return (
                        <li
                            key={index}
                            className={`glance-exe ${exe[1]}`}
                            onClick={clickHandler}
                        >
                            {toTitleCase(exe[0])}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}