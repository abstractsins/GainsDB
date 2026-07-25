"use client";

import { useEffect, useState } from "react";
import { toTitleCase } from "@/utils/utils";

import styles from "./Waiter.module.css";

export enum WaiterMessage {
  LoggingIn = "Logging\u00A0In",
  Registering = "Registering"
  Off = "",
}

interface Props {
  msg: string;
}

export default function Waiter({ msg }: Props) {
  const [waitText, setLoadText] = useState(msg);

  msg = msg.toLowerCase();

  useEffect(() => {
    setTimeout(() => {
      const cap = toTitleCase(msg);
      console.log(waitText);
      switch (waitText.toLowerCase()) {
        case msg:
          setLoadText(cap + ".");
          break;
        case msg + ".":
          setLoadText(cap + "..");
          break;
        case msg + "..":
          setLoadText(cap + "...");
          break;
        case msg + "...":
          setLoadText(cap);
          break;
      }
    }, 250);
  });

  return (
    <>
      <div className={styles.waiterShield}></div>
      <div className={styles.waiter}>
        <div className={styles.waitTextWrapper}>
          <span className={styles.waitText}>{waitText}</span>
        </div>
      </div>
    </>
  );
}
