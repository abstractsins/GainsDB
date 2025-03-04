import React, { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";

interface ExerciseCard {
  id: number;
  name: string;
  category: string;
  last_logged_date: string;
}

interface Props {
  exercises: ExerciseCard[];
  onNewExercise: () => void;
  resetInnerExpansion: boolean;
  popupData: (popup: boolean, id: string) => void;
}

const ExerciseList: React.FC<Props> = ({ exercises, onNewExercise, resetInnerExpansion, popupData }) => {

  const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const toggleExpand = (exerciseId: string) => {
    setExpandedExercise(prev => (prev === exerciseId ? null : exerciseId));
  };

  useEffect(() => {
    if (resetInnerExpansion) {
      setExpandedExerciseId(null);
    }
  }, [resetInnerExpansion]);

  return (
    <ul className="exercises-ul">
      {/* New Exercise Button */}
      <li
        className="exercise-card"
        id="add-exercise-card"
        onClick={onNewExercise}
      >
        <h2 className="new-exercise-button-header">Add Exercise</h2>
      </li>

      {/* Exercise List */}
      {/* Map each exercise to an ExerciseCard */}
      {exercises.length ? (
        exercises.map((exercise, index) => (
          <ExerciseCard 
            key={index} 
            exercise={exercise} 
            isExpanded={expandedExerciseId === exercise.id}
            setExpandedExerciseId={setExpandedExerciseId}
            resetInnerExpansion={expandedExerciseId !== exercise.id}
            popupData={popupData}
            onClick={() => toggleExpand(exercise.id)}
          />
        ))
      ) : (
        <h2>No exercises found!</h2>
      )}
    </ul>
  );
};

export default ExerciseList;
