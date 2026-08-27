import styles from "./PopupModal.module.css";
import { usePopup } from "@/contexts/PopupContext";

export default function PopupCloseButton({
  label = "close",
}: {
  label?: string;
}) {
  const { closePopup } = usePopup();

  return (
    <div>
      <div className={styles.popupCloseButton} onClick={closePopup}>
        {label}
      </div>
    </div>
  );
}
