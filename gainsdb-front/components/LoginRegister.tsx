import { useState } from "react";
import { signIn } from "next-auth/react";

import Login from "./forms/Login";
import Register from "./forms/Register";
import Loader, { LoaderMessage } from "./Loader";

import {
  blankCredentials,
  CredentialsFormData,
} from "@/constants/formConstants";

import styles from "./LoginRegister.module.css";

export enum FormState {
  Login = "login",
  Register = "register",
}

export default function LoginRegister() {
  const [waiting, setWaiting] = useState(false);
  const [formState, setFormState] = useState<FormState>(FormState.Login);
  const [formData, setFormData] =
    useState<CredentialsFormData>(blankCredentials);

  const handleLoginSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setWaiting(true);

    signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });
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
    <div className={`${styles.popup} ${styles.loginPopup}`}>
      {waiting && <Loader msg={LoaderMessage.LoggingIn}></Loader>}
      <h1 className={`${styles.title}`}>GainsDB</h1>
      <h2>Track your workouts and visualize progress!</h2>

      <div className={`${styles.formContainer}`}>
        <form onSubmit={handleFormSubmission}>
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
