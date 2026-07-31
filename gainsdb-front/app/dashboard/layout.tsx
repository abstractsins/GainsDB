"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Oswald, Tourney } from "next/font/google";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useWaiter } from "@/contexts/WaiterContext";
import { LoadedProvider } from "@/contexts/LoadedContext";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // UNTIL SETTINGS IS RELEASED
  const settings = false;
  const charts = false;
  const comingSoon = true;

  const closeMenu = () => setIsMenuActive(false);

  const { setWaiter } = useWaiter();

  useEffect(() => {
    setWaiter(false);
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      console.warn("🚨 Redirecting: No session found.");
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [status, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuActive(false);
      }
    }

    if (isMenuActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuActive]);

  useEffect(() => {
    setIsMenuActive(false);
  }, [pathname]);

  if (status === "loading" || isChecking) {
    return <p>Checking authentication...</p>;
  }

  return (
    <LoadedProvider>
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside
          ref={menuRef}
          onBlur={closeMenu}
          className={`${isMobile ? styles.mobile : ""} ${isMenuActive ? styles.active : ""}`}
        >
          <h2
            className={`${tourney.className} text-[12pt] sm:text-[18pt] md:text-[22pt] lg:text-[28pt] xl:text-[28pt]`}
          >
            GainsDB
          </h2>
          <nav className={styles.nav}>
            <Link
              href="/dashboard/new-workout"
              className={styles.dashboardLink}
            >
              💪 Log Workout
            </Link>
            <Link href="/dashboard/history" className={styles.dashboardLink}>
              📜 Workout History
            </Link>
            <Link href="/dashboard/exercises" className={styles.dashboardLink}>
              🏋️‍♂️ Exercises
            </Link>
            {charts && (
              <Link href="/dashboard/charts" className={styles.dashboardLink}>
                📈 Charts
              </Link>
            )}
            {settings && (
              <Link href="/dashboard/settings" className={styles.dashboardLink}>
                ⚙️ Settings
              </Link>
            )}
            {comingSoon && (
              <Link
                href="/dashboard/coming-soon"
                className={styles.dashboardLink}
              >
                ✨ Coming Soon...
              </Link>
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
