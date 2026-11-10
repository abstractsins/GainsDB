"use client";

import styles from "./Footer.module.css";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Footer() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAboutPage = pathname === "/about";

  return (
    <footer className={styles.footerWrapper}>
      {isAuthenticated && !isAboutPage && (
        <a
          onClick={() => signOut({ callbackUrl: "/" })}
          className={styles.footerLink}
        >
          Logout
        </a>
      )}

      {isAboutPage ? (
        isAuthenticated ? (
          <>
            <Link href="/user/dashboard" className={styles.footerLink}>
              Back
            </Link>
            <a
              onClick={() => signOut({ callbackUrl: "/" })}
              className={styles.footerLink}
            >
              Logout
            </a>
          </>
        ) : (
          <Link href="/" className={styles.footerLink}>
            Login
          </Link>
        )
      ) : (
        <Link href="/about" className={styles.footerLink}>
          About
        </Link>
      )}

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
