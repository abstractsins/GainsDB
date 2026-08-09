import { useEffect, useState } from "react";

import styles from "./DashboardCardLoader.module.css";

export default function DashboardCardLoader() {
  const [loaderText, setLoaderText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      switch (loaderText.toLowerCase()) {
        case "":
          setLoaderText(".");
          break;
        case ".":
          setLoaderText("..");
          break;
        case "..":
          setLoaderText("...");
          break;
        case "...":
          setLoaderText("....");
          break;
        case "....":
          setLoaderText(".....");
          break;
        case ".....":
          setLoaderText("......");
          break;
        case "......":
          setLoaderText(".......");
          break;
        case ".......":
          setLoaderText("");
          break;
      }
    }, 150);
  });

  return <div className={styles.loaderText}>{loaderText}</div>;
}
