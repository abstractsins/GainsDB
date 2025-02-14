"use client";

import ExercisesList from "@/app/components/ExercisesList";
import { ChangeEvent, FormEvent, useState } from "react";

export default function NewWorkout() {
  const [formData, setFormData] = useState({
    date: "",
    machine: "",
    weight: "",
    reps: "",
    sets: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/log-workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Workout logged!");
      setFormData({ date: "", machine: "", weight: "", reps: "", sets: "" });
    } else {
      alert("Error logging workout.");
    }
  };

  return (
    <div>
      <h1>Log a New Workout</h1>

      <ExercisesList></ExercisesList>

      <form onSubmit={handleSubmit}>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="text" name="machine" placeholder="Machine" value={formData.machine} onChange={handleChange} required />
        <input type="text" name="weight" placeholder="Weight (e.g. 150lb)" value={formData.weight} onChange={handleChange} required />
        <input type="number" name="reps" placeholder="Reps" value={formData.reps} onChange={handleChange} required />
        <input type="number" name="sets" placeholder="Sets" value={formData.sets} onChange={handleChange} required />
        <button type="submit">Log Workout</button>
      </form>
    </div>
  );
}
