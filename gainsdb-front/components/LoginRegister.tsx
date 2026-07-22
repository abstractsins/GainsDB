import { useState } from "react";
import styles from "./LoginRegister.module.css";
import Login from "./forms/Login";
import Register from "./forms/Register";
import Loader from "./Loader";
import {
  blankCredentials,
  CredentialsFormData,
} from "@/constants/formConstants";
import { loginRequest } from "@/utils/fetchRequests";
import { LoginResponse } from "@/constants/fetchConstants";

export enum FormState {
  Login = "login",
  Register = "register",
}

export default function LoginRegister({
  setLoginResponse,
}: {
  setLoginResponse: (res: LoginResponse) => void;
}) {
  const [formState, setFormState] = useState<FormState>(FormState.Login);
  const [formData, setFormData] =
    useState<CredentialsFormData>(blankCredentials);

  const handleLoginSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    // try {
    //   const res = await loginRequest(formData);

    //   if (res && res.ok) {
    //     //* if response is good, send the route along
    //     const response = await res.json();
    //     setLoginResponse(response);
    //   } else {
    //     throw new Error("Response not ok"); //?
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
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
      {/* {waiting && <Loader msg={LoaderMessage.LoggingIn}></Loader>} */}
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
