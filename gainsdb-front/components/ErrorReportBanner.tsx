"use client";

import styles from "./ErrorReportBanner.module.css";

// Currently the banner is just a custom message.
// If the need arises for more complex templating, start here.
export default function ErrorReportBanner({
  messageText,
}: {
  messageText: string | null;
}) {
  return messageText ? (
    <>
      <div className={styles.waiterShield}></div>
      <div className={styles.errorBanner}>
        <div className={styles.messageTextWrapper}>
          <span className={styles.messageText}>{messageText}</span>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
