import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { WorkoutsObj } from "@/app/types/types";

interface Props {
    workoutsObj: WorkoutsObj | undefined;
}

export default function WorkoutHistoryList({ workoutsObj }: Props) {
    if (!workoutsObj || !workoutsObj.dates.length) {
        return <p>No workouts found! Get to the gym!</p>;
    }

    const renderWorkoutCards = () => {
        return workoutsObj.dates.map((date, i) => {

            const workout = workoutsObj[date];

            if (!workout || typeof workout !== "object" || !("id" in workout)) return null;
            
            return (
                <WorkoutHistoryCard
                    key={workout.id}
                    id={workout.id}
                    date={date}
                    workout={workout}
                    index={i}
                />
            );
        });
    };

    return <ul className="history">{renderWorkoutCards()}</ul>;
}
