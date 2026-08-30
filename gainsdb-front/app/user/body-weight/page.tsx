import { Tourney } from "next/font/google";
import styles from "./page.module.css";

const tourney = Tourney({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function BodyWeight() {
  return (
    <div id="body-weight-page">
      <h1 className="page-header">Body Weight</h1>
    </div>

    // add weight logging
  );
}
