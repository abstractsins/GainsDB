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

// Utils
import { toTitleCase } from "@/utils/utils";

// Types
import { DashboardData } from "@/types/types";

// Conexts
import { useAuthContext } from "@/contexts/AuthContext";
import { useLoaded } from "@/contexts/LoadedContext";

// Components
import InfoCard from "@/components/dashboard/DashboardCard";

// Styles
import styles from "./page.module.css";
import DashboardCardLoader from "@/components/dashboard/DashboardCardLoader";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [pageLevelError, setPageLevelError] = useState<string>();

  const { data: session, status } = useSession();
  const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";

  const [leastLogged, setLeastLogged] = useState<number>(0);
  const [mostLogged, setMostLogged] = useState<number>(0);
  const [totalWeeks, setTotalWeeks] = useState<number>(0);

  const { setPageLoaded } = useLoaded();
  const { setUserLoggedIn } = useAuthContext();
  const router = useRouter();

  const mostWeightCalculation = () => {
    return false;
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.authToken) {
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

        setDashboardData((prev) => (data.totalWorkouts ? data : prev));
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setPageLevelError("Failed to load dashboard data.");
      } finally {
        setPageLoaded(true);
      }
    }
  }, [
    status,
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

  const loggedAuthStatus = useRef(false);
  const loggedDashboardData = useRef(false);
  useEffect(() => {
    if (!loggedAuthStatus.current && status) {
      console.log("🔄 Session Status:", status);
      loggedAuthStatus.current = true;
    }
    if (!loggedDashboardData.current && dashboardData) {
      console.group("📈 Dashboard Data: ");
      console.dir(dashboardData);
      console.groupEnd();
      loggedDashboardData.current = true;
    }
  }, [status, dashboardData]);

  return pageLevelError ? (
    <div className={styles.pageLevelError}>
      <p className={styles.pageLevelErrorText}>{pageLevelError}</p>
    </div>
  ) : (
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
            <li className="dashboard-list">
              <InfoCard
                icon={<FaClipboardList />}
                title="Logged Workouts"
                value={dashboardData?.totalWorkouts || <DashboardCardLoader />}
                description={`over ${totalWeeks || 0} week${totalWeeks === 1 ? "" : "s"}`}
                id="logged-workouts"
              />
            </li>

            <li className="dashboard-list">
              <InfoCard
                icon={<IoRibbon />}
                title="Most Logged"
                value={
                  toTitleCase(
                    dashboardData?.mostLoggedExe?.[0]?.exercise_name,
                  ) || <DashboardCardLoader />
                }
                description={`${mostLogged || 0} workout${mostLogged === 1 ? "" : "s"}`}
                id="most-logged"
              />
            </li>

            <li className="dashboard-list">
              <InfoCard
                icon={<BsExclamationTriangle />}
                title="Least Logged"
                value={
                  toTitleCase(
                    dashboardData?.mostLoggedExe?.slice(-1)[0]?.exercise_name,
                  ) || <DashboardCardLoader />
                }
                description={`${leastLogged || 0} workout${leastLogged === 1 ? "" : "s"}`}
                id="least-logged"
              />
            </li>

            <li className="dashboard-list">
              <InfoCard
                icon={<FaWeightHanging />}
                title="Most Weight"
                //!
                value={mostWeightCalculation() || <DashboardCardLoader />}
                description={toTitleCase(
                  dashboardData?.theMostWeight?.[0]?.exercise_name,
                )}
                id="most-weight"
              />
            </li>

            <li className="dashboard-list">
              <InfoCard
                icon={<BsGraphUpArrow />}
                title="Gained Most Volume"
                value={
                  toTitleCase(
                    dashboardData?.mostVolumeChange?.[0]?.exercise_name,
                  ) || <DashboardCardLoader />
                }
                description={toTitleCase(
                  `${dashboardData?.mostVolumeChange?.[0]?.min_volume || 0} -> ${
                    dashboardData?.mostVolumeChange?.[0]?.max_volume || 0
                  }`,
                )}
                id="gained-most-volume"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
