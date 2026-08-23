import { ChangeEvent, useState, useEffect, SubmitEvent } from "react";
import { useSession } from "next-auth/react"; // Import NextAuth session
import { toTitleCase, getFormattedDate } from "@/utils/utils";
import { WaiterMessage } from "@/components/Waiter";
import { useWaiter } from "@/contexts/WaiterContext";
import ExercisesList from "@/components/ExercisesList";

import buttonStyles from "@/styles/buttons.module.css";
import { ScreenSize } from "@/constants/generalConstants";
import { ErrorKey, useErrorReporter } from "@/contexts/ErrorContext";
import {
  ContentTypeAppJson,
  ContentTypes,
  FetchMethods,
  ResponseLikeObject,
} from "@/constants/fetchConstants";

import styles from "./NewWorkoutFormContainer.module.css";

interface Props {
  visible: boolean;
  screenSize?: ScreenSize | undefined;
  exerciseName: string | null;
  onClose: null | (() => void);
}

interface NewWorkoutFormData {
  date: string;
  exercise: string;
  weight: string;
  reps: string;
}

export default function NewWorkoutFormContainer({
  visible,
  screenSize = ScreenSize.Regular,
  onClose,
  exerciseName,
}: Props) {
  const { data: session } = useSession(); // Get authentication session
  const { setWaiter, clearWaiter } = useWaiter();
  const { handleNoToken, handleResponseError } = useErrorReporter();

  const [validForm, setValidForm] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const [formData, setFormData] = useState({
    date: getFormattedDate(), // Sets the default date to today
    exercise: exerciseName?.replace(/-/g, " ") || "",
    weight: "",
    reps: "",
  });

  const server = process.env.NEXT_PUBLIC_BACKEND;
  const userId = session?.user?.id || localStorage.getItem("userId");

  if (typeof exerciseName === "string") {
    exerciseName = exerciseName?.replace(/-/g, " ");
    exerciseName = toTitleCase(exerciseName);
  }

  //* On Change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  //* Form Validation
  useEffect(() => {
    const formComplete = (formData: NewWorkoutFormData): boolean => {
      return (
        formData.date.trim() !== "" &&
        formData.exercise.trim() !== "" &&
        Number(formData.weight) > 0 && // Ensures weight is positive
        Number(formData.reps) > 0 // Ensures reps are positive
      );
    };

    setValidForm(formComplete(formData));
  }, [formData]);

  //* SUBMIT
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWaiting(true);

    const token = session?.user?.authToken || localStorage.getItem("token");

    if (!token) {
      // TODO: error popup
      alert("User not authenticated.");
      // redirect them to login
      handleNoToken();
      return;
    }

    if (Number(formData.weight) <= 0 || Number(formData.reps) <= 0) {
      alert("Weight and reps must be greater than zero!");
      setWaiting(false);
      return;
    }

    const payload = {
      workoutDate: formData.date,
      exercise: formData.exercise,
      weight: Number(formData.weight),
      reps: Number(formData.reps),
    };
    console.log("🟢 Final Payload:", payload);

    const response = await fetch(`${server}/api/user/${userId}/log-workout`, {
      method: FetchMethods.POST,
      headers: {
        ...ContentTypeAppJson,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("🔵 API Response:", responseData);

    if (response.ok) {
      alert(responseData.message);
      setFormData({
        date: formData.date,
        exercise: formData.exercise,
        weight: "",
        reps: "",
      });
      clearWaiter();
      if (visible && onClose !== null) {
        onClose();
      }
    } else {
      alert("Error logging workout.");
      clearWaiter();
      handleResponseError({
        response: response as ResponseLikeObject,
        key: ErrorKey.NewWorkout,
      });
    }
  };

  //* Waiting effects
  useEffect(() => {
    if (waiting) {
      setWaiter(WaiterMessage.Submitting);
    }
  }, [waiting]);

  return (
    <div className={styles.newWorkoutFormWrapper}>
      {screenSize === ScreenSize.XXLarge && (
        <form onSubmit={handleSubmit} className={styles.newSetForm}>
          <div className="form-xxl-row">
            <input
              className={styles.newWorkoutField}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <ExercisesList
              name="exercise"
              value={`${exerciseName ? toTitleCase(exerciseName) : formData.exercise}`}
              onChange={(value) =>
                handleChange({
                  target: { name: "exercise", value },
                } as ChangeEvent<HTMLInputElement>)
              }
            />

            <input
              className={styles.newWorkoutField}
              type="number"
              name="weight"
              id="input-weight"
              placeholder="Weight (lb)"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <input
              className={styles.newWorkoutField}
              type="number"
              name="reps"
              id="input-reps"
              placeholder="Reps"
              value={formData.reps}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-xxl-row">
            <button
              className={`${validForm && !waiting ? "active" : ""} ${buttonStyles.submitButton}`}
              type="submit"
              disabled={waiting}
            >
              LOG
            </button>
          </div>
        </form>
      )}

      {screenSize !== ScreenSize.XXLarge && (
        <form onSubmit={handleSubmit} className={styles.newSetForm}>
          <div className="form-xl-row">
            <input
              className={styles.newWorkoutField}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-xl-row">
            <ExercisesList
              name="exercise"
              value={exerciseName || formData.exercise}
              onChange={(value) =>
                handleChange({
                  target: { name: "exercise", value },
                } as ChangeEvent<HTMLInputElement>)
              }
            />
          </div>

          <div className="form-xl-row" id="weight-reps">
            <input
              className={styles.newWorkoutField}
              type="number"
              name="weight"
              id="input-weight"
              placeholder="Weight (lb)"
              min="1"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <input
              className={styles.newWorkoutField}
              type="number"
              name="reps"
              id="input-reps"
              placeholder="Reps"
              min="1"
              value={formData.reps}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-xl-row" id="footer">
            <button
              className={`${validForm && !waiting ? "active" : ""} ${buttonStyles.submitButton}`}
              type="submit"
              disabled={waiting}
            >
              LOG
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
