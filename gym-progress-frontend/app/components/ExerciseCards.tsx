import React, { useState } from "react";
import ExerciseCard from "./ExerciseCard";

interface ExerciseCard {
  iid: number;
  name: string;
  category: string;
  last_logged_date: string;
}

interface Props {
  exercises: ExerciseCard[];
  onNewExercise: () => void;
}

const ExerciseList: React.FC<Props> = ({ exercises, onNewExercise }) => {

  const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);

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
          />
        ))
      ) : (
        <h2>No exercises found!</h2>
      )}
    </ul>
  );
};

export default ExerciseList;
