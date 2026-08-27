import { ReactNode } from "react";
import styles from "./PopupModal.module.css";

export interface PopupModalPackage {
  title: string;
  message: string;
  buttons: ReactNode[];
}

export interface PopupModalProps {
  props: PopupModalPackage;
}

export default function PopupModal({ props }: PopupModalProps) {
  const { title, message, buttons } = props;
  return (
    <>
      <div className={styles.popupShield}></div>
      <div className={styles.popupModalWrapper}>
        <div className={styles.popupModalBox}>
          <div className={styles.popupHeaderWrapper}>
            <span className={styles.popupHeaderText}>{title}</span>
          </div>
          <div className={styles.popupBody}>
            <div>{message}</div>
          </div>
          <div className={styles.popupButtonsWrapper}>{buttons}</div>
        </div>
      </div>
    </>
  );
}
