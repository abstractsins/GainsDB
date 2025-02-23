import React, { useState, useEffect, ReactHTMLElement, ReactEventHandler } from "react";
import normalizeDate from "@/app/components/normalizeDate";

interface Exercise {
  name: string;
  category: string;
  last_logged_date: string;
}

interface Props {
  exercise: Exercise;
}

const toTitleCase = (text: string) => text.replace(/\b\w/g, (char) => char.toUpperCase());

const ExerciseCard: React.FC<Props> = ({ exercise }) => {
  const server = process.env.NEXT_PUBLIC_BACKEND;

  const handleClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    console.log(`${exercise.name} clicked`)
    console.log(e)
    const clickedLi = e.currentTarget; 
    console.log(clickedLi);
    if (clickedLi.classList.contains('active')) {
        clickedLi.classList.remove('active');
    } else {
        clickedLi.classList.add('active');
    }
  }

  return (
    <li
      className={`exercise-card ${exercise.category}`}
      onClick={handleClick}
    >
      <h2 className="exercise-list text-xl">{toTitleCase(exercise.name)}</h2>
      <span className="text-[12pt] font-thin">
        Last logged: {normalizeDate(exercise.last_logged_date, true)}
      </span>     
    </li>
  );
};

export default ExerciseCard;