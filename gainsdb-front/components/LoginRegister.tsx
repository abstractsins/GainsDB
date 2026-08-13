import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import LoginRegisterForm from "./forms/LoginRegisterForm";

import {
  blankCredentials,
  CredentialsFormData,
} from "@/constants/formConstants";

import styles from "./LoginRegister.module.css";
import { useWaiter } from "@/contexts/WaiterContext";
import { WaiterMessage } from "./Waiter";
import { useAuthContext } from "@/contexts/AuthContext";
import { registrationRequest } from "@/utils/fetchRequests";
import { LoginError, RegistrationError } from "@/constants/errorMessages";

export enum FormState {
  Login = "login",
  Register = "register",
}

export default function LoginRegister() {
  const [formState, setFormState] = useState<FormState>(FormState.Login);
  const [formData, setFormData] =
    useState<CredentialsFormData>(blankCredentials);
  const [isFormValid, setFormValid] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [registrationError, setRegistrationError] = useState<string>();

  const { setWaiter, clearWaiter, isWaiting } = useWaiter();
  const { setUserLoggedIn } = useAuthContext();

  const onFormStateChange = () => {
    setRegistrationError(undefined);
    setLoginError(undefined);
  };

  const handleLoginSubmit = async () => {
    setLoginError(undefined);
    setWaiter(WaiterMessage.LoggingIn);

    const user = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    if (!user || !user.ok) {
      clearWaiter();
      if (user) {
        switch (user.status) {
          case 401:
            setLoginError(LoginError.InvalidCredentials);
            break;
          case 500:
            setLoginError(LoginError.Server);
            break;
        }
      }
    } else {
      setUserLoggedIn();
    }
  };

  const handleRegisterSubmit = async () => {
    setRegistrationError(undefined);
    setWaiter(WaiterMessage.Registering);

    const response = await registrationRequest({
      username: formData.username,
      password: formData.password,
      date: new Date(),
    });

    if (!response) {
      alert("error registering");
    } else {
      if (response.status !== 201) {
        switch (response.status) {
          case 400:
            setRegistrationError(RegistrationError.NameTaken);
            break;
          case 500:
            setRegistrationError(RegistrationError.Server);
            break;
          default:
            setRegistrationError(RegistrationError.Unknown);
        }
      } else {
        alert(response.message);
        window.location.reload();
      }
    }

    clearWaiter();
  };

  const handleFormSubmission = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (isFormValid) {
      switch (formState) {
        case FormState.Login:
          handleLoginSubmit();
          break;
        case FormState.Register:
          handleRegisterSubmit();
          break;
      }
    }
  };

  const renderCredentialsPrompt = (currentState: FormState) => {
    const switchFormState = (prev: FormState) =>
      prev === FormState.Login ? FormState.Register : FormState.Login;

    return (
      <>
        {currentState === FormState.Login && (
          <span className={styles.credentialsPrompt}>
            Login below, or sign up{" "}
          </span>
        )}
        {currentState === FormState.Register && (
          <span className={styles.credentialsPrompt}>
            Already a user? Login{" "}
          </span>
        )}
        <span
          className={styles.formStateSwitch}
          onClick={() => setFormState(switchFormState)}
          onKeyDown={(key) =>
            key.code === "Enter" ? setFormState(switchFormState) : null
          }
          tabIndex={0}
        >
          here
        </span>
      </>
    );
  };

  useEffect(() => {
    // Clear confirm password field when switching out of register state
    if (formState === FormState.Login) {
      setFormData((prev) => ({ ...prev, passwordConfirm: "" }));
    }
  }, [formState]);

  return (
    <div className={styles.loginRegisterContainer}>
      {/* HEADER */}
      <h1 className={styles.title}>GainsDB</h1>
      <h2 className={styles.subTitle}>
        Track your workouts and visualize progress!
      </h2>

      {/* FORM AREA */}
      <div className={styles.formContainer}>
        <div className={styles.credentialsPromptWrapper}>
          {renderCredentialsPrompt(formState)}
        </div>
        <form
          className={styles.loginRegisterForm}
          onSubmit={handleFormSubmission}
        >
          {/* SWITCH BETWEEN LOGIN AND REGISTRATION */}
          <LoginRegisterForm
            formState={formState}
            formData={formData}
            setFormData={setFormData}
            setFormValid={setFormValid}
            loginError={loginError}
            registrationError={registrationError}
            formStateChange={onFormStateChange}
          />

          {/* SUBMIT BUTTON */}
          <button
            id="submit-button"
            type="submit"
            className={styles.submitButton}
            aria-disabled={isWaiting || !isFormValid}
          >
            {formState.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}
