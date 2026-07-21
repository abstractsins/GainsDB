import { useState } from "react";
import { RiCloseFill } from "react-icons/ri";

import styles from "./CheckingUsOut.module.css";

export default function CheckingUsOut() {
  const [showPopup, setShowPopup] = useState(true);

  const closePopup = () => setShowPopup(false);

  return (
    <>
      {showPopup && (
        <div className={`${styles.popup}`} id="demo-creds">
          <div className="demo-creds-body">
            <header>
              <span>Checking us out?</span>
            </header>
            <div className="creds">
              <span className="label">user:</span> <span>demo</span>
              <br></br>
              <span className="label">pass:</span> <span>DanBerlin!</span>
            </div>
          </div>
          <div className="close-button" onClick={closePopup}>
            <RiCloseFill />
          </div>
        </div>
      )}
    </>
  );
}
