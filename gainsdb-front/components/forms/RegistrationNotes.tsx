import styles from "@/components/LoginRegister.module.css";

export default function RegistrationNotes() {
  return (
    <div className={styles.registrationNotesWrapper}>
      <ul className={styles.registrationNotesList}>
        <li className={styles.registrationNoteItem}>
          We store only the data you enter.
        </li>
        <li className={styles.registrationNoteItem}>
          No email or personal info required.
        </li>
      </ul>
    </div>
  );
}
