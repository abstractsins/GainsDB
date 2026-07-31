"use client";

import { useEffect, useRef, useState } from "react";
import { toTitleCase } from "@/utils/utils";

import styles from "./Waiter.module.css";

export enum WaiterMessage {
  LoggingIn = "Logging\u00A0In",
  Registering = "Registering",
  Syncing = "Syncing",
}

interface Props {
  msg: string;
  setTextWrapperElement: (el: HTMLElement) => void;
}

export default function Waiter({ msg, setTextWrapperElement }: Props) {
  const [waitText, setLoadText] = useState(msg);

  const waitTextSpanRef = useRef(null);

  msg = msg.toLowerCase();

  useEffect(() => {
    setTimeout(() => {
      const cap = toTitleCase(msg);
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
          setLoadText(cap + "....");
          break;
        case msg + "....":
          setLoadText(cap + ".....");
          break;
        case msg + ".....":
          setLoadText(cap);
          break;
      }
    }, 150);
  });

  useEffect(() => {
    if (waitTextSpanRef?.current) {
      setTextWrapperElement(waitTextSpanRef.current);
    }
  }, []);

  return (
    <>
      <div className={styles.waiterShield}></div>
      <div className={styles.waiter}>
        <div className={styles.waitTextWrapper}>
          <span ref={waitTextSpanRef} className={styles.waitText}>
            {waitText}
          </span>
        </div>
      </div>
    </>
  );
}
