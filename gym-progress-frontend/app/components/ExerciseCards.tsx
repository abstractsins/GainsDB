import React from "react";
import ExerciseCard from "./ExerciseCard";

interface ExerciseCard {
  name: string;
  category: string;
  last_logged_date: string;
}

interface Props {
  exercises: ExerciseCard[];
  onNewExercise: () => void;
}

const ExerciseList: React.FC<Props> = ({ exercises, onNewExercise }) => {

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
          <ExerciseCard key={index} exercise={exercise} />
        ))
      ) : (
        <h2>No exercises found!</h2>
      )}
    </ul>
  );
};

export default ExerciseList;
