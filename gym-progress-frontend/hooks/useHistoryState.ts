import { useState } from "react";
import { HRTime } from "@/utils/utils";

export const useHistoryState = () => {
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState("2w");
  const [HRTimeframe, setHRTimeframe] = useState<string>();
  const [activeCategoryWorkouts, setActiveCategoryWorkouts] = useState<string | null>(null);
  const [isCatFiltered, setIsCatFiltered] = useState(false);

  const onTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value);
    setHRTimeframe(HRTime(e.target.value));
    setPage(1);
    document.querySelectorAll(".exercises-legend-filter").forEach(el => el.classList.remove("active"));
    setActiveCategoryWorkouts(null);
    setIsCatFiltered(false);
  };

  return {
    page,
    setPage,
    timeframe,
    setTimeframe,
    HRTimeframe,
    activeCategoryWorkouts,
    setActiveCategoryWorkouts,
    isCatFiltered,
    setIsCatFiltered,
    onTimeChange
  };
};
