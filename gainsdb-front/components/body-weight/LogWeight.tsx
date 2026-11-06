import styles from "@/app/user/body-weight/page.module.css";
import buttonStyles from "@/styles/buttons.module.css";
import { useState } from "react";

export default function LogWeight() {
  const [loggedBodyWeight, setLoggedBodyWeight] = useState("");

  const logWeightFormSubmitHandler = (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
  };

  const loggedBodyWeightInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newBodyWeightValue = event.target.value;

    if (/^\d*\.?\d{0,2}$/.test(newBodyWeightValue)) {
      setLoggedBodyWeight(newBodyWeightValue);
    }
  };

  return (
    <>
      <h2 className={styles.sectionHeader}>Log Weight</h2>

      <div className={styles.weightLoggingWrapper}>
        <form onSubmit={logWeightFormSubmitHandler}>
          <div className={styles.inputsWrapper}>
            <input type="date" />
            <input
              type="number"
              value={loggedBodyWeight}
              step={0.01}
              min={0}
              onChange={loggedBodyWeightInputChangeHandler}
            />
          </div>
          <button
            className={buttonStyles.submitButton}
            type="submit"
            value="log weight"
          >
            Log Weight
          </button>
        </form>
      </div>
    </>
  );
}
