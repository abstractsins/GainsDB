"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Oswald } from "next/font/google";
import { Tourney } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import ClientLoader from "../components/ClientLoader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

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
  const [isChecking, setIsChecking] = useState(true);

  const pathname = usePathname();

  // console.log(pathname);

  useEffect(() => {
    // console.log("🔍 Debug - Session Status:", status);
    
    if (status === "authenticated" && !session) {
      router.push("/");
    }

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session?.user) {
      console.warn("🚨 Redirecting: No session found.");
      router.push("/");
    } else {
      setIsChecking(false);
    }

  }, [status, session, router]);

  if (status === "loading" || isChecking) {
    return <p>Checking authentication...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col space-y-4">
        <h2 className={`${tourney.className} text-[12pt] sm:text-[14pt] md:text-[18pt] lg:text-[22pt] xl:text-[28pt]`}>GainsDB</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard/new-workout" className="dashboard-link hover:bg-gray-700 p-2 rounded">💪 Log Workout</Link>
          <Link href="/dashboard/history" className="dashboard-link hover:bg-gray-700 p-2 rounded">📜 Workout History</Link>
          <Link href="/dashboard/exercises" className="dashboard-link hover:bg-gray-700 p-2 rounded">🏋️‍♂️ Exercises</Link>
          <Link href="/dashboard/charts" className="dashboard-link hover:bg-gray-700 p-2 rounded">📈 Charts</Link>
          <Link href="/dashboard/settings" className="dashboard-link hover:bg-gray-700 p-2 rounded">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* Main Content Area (Where Links Open) */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar></Navbar>
        <ClientLoader>
          <main className={`overflow-auto`}>{children}</main>
        </ClientLoader>
      </div>
    </div>
  );
}
