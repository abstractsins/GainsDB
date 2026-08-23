// TODO
// hook up WorkoutCardDetails component

"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { normalizeDate } from "@/utils/utils";
import ExerciseVolumeChart from "./ExerciseVolumeChart";
import { useSession } from "next-auth/react";
import { toTitleCase } from "@/utils/utils";

import WorkoutCardDetails from "./WorkoutHistory/WorkoutCardDetails";
import { SetArr, Sets } from "../types/types";
import {
  ContentTypeAppJson,
  FetchMethods,
  HttpResponseCodes,
  ResponseLikeObject,
} from "@/constants/fetchConstants";
import { ErrorKey, useErrorReporter } from "@/contexts/ErrorContext";

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

interface LatestWorkoutSet extends WorkoutSet {
  user_id: number;
  workout_date: Date;
  workout_id: number;
}

type LatestWorkoutResponse = LatestWorkoutSet[];

interface WorkoutEntry {
  workout_id: number;
  workout_date: Date;
}

interface WorkoutData extends WorkoutEntry {
  sets: WorkoutSet[];
}

interface Props {
  exercise: Exercise | null;
  isExpanded: boolean;
  setExpandedExerciseId: (exerciseId: number | null) => void;
  resetInnerExpansion: boolean;
  popupData: (popup: boolean, id: string) => void;
}

const ExerciseCard: React.FC<Props> = ({
  exercise,
  isExpanded: isThisExpanded,
  setExpandedExerciseId,
  resetInnerExpansion,
  popupData,
}: Props) => {
  const { handleResponseError, handleNoToken } = useErrorReporter();

  const [workoutData, setWorkoutData] = useState<WorkoutData>();
  const [loading, setLoading] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || localStorage.getItem("userId");
  const server = process.env.NEXT_PUBLIC_BACKEND;
  const [isExpanded, setIsExpanded] = useState(false);
  const [logExerciseId, setLogExererciseId] = useState<string>("0");
  const [formattedData, setFormattedData] = useState<SetArr | null>([]);

  useEffect(() => {
    if (!isThisExpanded) {
      setExpandedExerciseId(null);
      setIsExpanded(false);
      setIsExpanded2(false);
    } else {
      setIsExpanded(true);
    }
  }, [isThisExpanded]);

  useEffect(() => {
    if (workoutData && workoutData.sets) {
      setFormattedData([
        ...workoutData.sets.map((set: WorkoutSet) => [
          set.set_order,
          set.weight,
          set.reps,
        ]),
      ]);
    }
  }, [workoutData]);

  const token = session?.user?.authToken || localStorage.getItem("token");
  if (!token) {
    handleNoToken();
    return;
  }

  const mapWorkoutToLocalObj = (data: LatestWorkoutResponse): WorkoutData => {
    const workout_date = data[0].workout_date;
    const workout_id = data[0].workout_id;
    const sets: WorkoutSet[] = data.map((set) => {
      return {
        set_order: set.set_order,
        weight: set.weight,
        reps: set.reps,
      };
    });

    return { sets, workout_date, workout_id };
  };

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    console.log(`${exercise?.name} clicked`);

    if ((e.target as HTMLElement).closest(".exe-card-bottom")) {
      e.stopPropagation();
      return;
    }

    setIsExpanded2(false);

    if (
      !(e.target as HTMLElement).classList.contains("click-for-more") &&
      !(e.target as HTMLElement).classList.contains("exe-card-bottom") &&
      !(e.target as HTMLElement).classList.contains("greater-chart-area") &&
      !(e.target as HTMLElement).classList.contains("exe-card-bottom-body") &&
      !(e.target as HTMLElement).classList.contains(
        "exe-card-bottom-header-text",
      ) &&
      !(e.target as HTMLElement).classList.contains("exe-card-bottom-header")
    ) {
      setLoading(true);

      const clickedLi = e.currentTarget;

      setTimeout(function () {
        clickedLi.scrollIntoView({ behavior: "smooth", block: "start" });
        // document.body.style.transform = 'translateY(0)';
      }, 300);

      const name = clickedLi?.getAttribute("data-name")
        ? `${clickedLi.getAttribute("data-name")}`
        : "null";
      setLogExererciseId(name);

      clickedLi.classList.remove("expand2");

      if (isExpanded) {
        setExpandedExerciseId(null);
        setIsExpanded(false);
        setIsExpanded2(false);
        console.log(clickedLi);
        clickedLi.classList.toggle("active");
        return;
      } else {
        // console.log(`setExpandedExerciseId(null);`);
        setIsExpanded(true);
        setExpandedExerciseId(null);
        if (exercise) setTimeout(() => setExpandedExerciseId(exercise.id), 300);
      }

      // Remove 'active' class from all sibling <li> elements
      document
        .querySelectorAll(".exercise-card.active")
        .forEach((el) => el.classList.remove("active"));

      if (exercise && Number(setExpandedExerciseId) == exercise.id) {
        setExpandedExerciseId(null);
        clickedLi.classList.remove("active");
        return;
      } else {
        clickedLi.classList.add("active");
      }

      if (exercise) {
        const response = await fetch(
          `${server}/api/user/${userId}/exercises/${exercise.id}/latest-workout`,
          {
            method: FetchMethods.GET,
            headers: {
              ...ContentTypeAppJson,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleResponseError({
            response: response as ResponseLikeObject,
            key: ErrorKey.LatestWorkout,
            exercise: exercise.name,
          });

          return;
        }

        const data: LatestWorkoutResponse = await response.json();
        const mappedData = mapWorkoutToLocalObj(data);

        setWorkoutData(mappedData);

        setFormattedData(
          data.map((set: WorkoutSet) => [set.set_order, set.weight, set.reps]),
        );
      }
      setLoading(false);
    }
  };

  const moreClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (workoutData) {
      console.log((e.target as HTMLElement).closest("li"));

      const clickedLi = (e.target as HTMLElement).closest("li");
      if ((clickedLi as HTMLElement).classList.contains("expand2")) {
        (clickedLi as HTMLElement).classList.remove("expand2");
      } else {
        (clickedLi as HTMLElement).classList.add("expand2");
      }

      if (isExpanded2) {
        setIsExpanded2(false);
        return;
      } else {
        if (exercise) setExpandedExerciseId(exercise.id);
        setTimeout(() => setIsExpanded2(true), 300);
      }
    }
  };

  function SkeletonLoader() {
    return (
      <div className="set-list-skeleton">
        <div className="skeleton-row animate-pulse"></div>
        <div className="skeleton-row animate-pulse"></div>
        <div className="skeleton-row animate-pulse"></div>
        <div className="skeleton-row animate-pulse"></div>
        <div className="skeleton-row animate-pulse"></div>
      </div>
    );
  }

  const launchPopupLog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    popupData(true, logExerciseId);
  };

  return (
    <li
      id={`${exercise?.id}`}
      data-name={`${exercise?.name.replace(/\s/g, "-")}`}
      className={`exercise-card ${exercise?.category}`}
      onClick={handleClick}
    >
      <div className="exe-card-top">
        <div className="exe-card-left">
          <h2 className="exercise-list text-xl">
            {toTitleCase(exercise?.name)}
          </h2>
          {isThisExpanded && (
            <div className="expansion-button-container">
              <button
                className={`direct-log`}
                onClick={launchPopupLog}
              >{`Log`}</button>
              <button
                className={`${workoutData ? "" : "disabled"} click-for-more`}
                onClick={moreClickHandler}
              >{`${isExpanded2 ? "Less..." : "Chart..."}`}</button>
            </div>
          )}
          //! for non logged exercises
          <span className="text-[12pt]">
            {exercise && formattedData ? (
              <>Last logged: {normalizeDate(exercise.last_logged_date, true)}</>
            ) : (
              <>Not logged yet</>
            )}
          </span>
        </div>

        {isThisExpanded && (
          <div className="expanded-lvl-1">
            {loading ? (
              <SkeletonLoader />
            ) : workoutData ? (
              <>
                {exercise && (
                  <WorkoutCardDetails
                    key={JSON.stringify(formattedData)}
                    exerciseName={toTitleCase(exercise.name)}
                    exerciseData={formattedData}
                    exerciseCategory={null}
                    onClose={() => {
                      setIsExpanded(false);
                    }}
                  />
                )}
              </>
            ) : (
              <p>No recent workout found for this exercise.</p>
            )}
          </div>
        )}
      </div>
      {isExpanded2 && (
        <div key={isExpanded2 ? "open" : "closed"} className="exe-card-bottom">
          <div className="exe-card-bottom-header"></div>
          <div className="exe-card-bottom-body">
            <div className="greater-chart-area">
              {exercise && <ExerciseVolumeChart exerciseId={exercise.id} />}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default ExerciseCard;
