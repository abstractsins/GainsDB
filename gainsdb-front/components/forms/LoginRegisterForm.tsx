import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { charMin, CredentialsFormData } from "@/constants/formConstants";
import { InputTypes } from "@/constants/generalConstants";
import { charMax } from "@/constants/formConstants";

import { FormState } from "@/components/LoginRegister";
import styles from "@/components/LoginRegister.module.css";
import { FORMERR } from "dns";

interface Props {
  formState: FormState;
  formData: CredentialsFormData;
  setFormData: Dispatch<SetStateAction<CredentialsFormData>>;
  setFormValid: Dispatch<SetStateAction<boolean>>;
}

export default function LoginRegisterForm({
  formState,
  formData,
  setFormData,
  setFormValid,
}: Props) {
  const [credentialFormStrings, setCredentialFormStrings] =
    useState<Record<string, string>>();
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isConfirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [isValidUsername, setValidUsername] = useState(false);

  //* create utility for loading the placeholder/label/etc strings into an object for easy referencing inline
  const cacheStrings = (formState: FormState): Record<string, string> => {
    const loginStrings = {
      placeholderUsername: "Username",
      placeholderPassword: "Password",
    };
    const registerStrings = {
      placeholderUsername: "Create username",
      placeholderPassword: "Create password",
      placeholderConfirmPassword: "Confirm password",
    };

    if (formState === FormState.Login) {
      return loginStrings;
    } else if (formState === FormState.Register) {
      return registerStrings;
    }
    return {};
  };

  // Confirm password validation function
  const validateConfirmPassword = (confirmPassword: string) => {
    console.log(confirmPassword);
    console.log(formData.password);
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
        isValidUsername &&
          isPasswordValid &&
          validateConfirmPassword(formData.passwordConfirm || ""),
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
      {formState === FormState.Register && (
        <div className={styles.passwordErrorWrapper}>
          {passwordError ? (
            <p className="field-subtitle error">{passwordError}</p>
          ) : (
            <p className="field-subtitle"></p>
          )}
        </div>
      )}
      {formState === FormState.Register && (
        <>
          <input
            className={styles.credentialField}
            type={InputTypes.Password}
            placeholder={credentialFormStrings?.placeholderConfirmPassword}
            name="passwordConfirm"
            value={formData.passwordConfirm || ""}
            autoCorrect="off"
            spellCheck="false"
            onChange={(e) => (isPasswordValid ? handleChange(e) : null)}
            aria-disabled={!isPasswordValid} // Disable until password is valid
            readOnly={!isPasswordValid}
            required
          />
          <div className={styles.passwordErrorWrapper}>
            {isPasswordValid && confirmPasswordError ? (
              <p className="field-subtitle error">{confirmPasswordError}</p>
            ) : (
              <p className="field-subtitle"></p>
            )}
          </div>
          <div className={styles.registrationNotesWrapper}>
            <ul className={styles.registrationNotesList}>
              <li className={styles.registrationNoteItem}>
                We store only the data you enter.
              </li>
              <li className={styles.registrationNoteItem}>
                No email or personal info required.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
