import Link from "next/link";
import styles from "./SideNav.module.css";
import { RouteSegment } from "@/constants/generalConstants";
import { MdDashboard } from "react-icons/md";
import {
  FaChartLine,
  FaClipboardList,
  FaCommentDots,
  FaRunning,
  FaWeight,
} from "react-icons/fa";
import { FaTimeline } from "react-icons/fa6";
import { IoSettingsSharp, IoSparklesSharp } from "react-icons/io5";

interface props {
  currentUserNavPath: RouteSegment;
}

export default function SideNav({ currentUserNavPath }: props) {
  // Cache reusable string

  const dashboardLinks = [
    {
      label: "Dashboard",
      route: RouteSegment.Dashboard,
      icon: <MdDashboard />,
    },
    {
      label: "Log Workout",
      route: RouteSegment.NewWorkout,
      icon: <FaClipboardList />,
    },
    {
      label: "Workout History",
      route: RouteSegment.History,
      icon: <FaTimeline />,
    },
    {
      label: "Exercises",
      route: RouteSegment.Exercises,
      icon: <FaRunning />,
    },
    {
      label: "Body Weight",
      route: RouteSegment.BodyWeight,
      icon: <FaWeight />,
    },
    {
      label: "Feedback",
      route: RouteSegment.Feedback,
      icon: <FaCommentDots />,
    },
    {
      label: "Coming Soon",
      route: RouteSegment.ComingSoon,
      icon: <IoSparklesSharp />,
    },
  ];

  return (
    <div className={styles.sideNavWrapper}>
      {dashboardLinks.map((link) => (
        <Link
          className={`${styles.dashboardLink} ${currentUserNavPath === link.route ? styles.currentUserNavPath : ""}`}
          href={`/${RouteSegment.User}/${link.route}`}
          key={link.label}
        >
          <div className={`${styles.dashboardLinkText}`}>
            {link.icon} {link.label}
          </div>
        </Link>
      ))}
    </div>
  );
}
