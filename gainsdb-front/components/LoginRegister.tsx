import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import Login from "./forms/Login";
import Register from "./forms/Register";

import {
  blankCredentials,
  CredentialsFormData,
} from "@/constants/formConstants";

import styles from "./LoginRegister.module.css";
import { useWaiter } from "@/contexts/WaiterContext";
import { WaiterMessage } from "./Waiter";

export enum FormState {
  Login = "login",
  Register = "register",
}

export default function LoginRegister() {
  const [formState, setFormState] = useState<FormState>(FormState.Login);
  const [formData, setFormData] =
    useState<CredentialsFormData>(blankCredentials);

  const { setWaiter } = useWaiter();

  const handleLoginSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setWaiter(WaiterMessage.LoggingIn);

    const user = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    if (!user || !user.ok) {
      setWaiter(false);
      // handle authentication error notification
      // TODO make custom modal?
      if (user) {
        switch (user.status) {
          case 401:
            alert("Authentication error 401: Invalid credentials");
            break;
          case 500:
            alert("Response 500: Server Error");
            break;
        }
      }
    }
  };

  const handleRegisterSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
  };

  const handleFormSubmission = (event: React.SubmitEvent) => {
    switch (formState) {
      case FormState.Login:
        handleLoginSubmit(event);
        break;
      case FormState.Register:
        handleRegisterSubmit(event);
        break;
    }
  };

  return (
    <div className={styles.loginRegisterContainer}>
      <h1 className={styles.title}>GainsDB</h1>
      <h2 className={styles.subTitle}>
        Track your workouts and visualize progress!
      </h2>

      <div className={styles.formContainer}>
        <form
          className={styles.loginRegisterForm}
          onSubmit={handleFormSubmission}
        >
          {/* SWITCH BETWEEN LOGIN AND REGISTRATION */}
          {formState === FormState.Login && (
            <Login formData={formData} setFormData={setFormData} />
          )}
          {formState === FormState.Register && (
            <Register formData2={formData} setFormData2={setFormData} />
          )}

          <button
            id="submit-button"
            type="submit"
            // className={`${styles.submitButton} ${waiting || !isFormValid ? styles.disabled : ""}`}
            // disabled={waiting || !isFormValid}
          >
            {formState.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}
