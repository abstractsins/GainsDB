import InfoCard from "../components/DashboardCard";

import { IoRibbon } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { FaWeightHanging } from "react-icons/fa";


export default function DashboardPage() {
  return (
    <>
      <div>
        <h1 className="page-header">Check out your stats!</h1>
      </div>
      <ul className="dashboard-list">
        <li className="dashboard-list">
          <InfoCard icon={<FaClipboardList />} title="Logged Workouts" value="325" description="since 3/1/21"/>
        </li>
        <li className="dashboard-list">
          <InfoCard icon={<IoRibbon />} title="Most Logged" value="Diverging Seated Row" description="in 60 workouts"/>
        </li>
        <li className="dashboard-list">
          <InfoCard icon={<FaWeightHanging/>} title="Most Weight" value="Angled Leg Press (Unloaded 136lbs)" description="230 lbs!"/>
        </li>
      </ul>
    </>

  );
}
