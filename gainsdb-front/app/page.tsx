"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import CheckingUsOut from "@/components/CheckingUsOut";
import LoginRegister from "@/components/LoginRegister";

import { Environments, Routes } from "@/constants/generalConstants";
import { Endpoints } from "@/constants/fetchConstants";

import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const server = process.env.NEXT_PUBLIC_BACKEND;

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const token = session?.user?.authToken;
      if (!token) return;

      try {
        const res = await fetch(`${server}/${Endpoints.VerifyToken}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          signOut();
          throw new Error("Token invalid");
        }

        if (status === "authenticated" && session?.user?.authToken) {
          router.replace(`/${Routes.Dashboard}`);
        }
      } catch (err) {
        console.error(err);
        return;
      }
    };

    checkAuth();
  }, [status, session, router, server]);

  return (
    <>
      {/* Popup for demo credentials */}
      {env === Environments.Prod && <CheckingUsOut />}

      {/* Background container */}
      <div className={styles.background}>
        <Image
          src="/bg3.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          quality={70}
          className={styles.backgroundImage}
        />
      </div>

      <div className={`${styles.splashBody}`}>
        {/* LOGIN/REGISTER Popup */}
        <LoginRegister />
      </div>
    </>
  );
}
