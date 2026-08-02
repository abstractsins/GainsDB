"use client";

// REACT
import { useEffect } from "react";

// NEXT
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// COMPONENTS
import CheckingUsOut from "@/components/CheckingUsOut";
import LoginRegister from "@/components/LoginRegister";

// CONSTANTS
import { Environments, Routes } from "@/constants/generalConstants";
import { Endpoints } from "@/constants/fetchConstants";

// STYLES
import styles from "./page.module.css";

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
          router.replace(`/${Routes.User}/${Routes.Dashboard}`);
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
      {env === Environments.Local && <CheckingUsOut />}

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
