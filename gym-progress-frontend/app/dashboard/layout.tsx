"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Oswald, Tourney } from "next/font/google";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import ClientLoader from "../../components/ClientLoader";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap"
});

const tourney = Tourney({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
  display: "swap"
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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

  useEffect(() => {
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside ref={menuRef} onBlur={closeMenu} className={`${isMobile ? "mobile" : ""} ${isMenuActive ? "active" : ""} w-64 bg-gray-900 text-white p-5 flex flex-col space-y-4`}>
        <h2 className={`${tourney.className} text-[12pt] sm:text-[18pt] md:text-[22pt] lg:text-[28pt] xl:text-[28pt]`}>GainsDB</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard/new-workout" className="dashboard-link hover:bg-gray-700 p-2 rounded">💪 Log Workout</Link>
          <Link href="/dashboard/history" className="dashboard-link hover:bg-gray-700 p-2 rounded">📜 Workout History</Link>
          <Link href="/dashboard/exercises" className="dashboard-link hover:bg-gray-700 p-2 rounded">🏋️‍♂️ Exercises</Link>
          {charts && <Link href="/dashboard/charts" className="dashboard-link hover:bg-gray-700 p-2 rounded">📈 Charts</Link>}
          {settings && <Link href="/dashboard/settings" className="dashboard-link hover:bg-gray-700 p-2 rounded">⚙️ Settings</Link>}
          {comingSoon && <Link href="/dashboard/coming-soon" className="dashboard-link hover:bg-gray-700 p-2 rounded">✨ Coming Soon...</Link>}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {isMobile ? <MobileNavbar sidebar={{ isMenuActive, setIsMenuActive }} /> : <Navbar />}
        <ClientLoader>
          <main className="overflow-auto">{children}</main>
        </ClientLoader>
      </div>
    </div>
  );
}
