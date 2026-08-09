"use client";

// React / Next
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Icons
import { IoRibbon } from "react-icons/io5";
import { FaClipboardList, FaWeightHanging } from "react-icons/fa";
import { BsGraphUpArrow, BsExclamationTriangle } from "react-icons/bs";

// Types
import { DashboardData } from "@/types/types";

// Constants
import { Environments } from "@/constants/generalConstants";

// Conexts
import { useAuthContext } from "@/contexts/AuthContext";
import { useLoaded } from "@/contexts/LoadedContext";
import { useErrorReporter } from "@/contexts/ErrorContext";

// Components
import InfoCard from "@/components/dashboard/DashboardCard";

// Styles
import styles from "./page.module.css";
import { FetchMethods, ResponseLikeObject } from "@/constants/fetchConstants";

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const { setPageLoaded } = useLoaded();
  const { setUserLoggedIn } = useAuthContext();
  const router = useRouter();
  const { handleResponseError } = useErrorReporter();

  // For Logging
  const loggedAuthStatus = useRef(false);
  const loggedDashboardData = useRef(false);

  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [leastLogged, setLeastLogged] = useState<number>(0);
  const [mostLogged, setMostLogged] = useState<number>(0);
  const [totalWeeks, setTotalWeeks] = useState<number>(0);

  const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";

  const mostWeightStringification = (): string | false => {
    const weight = dashboardData?.theMostWeight?.[0]?.max_weight;
    return weight ? Number(weight) + " lbs" : false;
  };

  const gainedMostVolumeDesc = (): string => {
    const from = Number(dashboardData?.mostVolumeChange?.[0]?.min_volume) || 0;
    const to = Number(dashboardData?.mostVolumeChange?.[0]?.max_volume) || 0;
    const div = "->";
    return to > 0 ? `${from} ${div} ${to}` : "";
  };

  // Check authentication status and load fetch data
  useEffect(() => {
    if (authStatus === "loading") return;

    if (authStatus === "unauthenticated" || !session?.user?.authToken) {
      console.warn("🚨 No valid session found, redirecting to login...");
      if (typeof window !== "undefined") router.replace("/");
      return;
    } else {
      setUserLoggedIn();
    }

    fetchData();

    async function fetchData() {
      const token = session?.user?.authToken;
      const userId = session?.user?.id;

      if (!token || !userId) return;

      const response = await fetch(`${server}/api/user/${userId}/dashboard`, {
        method: FetchMethods.GET,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        handleResponseError(response as ResponseLikeObject);
        return;
      }

      const data: DashboardData = await response.json();

      setDashboardData((prev) => (data.totalWorkouts ? data : prev));
    }
  }, [
    authStatus,
    router,
    server,
    session?.user?.id,
    session?.user?.authToken,
    setUserLoggedIn,
    setPageLoaded,
  ]);

  useEffect(() => {
    if (dashboardData && dashboardData.mostLoggedExe) {
      const numLeastLogs: number =
        parseInt(dashboardData?.mostLoggedExe?.slice(-1)[0]?.log_count) || 0;
      const numMostLogs: number =
        parseInt(dashboardData?.mostLoggedExe?.[0].log_count) || 0;
      setLeastLogged(numLeastLogs);
      setMostLogged(numMostLogs);
    }

    if (dashboardData && dashboardData.totalWeeks) {
      setTotalWeeks(dashboardData?.totalWeeks);
    }
  }, [dashboardData]);

  // For logging
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== Environments.Prod) {
      if (!loggedAuthStatus.current && authStatus) {
        console.log("🔄 Session Status:", authStatus);
        loggedAuthStatus.current = true;
      }
      if (!loggedDashboardData.current && dashboardData) {
        console.group("📈 Dashboard Data: ");
        console.dir(dashboardData);
        console.groupEnd();
        loggedDashboardData.current = true;
      }
    }
  }, [authStatus, dashboardData]);

  return (
    <>
      {/* Background container */}
      <div className={styles.background}>
        <Image
          src="/bg5.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          quality={70}
          className={styles.backgroundImage}
        />
      </div>

      <div id="dashboard-page">
        <div className="dashboard-body">
          <ul className="dashboard-list">
            {/* TOTAL WORKOUTS */}
            <li className="dashboard-list">
              <InfoCard
                icon={<FaClipboardList />}
                title="Logged Workouts"
                value={dashboardData?.totalWorkouts}
                description={
                  dashboardData &&
                  `over ${totalWeeks || 0} week${totalWeeks === 1 ? "" : "s"}`
                }
                id="logged-workouts"
              />
            </li>

            {/* MOST LOGGED EXERCISE */}
            <li className="dashboard-list">
              <InfoCard
                icon={<IoRibbon />}
                title="Most Logged"
                value={dashboardData?.mostLoggedExe?.[0]?.exercise_name}
                description={
                  dashboardData &&
                  `${mostLogged || 0} workout${mostLogged === 1 ? "" : "s"}`
                }
                id="most-logged"
              />
            </li>

            {/* LEAST LOGGED EXERCISE */}
            <li className="dashboard-list">
              <InfoCard
                icon={<BsExclamationTriangle />}
                title="Least Logged"
                value={
                  dashboardData?.mostLoggedExe?.slice(-1)[0]?.exercise_name
                }
                description={
                  dashboardData &&
                  `${leastLogged || 0} workout${leastLogged === 1 ? "" : "s"}`
                }
                id="least-logged"
              />
            </li>

            {/* MOST WEIGHT */}
            <li className="dashboard-list">
              <InfoCard
                icon={<FaWeightHanging />}
                title="Most Weight"
                value={mostWeightStringification()}
                description={
                  dashboardData &&
                  dashboardData?.theMostWeight?.[0]?.exercise_name
                }
                id="most-weight"
              />
            </li>

            {/* GAINED MOST VOLUME */}
            <li className="dashboard-list">
              <InfoCard
                icon={<BsGraphUpArrow />}
                title="Gained Most Volume"
                value={dashboardData?.mostVolumeChange?.[0]?.exercise_name}
                description={dashboardData && gainedMostVolumeDesc()}
                id="gained-most-volume"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
