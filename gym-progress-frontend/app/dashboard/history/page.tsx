"use client";

import { useHistoryState } from "@/hooks/useHistoryState";
import { useFetchWorkouts } from "@/hooks/useFetchWorkouts";
import Loading from "./loading";
import WorkoutHistoryList from "@/app/components/WorkoutHistory/WorkoutHistoryList";
import ExercisesLegend from "@/app/components/ExercisesLegend";
import Pagination from "@/app/components/WorkoutHistory/Pagination";
import { applyCategoryFilter } from "@/utils/utils";

import { toTitleCase } from "@/utils/utils";


export default function History() {
  const { page, setPage, timeframe, HRTimeframe, activeCategoryWorkouts, setActiveCategoryWorkouts, isCatFiltered, setIsCatFiltered, onTimeChange } = useHistoryState();
  const { workoutsObj, totalPages, totalWorkouts, loading, error } = useFetchWorkouts(page, timeframe);

  const filteredWorkoutsObj = (activeCategoryWorkouts !== null && activeCategoryWorkouts !== 'all')  ? applyCategoryFilter(activeCategoryWorkouts, workoutsObj) : workoutsObj;

  const totalFilteredWorkouts = filteredWorkoutsObj?.dates.length;
  
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const onResetExpansion = () => {
    console.log("Reset triggered but not implemented yet.");
  };

  return (
    <div id="history-page">
      <div className="page-header">
        <h1 className="page-header">Workout History</h1>

        {/* Timeframe Selector */}
        <div className="timeframe-filter">
          <label className="timeframe">Timeframe:</label>
          <select value={timeframe} onChange={onTimeChange} className="bg-gray-800 text-white p-2 rounded">
            <option value="all">All</option>
            <option value="1w">1 Week</option>
            <option value="2w">2 Weeks</option>
            <option value="3w">3 Weeks</option>
            <option value="4w">4 Weeks</option>
            <option value="5w">5 Weeks</option>
            <option value="6w">6 Weeks</option>
          </select>
          <span className="timeframe">
            {timeframe !== "all"
              ? `You logged ${totalFilteredWorkouts || 0} workout${totalFilteredWorkouts !== 1 ? "s" : ""} ${activeCategoryWorkouts && activeCategoryWorkouts !== 'all' ? 'with ' + toTitleCase(activeCategoryWorkouts.replace(/-/g, ' ')) + ' exercises' : ''} in the last ${HRTimeframe || "2 weeks"}!`
              : `Total workouts logged: ${totalWorkouts}`}
          </span>
        </div>
      </div>

      <ExercisesLegend
        onResetExpansion={onResetExpansion}
        activeCategoryOverride={activeCategoryWorkouts}
        onCategorySelect={setActiveCategoryWorkouts}
      />

      {loading ? <Loading /> : <WorkoutHistoryList workoutsObj={filteredWorkoutsObj} />}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
