"use client";

import styles from "./Footer.module.css";
import { signOut } from "next-auth/react";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Footer() {
  const { isLoggedIn } = useAuthContext();

  return (
    <footer className={styles.footerWrapper}>
      {isLoggedIn && (
        <a
          onClick={() => signOut({ callbackUrl: "/" })}
          className={styles.footerLink}
        >
          Logout
        </a>
      )}
      <Link href="/about" className={styles.footerLink}>
        About
      </Link>
      <Link
        href="https://divs4u.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.footerLink} ${styles.corporateLink}`}
      >
        Divs4U
      </Link>
    </footer>
  );
}
