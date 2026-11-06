"use client";

import { Tourney } from "next/font/google";

import styles from "./page.module.css";
import globalStyles from "@/styles/globalStyles.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import { useState } from "react";
import { WeightUnits } from "@/constants/weightsAndMeasures";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CompactScreenWidth } from "@/constants/generalConstants";

import LogWeight from "@/components/body-weight/LogWeight";
import RollingWeightChart from "@/components/body-weight/RollingWeight";
import CurrentWeight from "@/components/body-weight/CurrentWeight";

const tourney = Tourney({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function BodyWeight() {
  const isCompact = useMediaQuery(`(max-width: ${CompactScreenWidth}px)`);

  return (
    <div id="body-weight-page" className={globalStyles.functionPage}>
      <h1 className={globalStyles.pageHeader}>Body Weight</h1>

      <div className={styles.pageContent}>
        <div className={styles.currentWeightAndLoggingContainer}>
          <div
            className={`${styles.sectionContainer} ${styles.currentBodyWeightContainer}`}
          >
            <CurrentWeight />
          </div>

          {!isCompact ? (
            <div
              className={`${styles.sectionContainer} ${styles.weightLoggingSectionContainer}`}
            >
              <LogWeight />
            </div>
          ) : (
            <></>
          )}

          <div
            className={`${styles.sectionContainer} ${styles.rollingWeightChart}`}
          >
            <RollingWeightChart />
          </div>
        </div>

        {isCompact ? (
          <div
            className={`${styles.sectionContainer} ${styles.weightLoggingSectionContainer}`}
          >
            <LogWeight />
          </div>
        ) : (
          <></>
        )}

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
