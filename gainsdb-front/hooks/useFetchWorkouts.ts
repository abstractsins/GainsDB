"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

  // Stable primitives
  const sessionToken = session?.user?.authToken ?? null;
  const token = useMemo(
    () => sessionToken ?? localStorage.getItem("token") ?? "",
    [sessionToken]
  );
  const sessionUserId = session?.user?.id ?? null;
  const userId = useMemo(
    () => sessionUserId ?? localStorage.getItem("userId") ?? "",
    [sessionUserId]
  );
  const isAuthed = status === "authenticated" && !!token;

  // Tiny cache: key by user+page+timeframe
  const cacheRef = useRef(new Map<string, WorkoutListContainer>());

  const doFetch = useCallback(
    async (uId: string, p: number, tf: string, t: string) => {
      const key = `${uId}|${p}|${tf}`;
      // Serve from cache if present
      const cached = cacheRef.current.get(key);
      if (cached) {
        setTotalWorkouts(cached.totalWorkouts);
        setWorkoutsObj(cached.workouts);
        setTotalPages(cached.totalPages);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const url = `${server}/api/user/${uId}/history?page=${p}&timeframe=${tf}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch exercises");
      }

      const data: WorkoutListContainer = await res.json();
      cacheRef.current.set(key, data);

      setTotalWorkouts(data.totalWorkouts);
      setWorkoutsObj(data.workouts);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [server] // ← only server can change; function stays stable across focus
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    if (!userId) {
      setError("No user ID found. Please log in.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await doFetch(userId, page, timeframe, token);
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message ?? "Failed to fetch exercises");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthed, status, userId, page, timeframe, token, doFetch]);

  return { workoutsObj, totalPages, totalWorkouts, loading, error };
};
