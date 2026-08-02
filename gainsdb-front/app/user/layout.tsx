"use client";

// React
import { useEffect, useState, useRef } from "react";

// Next
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Oswald, Tourney } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";

// Components
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";

// Constants
import {
  AuthenticationStatus,
  mobileMaxWidth,
} from "@/constants/generalConstants";

// Contexts
import { useWaiter } from "@/contexts/WaiterContext";
import { LoadedProvider } from "@/contexts/LoadedContext";

// Styles
import styles from "./layout.module.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const tourney = Tourney({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
  display: "swap",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { status } = useSession();
  const { setWaiter } = useWaiter();

  const [isCheckingAuthentication, setIsCheckingAuthentication] =
    useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  // UNTIL SETTINGS IS RELEASED, hard code to false
  const settings = false;
  const charts = false;
  const comingSoon = true;

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

  if (status === AuthenticationStatus.Loading || isCheckingAuthentication) {
    return <p>Checking authentication...</p>;
  }

  return (
    <LoadedProvider>
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside
          ref={menuRef}
          onBlur={closeMenu}
          className={`${isMobile ? styles.mobile : styles.fullView} ${isMenuActive ? styles.active : ""}`}
        >
          <h2 className={`${tourney.className}`}>GainsDB</h2>
          <nav className={styles.nav}>
            <div className={styles.dashboardLink}>
              <Link href="/user/new-workout">💪 Log Workout</Link>
            </div>

            <div className={styles.dashboardLink}>
              <Link href="/user/history">📜 Workout History</Link>
            </div>

            <div className={styles.dashboardLink}>
              <Link href="/user/exercises">🏋️‍♂️ Exercises</Link>
            </div>

            {charts && (
              <div className={styles.dashboardLink}>
                <Link href="/user/charts">📈 Charts</Link>
              </div>
            )}
            {settings && (
              <div className={styles.dashboardLink}>
                <Link href="/user/settings">⚙️ Settings</Link>
              </div>
            )}
            {comingSoon && (
              <div className={styles.dashboardLink}>
                <Link href="/user/coming-soon">✨ Coming Soon...</Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          {isMobile ? (
            <MobileNavbar sidebar={{ isMenuActive, setIsMenuActive }} />
          ) : (
            <Navbar />
          )}
          <main className="overflow-auto">{children}</main>
        </div>
      </div>
    </LoadedProvider>
  );
}
