"use client";

import { useEffect } from "react";
import { useHistoryState } from "@/hooks/useHistoryState";
import { useFetchWorkouts } from "@/hooks/useFetchWorkouts";
import Loading from "./loading";
import WorkoutHistoryList from "@/components/WorkoutHistory/WorkoutHistoryList";
import ExercisesLegend from "@/components/ExercisesLegend";
import Pagination from "@/components/WorkoutHistory/Pagination";

import { toTitleCase } from "@/utils/utils";

import globalStyles from "@/styles/globalStyles.module.css";

export default function History() {
  const {
    page,
    setPage,
    timeframe,
    HRTimeframe,
    activeCategoryWorkouts,
    setActiveCategoryWorkouts,
    onTimeChange,
  } = useHistoryState();
  const selectedCategory = activeCategoryWorkouts ?? "all";
  const { workoutsObj, totalPages, totalWorkouts, loading, error } =
    useFetchWorkouts(page, timeframe, selectedCategory);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const onResetExpansion = () => {
    console.log("Reset triggered but not implemented yet.");
  };

  const onCategorySelect = (category: string) => {
    setActiveCategoryWorkouts(category);
    setPage(1);
  };

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, setPage]);

  return (
    <div id="history-page" className={globalStyles.functionPage}>
      <div className="page-header">
        <h1 className="page-header">Workout History</h1>

        {/* Timeframe Selector */}
        <div className="timeframe-filter">
          <label className="timeframe">Timeframe:</label>
          <select
            value={timeframe}
            onChange={onTimeChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
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
              ? `You logged ${totalWorkouts || 0} workout${totalWorkouts !== 1 ? "s" : ""} ${activeCategoryWorkouts && activeCategoryWorkouts !== "all" ? "with " + toTitleCase(activeCategoryWorkouts.replace(/-/g, " ")) + " exercises" : ""} in the last ${HRTimeframe || "2 weeks"}!`
              : `Total workouts logged: ${totalWorkouts}`}
          </span>
        </div>
      </div>

      <ExercisesLegend
        onResetExpansion={onResetExpansion}
        activeCategoryOverride={activeCategoryWorkouts}
        onCategorySelect={onCategorySelect}
      />

      {loading ? (
        <Loading />
      ) : (
        <WorkoutHistoryList workoutsObj={workoutsObj} />
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
