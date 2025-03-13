"use client";

import { RiCloseLargeFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LogWorkoutPopup from "@/app/components/exercises/LogWorkoutPopup";
import ExercisesLegend from "@/app/components/ExercisesLegend";
import NewExercisePopup from "@/app/components/NewExercisePopup";
import ExerciseCards from "@/app/components/ExerciseCards";
import Loading from "./loading";

import { ExerciseCard } from "@/app/types/types";

const server = process.env.NEXT_PUBLIC_BACKEND;

export default function Exercises() {
  const { data: session, status } = useSession();
  const [exercises, setExercises] = useState<ExerciseCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseCard[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const userId = session?.user?.id || localStorage.getItem("userId");
  const [dataUpdated, setDataUpdated] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [resetInnerExpansion, setResetInnerExpansion] = useState(false);

  // Popup Log trial
  const [popupLog, setPopupLog] = useState<boolean>(false);
  const [logExeId, setLogExeId] = useState<string>('0');

  const [inputValue, setInputValue] = useState("");

  const handlePopupLog = (popup: boolean, id: string) => {
    setPopupLog(popup);
    setLogExeId(id);
    console.log('Log was clicked for ' + id);
    console.log('popupLog is ' + popupLog);
  }

  const refreshContent = () => setDataUpdated(prev => prev + 1);

  const handleCategorySelect = (category: string) => {
    const normalizedCategory = category.toLowerCase().replace(/\s/g, "-");

    setSelectedCategory(prev => prev === normalizedCategory ? null : normalizedCategory);

    console.log("Selected Category:", normalizedCategory);

    if (selectedCategory === normalizedCategory) {
      setFilteredExercises(searchTerm
        ? exercises.filter(exe => exe.name.toLowerCase().includes(searchTerm))
        : exercises
      );
      return;
    }


    if (normalizedCategory === 'all') {
      setFilteredExercises(exercises);
      setSelectedCategory(null);
    } else {
      const filteredByCategory = exercises.filter(exe => exe.category === normalizedCategory);
      const filteredBySearch = searchTerm
        ? filteredByCategory.filter(exe => exe.name.toLowerCase().includes(searchTerm))
        : filteredByCategory;
      setFilteredExercises(filteredBySearch);
    }


    setResetInnerExpansion(true);

    setTimeout(() => {
      setResetInnerExpansion(false); // Allow expansion again after a short delay
    }, 100);


  };


  useEffect(() => {
    const fetchExercises = async () => {
      if (status === "loading") return;

      setLoading(true);

      const token = session?.user?.authToken || localStorage.getItem("token");

      if (!token) {
        setError("No authentication session found. Please log in.");
        return;
      }

      try {
        console.log('server: ' + server);
        const response = await fetch(`${server}/api/user/${userId}/exercises`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch exercises");
        }

        const data: ExerciseCard[] = await response.json();
        if (!Array.isArray(data)) throw new Error("API did not return an array");

        const sortedExercises = [...data].sort((a, b) => a.name.localeCompare(b.name));

        setExercises(sortedExercises);
        setFilteredExercises(sortedExercises);
      } catch (error: any) {
        console.error("Error fetching exercises:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.authToken) {
      fetchExercises();
    }

  }, [session, status, dataUpdated, userId]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    const input = e.target.value.toLowerCase();
    setSearchTerm(input);


    const filteredBySearch = input
      ? exercises.filter(exe => exe.name.toLowerCase().includes(input))
      : exercises;

    const filteredByCategory = selectedCategory
      ? filteredBySearch.filter(exe => exe.category === selectedCategory)
      : filteredBySearch;

    const sortedExercises = [...filteredByCategory].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setFilteredExercises(sortedExercises);
  }

  const handleClearSearch = () => {
    setInputValue(""); // Clears input field
    setSearchTerm(""); // Clears search term
    setFilteredExercises(exercises); // Resets exercises to original list
  };

  const newExerciseHandler = () => {
    setPopupVisible(true);
  }

  const closeFunctions = () => {
    setPopupLog(false);
    setPopupVisible(false);
    refreshContent();
  }

  const handleResetExpansions = () => {
    setResetInnerExpansion(true);
    setTimeout(() => setResetInnerExpansion(false), 100);
  };

  return (
    <div id="exercises-page">

      {error && <p className="text-red-500">{error}</p>}

      <div className="exe-header flex items-center">

        <div className="flex flex-col items-center header-left">
          <h1 className="page-header">Your Exercises</h1>
          <span className="w-[100%]">Total exercises logged: {exercises.length}</span>
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
          <button
            onClick={handleClearSearch}
            className="clear-button"
          >
            <IoClose className="text-lg" />
          </button>
        )}


      </div>
      <ExercisesLegend
        onCategorySelect={handleCategorySelect}
        onResetExpansion={handleResetExpansions}
        activeCategoryOverride={null}
      />
      {loading ? (
        <Loading />
      ) : (
        <ExerciseCards
          exercises={filteredExercises}
          onNewExercise={newExerciseHandler}
          resetInnerExpansion={resetInnerExpansion}
          popupData={handlePopupLog}
        />
      )}

      {popupVisible && <div className="click-block"><NewExercisePopup visible={popupVisible} onClose={closeFunctions} /></div>}
      {popupLog && <div className="click-block"><LogWorkoutPopup visible={popupLog} exeId={logExeId} onClose={closeFunctions} /></div>}

    </div>
  );
}
