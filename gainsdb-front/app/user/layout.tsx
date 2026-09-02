"use client";

// React
import { useEffect, useState, useRef } from "react";

// Next
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

// Components
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
import { FaUser } from "react-icons/fa";

// Styles
import styles from "./layout.module.css";
import { ErrorProvider } from "@/contexts/ErrorContext";
import SideNav from "@/components/nav/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { clearWaiter } = useWaiter();
  const { status, data: session } = useSession();

  const username = session?.user?.name;

  const [currentUserNavPath, setCurrentUserNavPath] = useState<RouteSegment>(
    RouteSegment.User,
  );
  const [isCheckingAuthentication, setIsCheckingAuthentication] =
    useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  const closeMenu = () => setIsMenuActive(false);

  // Remove waiter and add window event listener for resizing
  useEffect(() => {
    clearWaiter();
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
          <nav>
            <SideNav currentUserNavPath={currentUserNavPath} />
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="">
          <ErrorProvider>
            {/* Navbar */}
            {isMobile && (
              <MobileNavbar sidebar={{ isMenuActive, setIsMenuActive }} />
            )}
            <main className="overflow-auto">{children}</main>
          </ErrorProvider>
        </div>
      </div>
    </LoadedProvider>
  );
}
