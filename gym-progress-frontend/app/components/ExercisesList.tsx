"use client";

import { useEffect, useState } from "react";

export default function ExercisesList() {
    const [exercises, setExercises] = useState<string[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
          try {
            const res = await fetch("http://localhost:5000/api/exercises");
            const data = await res.json();
            
            console.log("Fetched Data:", data); // 🔍 Debugging
      
            if (!Array.isArray(data)) {
              throw new Error("API did not return an array");
            }
      
            setExercises(data.map((item) => item.name));
          } catch (error) {
            console.error("Error fetching exercises:", error);
          }
        };
      
        fetchExercises();
      }, []);

    return (
        <>
            <input className="text-black m-4 p-2" list="exercises-list" name="exercise" placeholder="Choose an exercise" />
            <datalist id="exercises-list">
                {exercises.map((exercise, index) => (
                    <option key={index} value={exercise} />
                ))}
            </datalist>
        </>
    )
}