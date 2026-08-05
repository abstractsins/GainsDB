interface Props {
  icon: React.ReactNode;
  title: string;
  value: string | number | React.ReactNode;
  description: string;
  id: string;
}

import styles from "./DashboardCard.module.css";

const InfoCard = ({ icon, title, value, description, id }: Props) => {
  let textLength;
  if (typeof value === "string") {
    textLength = value.toString().length;
  } else if (typeof value === "object") {
    textLength = 5;
  }
  const style = { "--char-count": textLength } as React.CSSProperties;

  return (
    <div className={styles.dashboardCard}>
      <header className={styles.dashboardCard}>
        <div className={styles.dashboardCardIcon}>{icon}</div>
        <h3>{title}</h3>
      </header>
      <div className={styles.dashboardCardBody}>
        <div className={styles.dashboardCardValueContainer}>
          <span className={styles.dashboardCardValue} style={style} id={id}>
            {value}
          </span>
        </div>
        <div className={styles.dashboardCardDescContainer}>
          <aside>{description}</aside>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
