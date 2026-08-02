import styles from "@/components/LoginRegister.module.css";
import { CredentialsFormData } from "@/constants/formConstants";
import { InputTypes } from "@/constants/generalConstants";
import { ChangeEvent, useState } from "react";
import RegistrationNotes from "./RegistrationNotes";

interface Props {
  passwordError: string;
  registrationError: string | undefined;
  isPasswordValid: boolean;
  confirmPasswordError: string;
  credentialFormStrings: Record<string, string>;
  formData: CredentialsFormData;
  handleChange: (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
}

export default function RegistrationFields({
  passwordError,
  registrationError,
  isPasswordValid,
  confirmPasswordError,
  credentialFormStrings,
  formData,
  handleChange,
}: Props) {
  return (
    <>
      <div className={styles.errorMessageWrapper}>
        {passwordError && (
          <p className={`${styles.fieldSubtitle} error`}>{passwordError}</p>
        )}
        {registrationError && (
          <p className={`${styles.fieldSubtitle} error`}>{registrationError}</p>
        )}
      </div>
      <input
        className={styles.credentialField}
        type={InputTypes.Password}
        placeholder={credentialFormStrings?.placeholderConfirmPassword}
        name="passwordConfirm"
        value={formData.passwordConfirm || ""}
        autoCorrect="off"
        spellCheck="false"
        onChange={(event) => (isPasswordValid ? handleChange(event) : null)}
        aria-disabled={!isPasswordValid} // Disable until password is valid
        readOnly={!isPasswordValid}
        required
      />
      <div className={styles.errorMessageWrapper}>
        {isPasswordValid && confirmPasswordError && (
          <p className={styles.fieldSubtitle}>{confirmPasswordError}</p>
        )}
      </div>
      <RegistrationNotes />
    </>
  );
}
