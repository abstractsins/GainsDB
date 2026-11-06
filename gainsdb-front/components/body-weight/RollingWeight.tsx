import styles from "@/app/user/body-weight/page.module.css";

export default function RollingWeightChart() {
  return (
    <>
      <h2 className={styles.sectionHeader}>Rolling</h2>
      <div className={styles.rollingWeightWrapper}></div>
    </>
  );
}
