import exerciseCategorizer from "./exerciseCatagories.js";

export default function workoutProcessing(workoutArray) {
  workoutArray = exerciseCategorizer(workoutArray);

  let workoutsObj = {
    dates: [],
  };

  workoutArray.forEach((workout) => {
    if (
      !workoutsObj.dates.includes(workout["workout_date"].toLocaleDateString())
    ) {
      workoutsObj.dates.push(workout["workout_date"].toLocaleDateString());
    }
  });

  workoutsObj.dates.forEach((date) => {
    let dateObj = {
      id: null,
      exercises: [],
    };

    workoutArray.forEach((entry) => {
      if (entry["workout_date"].toLocaleDateString() === date) {
        dateObj.id = entry["workout_id"];
        if (!dateObj.exercises.flat().includes(entry["exercise_name"])) {
          dateObj.exercises.push([entry["exercise_name"], entry["category"]]);
        }
      }
    });

    dateObj.sets = {};
    dateObj.exercises.forEach((exercise) => {
      workoutArray.forEach((entry) => {
        if (entry["workout_date"].toLocaleDateString() === date) {
          if (entry["exercise_name"] === exercise[0]) {
            if (dateObj.sets[entry["exercise_name"]] === undefined) {
              dateObj.sets[entry["exercise_name"]] = [];
            }
            dateObj.sets[entry["exercise_name"]].push([
              entry["set_order"],
              Number(entry["weight"]),
              entry["reps"],
            ]);
          }
        }
      });
    });
    workoutsObj[date] = dateObj;
  });

  return workoutsObj;
}
