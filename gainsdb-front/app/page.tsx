"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import CheckingUsOut from "@/components/CheckingUsOut";
import LoginRegister from "@/components/LoginRegister";
import { Environments, Routes } from "@/constants/generalConstants";

import styles from "./page.module.css";

export default function Home() {
  const { data: session, status } = useSession();
  const [route, setRoute] = useState<Routes | undefined>();

  const server = process.env.NEXT_PUBLIC_BACKEND;

  const router = useRouter();

  useEffect(() => {
    if (route) {
      console.log(route);
      router.push("/" + route);
    }
  }, [route]);

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const token = session?.user?.authToken;

      if (!token) return;

      try {
        const res = await fetch(`${server}/api/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          signOut();
          throw new Error("Token invalid");
        }

        if (status === "authenticated" && session?.user?.authToken) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error(err);
        return;
      }
    };

    checkAuth();
  }, [status, session, router, server]);

  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;

  return (
    <>
      {/* Popup for demo credentials */}
      {env === Environments.Prod && <CheckingUsOut />}

      {/* Background container */}
      <div className={`${styles.splashBackground}`} />

      <div className={`${styles.splashBody}`}>
        {/* LOGIN/REGISTER Popup */}
        <LoginRegister setRoute={setRoute} />
      </div>
    </>
  );
}
