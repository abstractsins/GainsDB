"use client";

import NewWorkoutFormContainer from "@/app/components/NewWorkoutFormContainer";
import { useState, useEffect } from "react";

export default function NewWorkout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isXXLarge, setIsXXLarge] = useState(false);
  const [isRegular, setIsRegular] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      console.log('resizing')
      if (window.innerWidth > 1699) {
        setIsXXLarge(true);
        setIsMobile(false);
        setIsRegular(false);
      } else if (window.innerWidth >= 768) {
        setIsXXLarge(false);
        setIsMobile(false);
        setIsRegular(true)
      } else if (window.innerWidth < 768) {
        setIsXXLarge(false);
        setIsMobile(true);
        setIsRegular(false);
      }
    }

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
        isMobile={isMobile}
        isXXLarge={isXXLarge}
      />

    </div>
  );
}
