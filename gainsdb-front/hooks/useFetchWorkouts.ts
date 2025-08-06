import { useState, useEffect, useCallback } from "react";
import { WorkoutsObj, WorkoutListContainer } from "@/app/types/types";
import { useSession } from "next-auth/react";

export const useFetchWorkouts = (page: number, timeframe: string) => {
  const { data: session, status } = useSession();
  const [workoutsObj, setWorkoutsObj] = useState<WorkoutsObj>();
  const [totalPages, setTotalPages] = useState(1);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";

  const fetchWorkouts = useCallback(async () => {
    if (status === "loading") return;
    setLoading(true);
    setError(null);

    const userId = session?.user?.id || localStorage.getItem("userId");
    if (!userId) {
      setError("No user ID found. Please log in.");
      setLoading(false);
      return;
    }

    const token = session?.user?.authToken || localStorage.getItem("token");
    if (!token) {
      setError("No authentication session found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const url = `${server}/api/user/${userId}/history?page=${page}&timeframe=${timeframe}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch exercises");
      }

      const data: WorkoutListContainer = await response.json();
      setTotalWorkouts(data.totalWorkouts);
      setWorkoutsObj(data.workouts);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [status, session, server, page, timeframe]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.authToken) {
      fetchWorkouts();
    }
  }, [session, status, page, timeframe, fetchWorkouts]);

  return { workoutsObj, totalPages, totalWorkouts, loading, error };
};
