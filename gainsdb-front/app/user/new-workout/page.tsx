"use client";

import { useState, useEffect } from "react";
import NewWorkoutFormContainer from "@/components/NewWorkoutFormContainer";
import {
  XXLargeScreenWidth,
  MobileScreenWidth,
  ScreenSize,
} from "@/constants/generalConstants";

export default function NewWorkout() {
  const [screenSize, setScreenSize] = useState<ScreenSize>();

  // Reactive sizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= XXLargeScreenWidth) {
        setScreenSize(ScreenSize.XXLarge);
      } else if (window.innerWidth >= MobileScreenWidth) {
        setScreenSize(ScreenSize.Regular);
      } else if (window.innerWidth < MobileScreenWidth) {
        setScreenSize(ScreenSize.Mobile);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  return (
    <div id="new-workout-page">
      <h1 className="page-header">Record a Set!</h1>
      <NewWorkoutFormContainer
        visible={true}
        onClose={null}
        exerciseName={null}
        screenSize={screenSize}
      />
    </div>
  );
}
