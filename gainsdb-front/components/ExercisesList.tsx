"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Import NextAuth session
import { LoggedExe } from "../types/types";

import { useErrorReporter } from "@/contexts/ErrorContext";
import { ResponseLikeObject } from "@/constants/fetchConstants";

import styles from "@/components/NewWorkoutFormContainer.module.css";
interface ExercisesList {
  name: string;
}

interface Props {
  value: string;
  name: string;
  onChange: (value: string) => void;
}

export default function ExercisesList({ value, name, onChange }: Props) {
  const { data: session, status } = useSession(); // Get authentication session
  const [exercises, setExercises] = useState<ExercisesList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = session?.user?.id || localStorage.getItem("userId");
  const server = process.env.NEXT_PUBLIC_BACKEND;

  const { handleResponseError } = useErrorReporter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.authToken) {
      fetchExercises();
    }
  }, [session, status]);

  const fetchExercises = async () => {
    if (status === "loading") return; // Wait for session to load

    const token = session?.user?.authToken || localStorage.getItem("token");

    if (!token) {
      setError("No authentication session found. Please log in.");
      return;
    }

    const response = await fetch(`${server}/api/user/${userId}/exercises`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is attached if needed
      },
    });

    console.warn(response);

    if (!response.ok) {
      handleResponseError(response as ResponseLikeObject);
    }

    const data = await response.json();
    console.log("Fetched Exercises:", data);
    if (!Array.isArray(data)) {
      console.warn("API did not return an array");
      return;
    }

    setExercises(data);
  };

  const toTitleCase = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // if (exercises.some(ex => toTitleCase(ex) === e.target.value)) {
    onChange(e.target.value); // Send selected value to parent
    // }
  };

  return (
    <select
      className={styles.newWorkoutField}
      name="exercise"
      value={value}
      onChange={handleSelect}
      required
      id="exercises-list"
    >
      {value === "" ? (
        <option value="" disabled hidden>
          Select an exercise
        </option>
      ) : (
        <option value={value} disabled hidden>
          {value}
        </option>
      )}
      {exercises.map((exercise, index) => (
        <option className="" key={index} value={toTitleCase(exercise.name)}>
          {toTitleCase(exercise.name)}
        </option>
      ))}
    </select>
  );
}
