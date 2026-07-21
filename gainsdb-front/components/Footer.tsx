"use client";

import styles from "./Footer.module.css";
import { Roboto_Slab } from "next/font/google";
import { Oswald } from "next/font/google";
import { signOut } from "next-auth/react";
import { useFooter } from "@/contexts/FooterContext";
import Link from "next/link";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function Footer() {
  // const router = useRouter();
  // const { pathname, asPath } = router;

  const { isLoggedIn, isInRegistration, setIsInRegistration } = useFooter();

  return (
    <footer className="footer">
      {isLoggedIn ? (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${styles.footerLink} ${oswald.className}`}
        >
          Logout
        </button>
      ) : isInRegistration ? (
        <Link
          href="/"
          onClick={() => setIsInRegistration(false)}
          className={`${styles.footerLink} ${oswald.className}`}
        >
          Login
        </Link>
      ) : (
        <Link
          href="/register"
          onClick={() => setIsInRegistration(true)}
          className={`${styles.footerLink} ${oswald.className}`}
        >
          Register
        </Link>
      )}
      <Link
        href="/about"
        className={`${styles.footerLink} ${oswald.className}`}
      >
        About
      </Link>
      <Link
        href="https://divs4u.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`${robotoSlab.className} ${styles.footerLink}`}
      >
        Divs4U
      </Link>
    </footer>
  );
}
