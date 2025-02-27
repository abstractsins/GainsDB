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






export interface DashboardData {
    totalWorkouts: number;
    totalWeeks: number;
    mostLoggedExe: LoggedExe[];
    theMostWeight: MostWeight[];
    mostVolumeChange: VolumeChange[];
}

export interface LoggedExe {
    exercise_id: number;
    exercise_name: string;
    log_count: string;
}

export interface MostWeight {
    exercise_id: number;
    exercise_name: string;
    max_weight: string; 
}

export interface VolumeChange {
    exercise_id: number;
    exercise_name: string;
    min_volume: string;
    max_volume: string;
    volume_change: string;
}