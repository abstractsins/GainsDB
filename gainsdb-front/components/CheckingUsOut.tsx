import { useState } from "react";
import { RiCloseFill } from "react-icons/ri";

import styles from "./CheckingUsOut.module.css";

export default function CheckingUsOut() {
  const [showPopup, setShowPopup] = useState(true);

  const closePopup = () => setShowPopup(false);

  return (
    <>
      {showPopup && (
        <div className={`${styles.popup} ${styles.demoCreds}`}>
          <div className={styles.demoCredsBody}>
            <header>
              <span>Checking us out?</span>
            </header>
            <div className="creds">
              <span className={styles.label}>user:</span> <span>demo</span>
              <br></br>
              <span className={styles.label}>pass:</span>{" "}
              <span>DanBerlin!</span>
            </div>
          </div>
          <div className={styles.closeButton} onClick={closePopup}>
            <RiCloseFill />
          </div>
        </div>
      )}
    </>
  );
}
