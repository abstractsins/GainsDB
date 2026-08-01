import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { WorkoutsObj } from "@/types/types";
import { useMemo, memo } from "react";

interface Props {
  workoutsObj: WorkoutsObj | undefined;
}

function WorkoutHistoryList({ workoutsObj }: Props) {
  const workoutCards = useMemo(() => {
    console.warn("rendering cards"); // will only run if workoutsObj changes

    if (!workoutsObj || !workoutsObj.dates.length) {
      return <p>No workouts found! Get to the gym!</p>;
    }

    return (
      <ul className="history">
        {workoutsObj.dates.map((date, i) => {
          const workout = workoutsObj[date];
          if (!workout || typeof workout !== "object" || !("id" in workout))
            return null;

          return (
            <WorkoutHistoryCard
              key={workout.id}
              id={workout.id}
              date={date}
              workout={workout}
              index={i}
            />
          );
        })}
      </ul>
    );
  }, [workoutsObj]);

  return workoutCards;
}

export default memo(WorkoutHistoryList);
