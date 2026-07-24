import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import LoginRegisterForm from "./forms/LoginRegisterForm";
import Register from "./forms/Register";

import {
  blankCredentials,
  CredentialsFormData,
} from "@/constants/formConstants";

import styles from "./LoginRegister.module.css";
import { useWaiter } from "@/contexts/WaiterContext";
import { WaiterMessage } from "./Waiter";
import { useFooter } from "@/contexts/FooterContext";

export enum FormState {
  Login = "login",
  Register = "register",
}

export default function LoginRegister() {
  const [formState, setFormState] = useState<FormState>(FormState.Login);
  const [formData, setFormData] =
    useState<CredentialsFormData>(blankCredentials);
  const [isFormValid, setFormValid] = useState(false);

  const { setWaiter, isWaiting } = useWaiter();

  const { setIsLoggedIn } = useFooter();

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
    } else {
      setIsLoggedIn(true);
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

  const renderCredentialsPrompt = (currentState: FormState) => {
    if (currentState === FormState.Login) {
      return (
        <span className={styles.credentialsPrompt}>
          Login below, or sign up{" "}
          <span
            className={styles.formStateSwitch}
            onClick={() => setFormState(FormState.Register)}
            onKeyDown={(key) =>
              key.code === "Enter" ? setFormState(FormState.Register) : null
            }
            tabIndex={0}
          >
            here
          </span>
        </span>
      );
    } else if (currentState === FormState.Register) {
      return (
        <span className={styles.credentialsPrompt}>
          Already a user? Login{" "}
          <span
            className={styles.formStateSwitch}
            onClick={() => setFormState(FormState.Login)}
            onKeyDown={(key) =>
              key.code === "Enter" ? setFormState(FormState.Login) : null
            }
            tabIndex={0}
          >
            here
          </span>
        </span>
      );
    }
  };

  useEffect(() => {
    // Clear confirm password field when switching out of register state
    if (formState === FormState.Login) {
      setFormData((prev) => ({ ...prev, passwordConfirm: "" }));
    }
  }, [formState]);

  return (
    <div className={styles.loginRegisterContainer}>
      <h1 className={styles.title}>GainsDB</h1>
      <h2 className={styles.subTitle}>
        Track your workouts and visualize progress!
      </h2>

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
          />

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
