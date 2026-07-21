import { useState } from "react";
import styles from "./LoginRegister.module.css";
import Login from "./forms/Login";
import Register from "./forms/Register";
import Loader from "./Loader";

export enum FormState {
  Login = "login",
  Register = "register",
}

export default function LoginRegister() {
  const [formState, setFormState] = useState<FormState>(FormState.Login);

  return (
    <div className={`${styles.popup} ${styles.loginPopup}`}>
      {waiting && <Loader msg={LoaderMessage.LoggingIn}></Loader>}
      <h1 className={`${styles.title}`}>GainsDB</h1>
      <h2>Track your workouts and visualize progress!</h2>

      <div className={`${styles.formContainer}`}>
        <form>
          {/* SWITCH BETWEEN LOGIN AND REGISTRATION */}
          {formState === FormState.Login && <Login />}
          {formState === FormState.Register && <Register />}
          <button
            id="submit-button"
            type="submit"
            className={`${styles.submitButton} ${waiting || !isFormValid ? styles.disabled : ""}`}
            disabled={waiting || !isFormValid}
          >
            {formState.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}
