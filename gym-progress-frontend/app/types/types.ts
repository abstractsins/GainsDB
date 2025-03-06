export interface WorkoutListContainer {
    workouts: WorkoutsObj;
    totalWorkouts: number;
    totalPages: number;
    currentPage: number;
}

export interface WorkoutsMap {
    [key: `${number}/${number}/${number}`]: DateObj;
}

export interface WorkoutsObj extends WorkoutsMap {
    dates: string[];
}

export interface DateObj {
    id: string;
    exercises: Array<string>;
    sets: number[][];
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