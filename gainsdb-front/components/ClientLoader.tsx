"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import styles from "./ClientLoader.module.css";

export default function ClientLoader({}: {}) {
  // const musclesRef = useRef<any[]>(undefined);
  const muscles = ["💪", "💪🏻", "💪🏼", "💪🏽", "💪🏾", "💪🏿"];

  const shuffleEls = useCallback((els: any[]) => {
    if (!els.length || els.length === 0) return [];
    let numUnchosen = els.length;
    const sortedArray = [];
    const mutatedEls = els.slice();

    for (let i = numUnchosen; i--; i === 0) {
      const numAvailableEls = i + 1;
      const randomNumber = Math.floor(Math.random() * numAvailableEls);
      sortedArray.push(mutatedEls[randomNumber]);
      mutatedEls.splice(randomNumber, 1);
    }

    return sortedArray;
  }, []);

  const shuffledMuscles = shuffleEls(muscles);
  const [randomizedMuscles, setRandomizedMuscles] = useState(shuffledMuscles);
  const [randomMusclesLoading, setRandomMusclesLoading] = useState<string[]>(
    [],
  );

  const accumulator = (prev: string[]) =>
    !prev
      ? [randomizedMuscles[0]]
      : [...prev, randomizedMuscles[randomMusclesLoading.length]];

  useEffect(() => {
    const clearAndResetLoading = () => {
      setRandomizedMuscles(shuffleEls(muscles));
      setRandomMusclesLoading([]);
    };

    const timeout = setTimeout(() => {
      randomMusclesLoading.length === randomizedMuscles.length
        ? clearAndResetLoading()
        : setRandomMusclesLoading(accumulator);
    }, 200);

    return () => clearTimeout(timeout);
  }, [randomMusclesLoading, randomizedMuscles, shuffleEls]);

  return (
    <div className={styles.clientLoaderContainer}>
      <span className={styles.clientLoaderTitle}>loading user data</span>
      <div className={styles.clientLoaderMusclesWrapper}>
        <span className={styles.muscles}>{randomMusclesLoading}</span>
      </div>
    </div>
  );
}
