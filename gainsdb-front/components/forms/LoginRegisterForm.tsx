import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { charMin, CredentialsFormData } from "@/constants/formConstants";
import { InputTypes } from "@/constants/generalConstants";
import { charMax } from "@/constants/formConstants";
import { cacheLoginRegisterFormStrings as cacheStrings } from "@/constants/formConstants";

import { FormState } from "@/components/LoginRegister";
import styles from "@/components/LoginRegister.module.css";

import RegistrationFields from "./RegistrationFields";

interface Props {
  formState: FormState;
  formData: CredentialsFormData;
  setFormData: Dispatch<SetStateAction<CredentialsFormData>>;
  setFormValid: Dispatch<SetStateAction<boolean>>;
  loginError: string | undefined;
  registrationError: string | undefined;
  formStateChange: () => void;
}

export default function LoginRegisterForm({
  formState,
  formData,
  setFormData,
  setFormValid,
  loginError,
  registrationError,
  formStateChange,
}: Props) {
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isConfirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [isValidUsername, setValidUsername] = useState(false);
  const [credentialFormStrings, setCredentialFormStrings] = useState<
    Record<string, string>
  >(cacheStrings(FormState.Login));

  // Confirm password validation function
  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== formData.password) {
      setConfirmPasswordError("Passwords do not match.");
      setConfirmPasswordValid(false);
      return false;
    } else {
      setConfirmPasswordError("");
      setConfirmPasswordValid(true);
      return true;
    }
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let asciiRange = true;
    for (let i = 0; i < password.length; i++) {
      if (password.charCodeAt(i) < 33 || password.charCodeAt(i) > 126) {
        asciiRange = false;
        break;
      }
    }

    if (!minLength) {
      setPasswordError("Password must be at least 8 characters");
      setPasswordValid(false);
    } else if (!hasUppercase) {
      setPasswordError("Password must contain at least one uppercase letter");
      setPasswordValid(false);
    } else if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character");
      setPasswordValid(false);
    } else if (asciiRange === false) {
      setPasswordError("Password characters must be in ASCII range 33 - 126");
      setPasswordValid(false);
    } else {
      setPasswordError(""); // No errors
      setPasswordValid(true); // Password is valid
    }
  };

  // Handle form input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Username validation: Only letters (a-z, A-Z) and numbers (0-9), max 15 chars
    const validUsernamePattern = /^[a-zA-Z0-9]*$/;
    if (name === "username") {
      if (!validUsernamePattern.test(value)) return; // Block invalid input
      if (value.length > charMax.username) return;
      setValidUsername(value.length >= charMin.username);
    }

    setFormData((prev: CredentialsFormData) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password field
    if (name === "password") {
      validatePassword(value);
    }

    // Validate confirm password field
    if (name === "passwordConfirm") {
      validateConfirmPassword(value);
    }
  };

  // Get form strings
  useEffect(() => {
    const strings = cacheStrings(formState);
    setCredentialFormStrings(strings);
    formStateChange();
    setConfirmPasswordValid(false);
  }, [formState]);

  // Clear the confirmation password field if 'create password' becomes invalid
  useEffect(() => {
    if (!isPasswordValid) {
      setFormData((prev) => ({ ...prev, passwordConfirm: "" }));
    }
  }, [isPasswordValid]);

  useEffect(() => {
    if (formState === FormState.Register) {
      // Validate Form
      setFormValid(
        isValidUsername && isPasswordValid && isConfirmPasswordValid,
      );
      // Clear password confirm error if field is empty
      if (formData.passwordConfirm === "") {
        setConfirmPasswordError("");
      }
    } else if (formState === FormState.Login) {
      // Validate Form
      setFormValid(isValidUsername && Boolean(formData.password));
    }
  }, [formData, formState]);

  return (
    <div className={styles.credentialFieldsContainer}>
      <input
        // ref={usernameRef}
        className={styles.credentialField}
        type={InputTypes.Text}
        placeholder={credentialFormStrings?.placeholderUsername}
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        className={styles.credentialField}
        type={InputTypes.Password}
        placeholder={credentialFormStrings?.placeholderPassword}
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {formState === FormState.Login && (
        <div className={styles.errorMessageWrapper}>
          <p className={`${styles.fieldSubtitle} error`}>{loginError}</p>
        </div>
      )}
      {formState === FormState.Register && (
        <RegistrationFields
          passwordError={passwordError}
          registrationError={registrationError}
          isPasswordValid={isPasswordValid}
          confirmPasswordError={confirmPasswordError}
          credentialFormStrings={credentialFormStrings}
          formData={formData}
          handleChange={handleChange}
        />
      )}
    </div>
  );
}
