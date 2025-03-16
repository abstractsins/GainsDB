"use client";

import React, { useState, useEffect } from "react";
import InfoCard from "../components/DashboardCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { IoRibbon } from "react-icons/io5";
import { FaClipboardList, FaWeightHanging } from "react-icons/fa";
import { BsGraphUpArrow, BsExclamationTriangle } from "react-icons/bs";

import { toTitleCase } from "@/utils/utils";
import { DashboardData } from "../types/types";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";

  useEffect(() => {
    console.log("🔄 Session Status:", status);
    console.log("👤 Session Data:", session);

    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.authToken) {
      console.warn("🚨 No valid session found, redirecting...");
      if (typeof window !== "undefined") {
        router.replace("/");
      }
      return;
    }

    fetchData();
  }, [status, session?.user?.authToken]);

  const fetchData = async () => {
    const token = session?.user?.authToken;
    const userId = session?.user?.id;

    if (!token || !userId) return;

    console.log("🛠 Sending Authorization Header:", `Bearer ${token}`);

    try {
      const response = await fetch(`${server}/api/user/${userId}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workout data");
      }

      const data: DashboardData = await response.json();
      console.log("📊 Received Data:", data);
      setDashboardData(data.totalWorkouts ? data : null);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="dashboard-page">
      <div className="dashboard-body">
        <ul className="dashboard-list">
          <li className="dashboard-list">
            <InfoCard
              icon={<FaClipboardList />}
              title="Logged Workouts"
              value={dashboardData?.totalWorkouts || "N/A"}
              description={`over ${dashboardData?.totalWeeks || 0} weeks`}
              id="logged-workouts"
            />
          </li>

          <li className="dashboard-list">
            <InfoCard
              icon={<IoRibbon />}
              title="Most Logged"
              value={toTitleCase(dashboardData?.mostLoggedExe?.[0]?.exercise_name) || "N/A"}
              description={`${dashboardData?.mostLoggedExe?.[0]?.log_count || 0} workouts`}
              id="most-logged"
            />
          </li>

          <li className="dashboard-list">
            <InfoCard
              icon={<BsExclamationTriangle />}
              title="Least Logged"
              value={toTitleCase(dashboardData?.mostLoggedExe?.slice(-1)[0]?.exercise_name) || "N/A"}
              description={`${dashboardData?.mostLoggedExe?.slice(-1)[0]?.log_count || 0} workouts`}
              id="least-logged"
            />
          </li>

          <li className="dashboard-list">
            <InfoCard
              icon={<FaWeightHanging />}
              title="Most Weight"
              value={`${Number(dashboardData?.theMostWeight?.[0]?.max_weight).toFixed() || 0} lbs`}
              description={toTitleCase(dashboardData?.theMostWeight?.[0]?.exercise_name) || "N/A"}
              id="most-weight"
            />
          </li>

          <li className="dashboard-list">
            <InfoCard
              icon={<BsGraphUpArrow />}
              title="Gained Most Volume"
              value={toTitleCase(dashboardData?.mostVolumeChange?.[0]?.exercise_name) || "N/A"}
              description={toTitleCase(
                `${dashboardData?.mostVolumeChange?.[0]?.min_volume || 0} -> ${dashboardData?.mostVolumeChange?.[0]?.max_volume || 0
                }`
              )}
              id="gained-most-volume"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
