"use client";

// React
import { useEffect, useState, useRef } from "react";

// Next
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

// Components
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";

// Constants
import {
  AuthenticationStatus,
  mobileMaxWidth,
  RouteSegment,
} from "@/constants/generalConstants";

// Contexts
import { useWaiter } from "@/contexts/WaiterContext";
import { LoadedProvider } from "@/contexts/LoadedContext";

// Icons
import {
  FaRunning,
  FaUser,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";
import { FaTimeline } from "react-icons/fa6";
import { IoSparklesSharp, IoSettingsSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

// Styles
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setWaiter } = useWaiter();
  const { status, data: session } = useSession();

  const username = session?.user?.name;

  const [currentUserNavPath, setCurrentUserNavPath] = useState<RouteSegment>(
    RouteSegment.User,
  );
  const [isCheckingAuthentication, setIsCheckingAuthentication] =
    useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  // Cache reusable string
  const user = RouteSegment.User;

  // Easily turn off or on extended nav options for now
  // UNTIL SETTINGS IS RELEASED, hard code to false
  const settings = false;
  const charts = false;
  const comingSoon = true;
  const profile = false;

  const closeMenu = () => setIsMenuActive(false);

  // Remove waiter and add window event listener for resizing
  useEffect(() => {
    setWaiter(false);
    setIsMobile(window.innerWidth <= mobileMaxWidth);
    const handleResize = () => setIsMobile(window.innerWidth <= mobileMaxWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Authentication check and routing fallback
  useEffect(() => {
    if (status === AuthenticationStatus.Loading) return;
    if (status === AuthenticationStatus.Unauthenticated) {
      console.warn("🚨 Redirecting: No session found.");
      router.push("/");
    } else {
      setIsCheckingAuthentication(false);
    }
  }, [status, router]);

  // Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuActive(false);
      }
    };

    if (isMenuActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuActive]);

  // Stylize the sidenav link if it is the current path
  useEffect(() => {
    const pathArr = pathname.split("/").filter((el) => el);

    if (pathArr[0] === RouteSegment.User) {
      if (Object.values(RouteSegment).includes(pathArr[1] as RouteSegment)) {
        setCurrentUserNavPath(pathArr[1] as RouteSegment);
      } else {
        throw new Error(
          "CUSTOM ERROR: The destructured path does not exist as a known user-based RouteSegment: " +
            pathArr[1],
        );
      }
    } else {
      throw new Error(
        "CUSTOM ERROR: This route was somehow accessed outside of the /user path: " +
          pathname,
      );
    }
  }, [pathname]);

  return status === AuthenticationStatus.Loading || isCheckingAuthentication ? (
    <p>Checking authentication...</p>
  ) : (
    <LoadedProvider>
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside
          ref={menuRef}
          onBlur={closeMenu}
          className={`${isMobile ? styles.mobile : styles.fullView} ${isMenuActive ? styles.active : ""}`}
        >
          <div className={styles.profileNook}>
            <FaUser className={styles.userIcon} />
            <span>Hi, {username}!</span>
          </div>

          <h2 className={styles.asideHeader}>GainsDB</h2>
          <nav className={styles.nav}>
            <div
              className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.Dashboard ? styles.currentUserNavPath : ""}`}
            >
              <Link
                className={styles.dashboardLinkText}
                href={`/${user}/${RouteSegment.Dashboard}`}
              >
                <MdDashboard /> Dashboard
              </Link>
            </div>

            <div
              className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.NewWorkout ? styles.currentUserNavPath : ""}`}
            >
              <Link
                className={styles.dashboardLinkText}
                href={`/${user}/${RouteSegment.NewWorkout}`}
              >
                <FaClipboardList /> Log Workout
              </Link>
            </div>

            <div
              className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.History ? styles.currentUserNavPath : ""}`}
            >
              <Link
                href={`/${user}/${RouteSegment.History}`}
                className={styles.dashboardLinkText}
              >
                <FaTimeline /> Workout History
              </Link>
            </div>

            <div
              className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.Exercises ? styles.currentUserNavPath : ""}`}
            >
              <Link
                href={`/${user}/${RouteSegment.Exercises}`}
                className={styles.dashboardLinkText}
              >
                <FaRunning /> Exercises
              </Link>
            </div>

            {charts && (
              <div
                className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.Charts ? styles.currentUserNavPath : ""}`}
              >
                <Link
                  href={`/${user}/${RouteSegment.Charts}}`}
                  className={styles.dashboardLinkText}
                >
                  <FaChartLine /> Charts
                </Link>
              </div>
            )}
            {settings && (
              <div
                className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.Settings ? styles.currentUserNavPath : ""}`}
              >
                <Link
                  href={`/${user}/${RouteSegment.Settings}`}
                  className={styles.dashboardLinkText}
                >
                  <IoSettingsSharp /> Settings
                </Link>
              </div>
            )}
            {comingSoon && (
              <div
                className={`${styles.dashboardLink} ${currentUserNavPath === RouteSegment.ComingSoon ? styles.currentUserNavPath : ""}`}
              >
                <Link
                  href={`/${user}/${RouteSegment.ComingSoon}`}
                  className={styles.dashboardLinkText}
                >
                  <IoSparklesSharp /> Coming Soon
                </Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          {isMobile && (
            <MobileNavbar sidebar={{ isMenuActive, setIsMenuActive }} />
          )}
          <main className="overflow-auto">{children}</main>
        </div>
      </div>
    </LoadedProvider>
  );
}
