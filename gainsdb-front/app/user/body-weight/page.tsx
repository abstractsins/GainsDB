"use client";

import { Tourney } from "next/font/google";
import styles from "./page.module.css";
import globalStyles from "@/styles/globalStyles.module.css";
import { useState } from "react";
import { WeightUnits } from "@/constants/weightsAndMeasures";

const tourney = Tourney({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function BodyWeight() {
  const [currentBodyWeight, setCurrentBodyWeight] = useState(249.8);
  const [bodyWeightUnits, setBodyWeightUnits] = useState(WeightUnits.lbs);

  const logWeightFormSubmitHandler = (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <div id="body-weight-page" className={globalStyles.functionPage}>
      <h1 className={globalStyles.pageHeader}>Body Weight</h1>

      <div className={styles.pageContent}>
        <div className={styles.currentWeightAndLoggingContainer}>
          <div
            className={`${styles.sectionContainer} ${styles.currentBodyWeightContainer}`}
          >
            <h2 className={styles.sectionHeader}>Current Body Weight</h2>

            <div className={styles.currentBodyWeightWrapper}>
              <span className={styles.currentBodyWeightValue}>
                {currentBodyWeight} {bodyWeightUnits}
              </span>
            </div>
          </div>

          <div
            className={`${styles.sectionContainer} ${styles.weightLoggingSectionContainer}`}
          >
            <h2 className={styles.sectionHeader}>Log Weight</h2>

            <div className={styles.weightLoggingWrapper}>
              <form onSubmit={logWeightFormSubmitHandler}>
                {/* date select, field, button */}
                <input type="date" />
                <input type="text" />
                <input type="submit" value="log weight" />
              </form>
            </div>
          </div>
        </div>

        <div className={styles.chartArea}>
          <div
            className={`${styles.sectionContainer} ${styles.chartContainer}`}
          >
            <h2 className={styles.sectionHeader}>Body Weight Chart</h2>
          </div>
        </div>
      </div>
    </div>

    // show current weight

    // add weight logging
  );
}
