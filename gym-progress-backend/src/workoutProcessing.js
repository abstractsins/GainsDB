export default function workoutProcessing(workoutArray) {

    console.log('workoutArray');
    console.log(workoutArray);

    let workoutObj = {
        dates: [],
    }
    
    workoutArray.forEach(workout => {
        if (!workoutObj.dates.includes(workout['workout_date'].toLocaleDateString())) {
            workoutObj.dates.push(workout['workout_date'].toLocaleDateString());
        }
    })
    
    workoutObj.dates.forEach(date => {
        let dateObj = {
            id: null,
            exercises: []
        }
        
        workoutArray.forEach(entry => {
            if (entry['workout_date'].toLocaleDateString() === date ) {
                dateObj.id = entry['workout_id'];
                if (!dateObj.exercises.includes(entry['exercise_name'])) {
                    dateObj.exercises.push(entry['exercise_name']);
                }
            }
        });
        
        dateObj.exercises.forEach(exercise => {
            let sets = [];
            workoutArray.forEach(entry => {
                if (entry['workout_date'].toLocaleDateString() === date ) {
                    if (entry['exercise_name'] === exercise) {
                        sets.push([entry['set_order'], Number(entry['weight']), entry['reps']]);
                    }
                }
            })
            dateObj[exercise] = sets;
        });
        workoutObj[date] = dateObj;
    })

    return workoutObj;

}