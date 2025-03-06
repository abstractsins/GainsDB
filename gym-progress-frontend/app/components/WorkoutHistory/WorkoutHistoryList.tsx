import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { DateObj, WorkoutsObj } from "@/app/types/types";

interface Props {
    workoutsObj: WorkoutsObj | undefined;
}

export default function WorkoutHistoryList({ workoutsObj }: Props) {


    return (
        <>
            {workoutsObj?.dates.length ? (
                <ul className="history">
                    {workoutsObj?.dates.map((date: string, i: number) => {
                        
                        const workout: DateObj = workoutsObj[date as `${number}/${number}/${number}`];

                        return (
                            <WorkoutHistoryCard
                                key={workout?.id}
                                id={workout?.id}
                                date={date}
                                workout={workout}
                                index={i}
                            />
                        );
                    })}
                </ul>
            ) : (
                <p>No workouts found! Get to the gym!</p>
            )}
        </>
    );
}
