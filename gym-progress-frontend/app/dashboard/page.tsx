"use client";

import React, { useState, useEffect } from "react";
import InfoCard from "../components/DashboardCard";
import { env } from "process";
import { useSession } from "next-auth/react";

import { IoRibbon } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { FaWeightHanging } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { BsExclamationTriangle } from "react-icons/bs";

import { toTitleCase } from "@/utils/utils";
import { DashboardData } from "../types/types";


export default function DashboardPage() {

  const [loading, setLoading] = useState(true);
  const [data2, setData2] = useState<DashboardData | null>();
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession(); // Ensure this is defined before use
  const userId = session?.user?.id || localStorage.getItem("userId");
  const server = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000';

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, session]);

  const fetchData = async () => {
    if (status === "loading") return;

    const token = session?.user?.authToken || localStorage.getItem("token");

    if (!token) {
      setError("No authentication session found. Please log in.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(`${server}/api/user/${userId}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) console.error("Failed to fetch workout data");
      const dashboardData: DashboardData = await response.json();
      console.log(dashboardData);
      setData2(dashboardData.totalWorkouts ? dashboardData : null);
    } catch (error) {
      console.error("Error fetching workout data:", error);
      setData2(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div id="dashboard-page">
      <div>
        <h1 className="page-header">Check out your stats!</h1>
      </div>
      <ul className="dashboard-list">
        <li className="dashboard-list">
          <InfoCard icon={<FaClipboardList />}
            title="Logged Workouts"
            value={data2?.totalWorkouts || "N/A"}
            description={`over ${data2?.totalWeeks || 0} weeks`}
            id="logged-workouts"
          />
        </li>

        <li className="dashboard-list">
          <InfoCard icon={<IoRibbon />}
            title="Most Logged"
            value={toTitleCase(data2?.mostLoggedExe[0]['exercise_name']) || "N/A"}
            description={`${data2?.mostLoggedExe[0]['log_count']} workouts`} />
        </li>

        <li className="dashboard-list">
          <InfoCard icon={<BsExclamationTriangle />}
            title="Least Logged"
            value={toTitleCase(data2?.mostLoggedExe[data2?.mostLoggedExe.length - 1]['exercise_name']) || "N/A"}
            description={`${data2?.mostLoggedExe[data2?.mostLoggedExe.length - 1]['log_count']} workout${data2?.mostLoggedExe[data2?.mostLoggedExe.length - 1]['log_count'] == '1' ? '' : 's'}`} />
        </li>

        <li className="dashboard-list">
          <InfoCard icon={<FaWeightHanging />}
            title="Most Weight"
            value={`${Number(data2?.theMostWeight[0]['max_weight'])} lbs`}
            description={toTitleCase(data2?.theMostWeight[0]['exercise_name']) || "N/A"} />
        </li>

        <li className="dashboard-list">
          <InfoCard icon={<BsGraphUpArrow />}
            title="Gained Most Volume"
            value={toTitleCase(data2?.mostVolumeChange[0]['exercise_name']) || "N/A"}
            description={toTitleCase(`${Number(data2?.mostVolumeChange[0]['min_volume'])} -> ${Number(data2?.mostVolumeChange[0]['max_volume'])}`) || "N/A"}
          />
        </li>
      </ul>
    </div>

  );
}
