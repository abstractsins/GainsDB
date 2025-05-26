import React, { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";
import { ExerciseCard as ExerciseCardType } from "@/app/types/types";
import ExercisesLoading from "./ExercisesLoading";


interface Props {
  loading: boolean;
  exercises: ExerciseCardType[];
  onNewExercise: () => void;
  resetInnerExpansion: boolean;
  popupData: (popup: boolean, id: string) => void;
}

const ExerciseList: React.FC<Props> = ({ loading, exercises, onNewExercise, resetInnerExpansion, popupData }: Props) => {

  const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);

  useEffect(() => {
    if (resetInnerExpansion) {
      setExpandedExerciseId(null);
    }
  }, [resetInnerExpansion]);

  return (
    <>
      {loading ? (
        <ExercisesLoading />
      )
        : (
          <ul className="exercises-ul">
            {/* New Exercise Button */}
            < li
              className="exercise-card"
              id="add-exercise-card"
              onClick={onNewExercise}
            >
              <h2 className="new-exercise-button-header">Add Exercise</h2>
            </li >

            {/* Exercise List */}
            {/* Map each exercise to an ExerciseCard */}
            {
              exercises.length ? (
                exercises.map((exercise, index) => (
                  <ExerciseCard
                    key={index}
                    exercise={exercise}
                    isExpanded={expandedExerciseId === exercise.id}
                    setExpandedExerciseId={setExpandedExerciseId}
                    resetInnerExpansion={expandedExerciseId !== exercise.id}
                    popupData={popupData}
                  />
                ))
              ) : (
                <h2>No exercises found!</h2>
              )
            }
          </ul >
        )
      }
    </>
  );

};

export default ExerciseList;
