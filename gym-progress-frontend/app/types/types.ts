export interface WorkoutListContainer {
    workouts: WorkoutsObj,
    totalWorkouts: number;
    totalPages: number;
    currentPage: number;
}

export interface WorkoutsObj {
    dates: string[];
    [key: string]: DateObj | string[];
}

export interface DateObj {
    id: number | string;
    exercises: string[];
    [key: string]: string[] | number[] | number | string;
}

export interface Workout {
    workout_date: string;
    exercises: Array<string>;
}
