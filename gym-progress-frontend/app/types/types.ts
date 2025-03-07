//* WORKOUT HISTORY
export interface WorkoutListContainer {
    workouts: WorkoutsObj;
    totalWorkouts: number;
    totalPages: number;
    currentPage: number;
}

export interface WorkoutsObj {
  dates: string[]; // Explicitly allow an array of dates
  [date: string]: DateObj | string[]; // Allow other properties as DateObj
}

export interface DateObj {
    id: string;
    exercises: string[];
    sets: Sets;
}

export interface Sets {
    [exercise: string]: SetArr;
}

export type SetArr = number[][];



//* DASHBOARD
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