"use client";

import SuggestionModule from "@/components/coming-soon/SuggestionModule";

import globalStyles from "@/styles/globalStyles.module.css";

export default function Feedback() {
  return (
    <div className={globalStyles.functionPage}>
      <div className="header-container">
        <h1 className="page-header">Leave some Feedback!</h1>
      </div>
      <SuggestionModule />
    </div>
  );
}
