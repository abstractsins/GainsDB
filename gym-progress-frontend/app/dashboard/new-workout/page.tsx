"use client";

import ExercisesList from "@/app/components/ExercisesList";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import NextAuth session

export default function NewWorkout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isXXLarge, setIsXXLarge] = useState(false);

  const getFormattedDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for local timezone
    return today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };

  const { data: session, status } = useSession(); // Get authentication session

  const [formData, setFormData] = useState({
    date: getFormattedDate(), // Sets the default date to today
    exercise: "",
    weight: "",
    reps: ""
  });


  interface FormData {
    date: string;
    exercise: string;
    weight: string;
    reps: string;
  }

  const userId = session?.user.id || localStorage.getItem("userId");

  const [validForm, setValidForm] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.name, e.target.value);
  };



  useEffect(() => {
    const handleResize = () => {
      console.log('resizing')
      if (window.innerWidth > 1699) {
        setIsXXLarge(true);
      } else if (window.innerWidth < 768) {
        setIsMobile(true);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    console.log(formData);
    setValidForm(formComplete(formData));
    return () => window.removeEventListener("resize", handleResize);
  }, [formData]);


  //* SUBMIT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = session?.user.authToken || localStorage.getItem("token"); 

    if (!token) {
        alert("User not authenticated.");
        return;
    }

    const payload = {
      workoutDate: formData.date, 
      exercise: formData.exercise,
      weight: Number(formData.weight),
      reps: Number(formData.reps),
    };
    console.log("🟢 Final Payload:", payload);

    const res = await fetch(`http://localhost:5000/api/user/${userId}/log-workout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();
    console.log("🔵 API Response:", responseData);

    if (res.ok) {
      alert("Workout logged. Keep it going!");
      setFormData({ date: formData.date, exercise: formData.exercise, weight: "", reps: "" });
    } else {
      alert("Error logging workout.");
    }
  };

  function formComplete(formData: FormData): boolean {
    return Object.values(formData).every(value => value.trim() !== "");
  }

  return (
    <div>
      <h1 className="text-[14pt] sm:text-[16pt] md:text-[20pt] lg:text-[26pt] xl:text-[30pt]">Record a Set!</h1>

      { isXXLarge && 

        <form onSubmit={handleSubmit} id="new-set-form" className="">
          <div className="form-xxl-row">

            <input className="m-4 p-4 new-workout-field text-[14pt] lg:text-[20pt] w-[50px] xl:w-[250px]" type="date" name="date" value={formData.date} onChange={handleChange} required />

            <ExercisesList 
              name="exercise"
              value={formData.exercise} 
              onChange={(value) => handleChange({ target: { name: "exercise", value } } as ChangeEvent<HTMLInputElement>)} 
            />

            <input className="new-workout-field" type="number" name="weight" id="input-weight" placeholder="Weight (lb)" value={formData.weight} onChange={handleChange} required />

            <input className="new-workout-field" type="number" name="reps" id="input-reps" placeholder="Reps" value={formData.reps} onChange={handleChange} required />

          </div>

          <div className="form-xxl-row">
            <button 
              className={`new-workout-button ${validForm ? "active" : ""}`} 
              type="submit" 
              disabled={!validForm}
            >
              Log Workout
            </button>
          </div>

        </form>
      }

      {/* { isMobile && } */}

      { !isMobile && !isXXLarge && 
        <form onSubmit={handleSubmit} id="new-set-form" className="flex flex-col items-center w-[100%] md:w-[80%] lg:w-[65%] p-8">
          
          <div className="form-xl-row">
            <input className="new-workout-field" type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-xl-row">
            <ExercisesList 
              name="exercise"
              value={formData.exercise} 
              onChange={(value) => handleChange({ target: { name: "exercise", value } } as ChangeEvent<HTMLInputElement>)}  
            />
          </div>
          
          <div className="form-xl-row">
            <input className="new-workout-field" type="number" name="weight" id="input-weight" placeholder="Weight (lb)" value={formData.weight} onChange={handleChange} required />
            <input className="new-workout-field" type="number" name="reps" id="input-reps" placeholder="Reps" value={formData.reps} onChange={handleChange} required />
          </div>

          <div className="form-xl-row">
            <button 
              className={`new-workout-button ${validForm ? "active" : ""}`} 
              type="submit" 
              disabled={!validForm}
              >
              Log Workout
            </button>
          </div>


        </form>
      }
         
    </div>
  );
}
