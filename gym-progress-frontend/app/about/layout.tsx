"use client";

import Link from "next/link";

import { useSession } from "next-auth/react";
import { Oswald, Tourney } from "next/font/google";

import ClientLoader from "../components/ClientLoader";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { MdDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";


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
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);


  // UNTIL SETTINGS IS RELEASED
  const settings = false;
  const charts = false;
  const comingSoon = true;

  const closeMenu = () => setIsMenuActive(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session?.user) {
      console.warn("🚨 unauthenticated.");
    } else {
    }
    setIsChecking(false);

  }, [status, session, router]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuActive(false);
      }
    }

    // Add event listener when menu is open
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

      {/* Main Content Area (Where Links Open) */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        {
          !isMobile &&
          <header id="about-page-header">
            <h1 className="page-header">About <span className={`app-name ${tourney.className}`}>GainsDB</span></h1>
            {
              session ? (
                <Link href="/dashboard" className="hover:text-blue-300 flex items-center">
                  <MdDashboard className="mr-2 text-xl" />
                  <h2 className={`${oswald.className} text-lg font-bold  text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt]`}>Dashboard</h2>
                </Link>
              ) : (
                <Link href="/" className="hover:text-blue-300 flex items-center">
                  <AiFillHome className="mr-2 text-xl" />
                  <h2 className={`${oswald.className} text-lg font-bold  text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt]`}>Login</h2>
                </Link>
              )
            }
          </header>
        }
        <ClientLoader>
          <main className={`overflow-auto`}>{children}</main>
        </ClientLoader>
      </div>
    </div>
  );
}
