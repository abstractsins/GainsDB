"use client";

import { IoClose } from "react-icons/io5";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import LogWorkoutPopup from "@/components/exercises/LogWorkoutPopup";
import ExercisesLegend from "@/components/ExercisesLegend";
import NewExercisePopup from "@/components/NewExercisePopup";
import ExerciseCards from "@/components/ExerciseCards";

import { ExerciseCard } from "@/types/types";

const server = process.env.NEXT_PUBLIC_BACKEND;

export default function Exercises() {
  const { data: session, status } = useSession();
  const [exercises, setExercises] = useState<ExerciseCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseCard[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const userId = session?.user?.id || localStorage.getItem("userId");
  const [dataUpdated, setDataUpdated] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [resetInnerExpansion, setResetInnerExpansion] = useState(false);

  // Popup Log trial
  const [popupLog, setPopupLog] = useState<boolean>(false);
  const [logExeId, setLogExeId] = useState<string>("0");

  const [inputValue, setInputValue] = useState("");

  const handlePopupLog = (popup: boolean, id: string) => {
    setPopupLog(popup);
    setLogExeId(id);
    console.log("Log was clicked for " + id);
    console.log("popupLog is " + popupLog);
  };

  const refreshContent = () => setDataUpdated((prev) => prev + 1);

  const handleCategorySelect = (category: string) => {
    const normalizedCategory = category.toLowerCase().replace(/\s/g, "-");

    setSelectedCategory((prev) =>
      prev === normalizedCategory ? null : normalizedCategory,
    );

    console.log("Selected Category:", normalizedCategory);

    if (selectedCategory === normalizedCategory) {
      setFilteredExercises(
        searchTerm
          ? exercises.filter((exe) =>
              exe.name.toLowerCase().includes(searchTerm),
            )
          : exercises,
      );
      return;
    }

    if (normalizedCategory === "all") {
      setFilteredExercises(exercises);
      setSelectedCategory(null);
    } else {
      const filteredByCategory = exercises.filter(
        (exe) => exe.category === normalizedCategory,
      );
      const filteredBySearch = searchTerm
        ? filteredByCategory.filter((exe) =>
            exe.name.toLowerCase().includes(searchTerm),
          )
        : filteredByCategory;
      setFilteredExercises(filteredBySearch);
    }

    setResetInnerExpansion(true);

    setTimeout(() => {
      setResetInnerExpansion(false); // Allow expansion again after a short delay
    }, 100);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const input = e.target.value.toLowerCase();
    setSearchTerm(input);

    const filteredBySearch = input
      ? exercises.filter((exe) => exe.name.toLowerCase().includes(input))
      : exercises;

    const filteredByCategory = selectedCategory
      ? filteredBySearch.filter((exe) => exe.category === selectedCategory)
      : filteredBySearch;

    const sortedExercises = [...filteredByCategory].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    setFilteredExercises(sortedExercises);
  };

  const handleClearSearch = () => {
    setInputValue(""); // Clears input field
    setSearchTerm(""); // Clears search term
    setFilteredExercises(exercises); // Resets exercises to original list
  };

  const newExerciseHandler = () => {
    setPopupVisible(true);
  };

  const closeFunctions = () => {
    setPopupLog(false);
    setPopupVisible(false);
    refreshContent();
  };

  const handleResetExpansions = () => {
    setResetInnerExpansion(true);
    setTimeout(() => setResetInnerExpansion(false), 100);
  };

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const token = session?.user?.authToken || localStorage.getItem("token");
    if (status === "loading") return;
    if (!token) {
      setError("No authentication session found. Please log in.");
      setLoading(false); // ensure we don’t get stuck if we early-return
      return;
    }

    // If we already have data and nothing signaled a real change, skip
    const shouldRefetch =
      dataUpdated || !hasFetchedRef.current || exercises.length === 0;

    if (!shouldRefetch) return;

    const fetchExercises = async () => {
      // Only show loader if this is a cold fetch
      if (!hasFetchedRef.current || exercises.length === 0) setLoading(true);

      try {
        const res = await fetch(`${server}/api/user/${userId}/exercises`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok)
          throw new Error(
            (await res.json()).message || "Failed to fetch exercises",
          );

        const data: ExerciseCard[] = await res.json();
        if (!Array.isArray(data))
          throw new Error("API did not return an array");

        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setExercises(sorted);
        setFilteredExercises(sorted);
        hasFetchedRef.current = true;
      } catch (e: any) {
        console.error("Error fetching exercises:", e.message);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && token) fetchExercises();
    // Only include the minimal deps that truly affect fetching:
  }, [status, session?.user?.authToken, dataUpdated, userId]);

  return (
    <div id="exercises-page">
      {error && <p className="text-red-500">{error}</p>}

      <div className="exe-header flex items-center">
        <div className="flex flex-col items-center header-left">
          <h1 className="page-header">Your Exercises</h1>
          <span className="w-[100%]">
            Total exercises logged: {exercises.length}
          </span>
        </div>

        <input
          type="text"
          value={inputValue}
          id="exe-search"
          placeholder="search exercises..."
          className="exe-search text-[18pt] p-2 m-4"
          onChange={handleSearch}
        />
        {inputValue && (
          <button onClick={handleClearSearch} className="clear-button">
            <IoClose className="text-lg" />
          </button>
        )}
      </div>

      <ExercisesLegend
        onCategorySelect={handleCategorySelect}
        onResetExpansion={handleResetExpansions}
        activeCategoryOverride={null}
      />

      <ExerciseCards
        loading={loading}
        exercises={filteredExercises}
        onNewExercise={newExerciseHandler}
        resetInnerExpansion={resetInnerExpansion}
        popupData={handlePopupLog}
      />

      {popupVisible && (
        <div className="click-block">
          <NewExercisePopup visible={popupVisible} onClose={closeFunctions} />
        </div>
      )}
      {popupLog && (
        <div className="click-block">
          <LogWorkoutPopup
            visible={popupLog}
            exeId={logExeId}
            onClose={closeFunctions}
          />
        </div>
      )}
    </div>
  );
}
