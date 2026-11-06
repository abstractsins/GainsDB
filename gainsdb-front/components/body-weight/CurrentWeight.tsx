import { useState } from "react";
import { WeightUnits } from "@/constants/weightsAndMeasures";
import styles from "./CurrentWeight.module.css";

export default function CurrentWeight() {
  const [currentBodyWeight, setCurrentBodyWeight] = useState(249.8);
  const [bodyWeightUnits, setBodyWeightUnits] = useState(WeightUnits.lbs);

  return (
    <>
      <h2 className={styles.sectionHeader}>Current Body Weight</h2>

      <div className={styles.currentBodyWeightWrapper}>
        <span className={styles.currentBodyWeightValue}>
          {currentBodyWeight} {bodyWeightUnits}
        </span>
      </div>
    </>
  );
}
