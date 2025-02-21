"use client";

import { GiWeightLiftingUp } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ExercisesLegend from "@/app/components/ExercisesLegend";
import NewExerciseButton from "@/app/components/NewExerciseButton";
import NewExercisePopup from "@/app/components/NewExercisePopup";
import normalizeDate from "@/app/components/normalizeDate";
import Loading from "./loading";

interface Exercise {
  name: string,
  category: string;
  last_logged_date: string;
}
const server = process.env.NEXT_PUBLIC_BACKEND;

export default function Exercises() {
  const { data: session, status } = useSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const userId = session?.user?.id || localStorage.getItem("userId");
  const [dataUpdated, setDataUpdated] = useState(0); 
  const [loading, setLoading] = useState<boolean>(true);

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
  
  };
  

  useEffect(() => {
    if (status === "authenticated" && session?.user?.authToken) {
      fetchExercises();
    }
  }, [session, status, dataUpdated]);



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

      const data: Exercise[] = await response.json();
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

  const toTitleCase = (text: string) => text.replace(/\b\w/g, (char) => char.toUpperCase());



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const newExerciseHandler = () => {
    setPopupVisible(true);
  }

  const closeFunctions = () => {
    setPopupVisible(false); 
    refreshContent();
  }

  return (
    <div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="exe-header p-2 flex items-center">

        <div className="p-2 flex flex-col items-center">
          <h1 className="page-header">Your Exercises</h1>
          <span className="w-[100%]">Total exercises logged: {exercises.length}</span>
        </div>

        <input
          type="text"
          placeholder="search exercises..."
          className="exe-search text-[18pt] p-2 m-4"
          onChange={handleSearch}
        ></input>

      </div>
      <ExercisesLegend onCategorySelect={handleCategorySelect} />
      { loading 
      ? <Loading />
      : (<ul className="exercises-ul" key={dataUpdated}>
        <li 
          className="exercise-card"
          id="add-exercise-card"
          onClick={newExerciseHandler}
          >
          <NewExerciseButton />
        </li>

        {filteredExercises.length ? filteredExercises.map((exercise, index) => (
          <li
          key={index}
          className={`${exercise.category} exercise-card text-white`}
          >
            <h2 className="exercise-list">{toTitleCase(exercise.name)}</h2>
            <span className="text-[12pt] font-thin">Last logged: {normalizeDate(exercise['last_logged_date'], true)}</span>
          </li>
        )) : (
          <h2>No exercises found!</h2>
        )}
      </ul>)
      }

      {popupVisible && <NewExercisePopup visible={popupVisible} onClose={closeFunctions}/>}

    </div>
  );
}
