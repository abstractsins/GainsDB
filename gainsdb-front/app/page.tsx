"use client"; // Required for state & interactivity in Next.js App Router

import { useRef, useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useFooter } from "@/contexts/FooterContext";
import styles from "./page.module.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const server = process.env.NEXT_PUBLIC_BACKEND;
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;

  const { setIsInRegistration, setIsLoggedIn } = useFooter();

  async function handleLogin(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setWaiting(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid login credentials");
      setWaiting(false);
      return;
    }

    setIsLoggedIn(true);

    console.log("✅ Login successful, redirecting to dashboard...");
    router.replace("/dashboard");
  }

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    setIsInRegistration(false);

    const checkAuth = async () => {
      const token = session?.user?.authToken;

      if (!token) {
        return;
      }

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
        // Proceed as normal
      } catch (err) {
        // Token is invalid or expired
        console.error(err);
        localStorage.removeItem("token");
        return;
      }

      if (status === "authenticated" && session?.user?.authToken) {
        router.replace("/dashboard");
      }
    };
    checkAuth();
  }, [status, session, router, server, setIsInRegistration]);

  useEffect(() => {
    if (username && password) setIsFormValid(true);
    else setIsFormValid(false);
  }, [username, password]);

  const closePopup = () => setPopup(false);

  return (
    <>
      {popup && env === "production" && (
        <div className={`${styles.popup}`} id="demo-creds">
          <div className="demo-creds-body">
            <header>
              <span>Checking us out?</span>
            </header>
            <div className="creds">
              <span className="label">user:</span> <span>demo</span>
              <br></br>
              <span className="label">pass:</span> <span>DanBerlin!</span>
            </div>
          </div>
          <div className="close-button" onClick={closePopup}>
            <RiCloseFill />
          </div>
        </div>
      )}

      {/* Background container */}
      <div className={`${styles.splashBody}`}></div>

      <div className={`${styles.splashContainer}`}>
        {/* POPUP CONTAINER */}
        <div className={`${styles.popup} ${styles.loginPopup}`}>
          {waiting && <Loader msg="Logging In"></Loader>}
          <h1 className={`${styles.title}`}>GainsDB</h1>
          <h2>Track your workouts and visualize progress!</h2>

          <div className={`${styles.formContainer}`}>
            <form method="get" onSubmit={handleLogin}>
              <div className={`${styles.loginFieldsContainer}`}>
                <input
                  ref={usernameRef}
                  className={`${styles.loginField}`}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  required
                />
                <input
                  className={`${styles.loginField}`}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={`${styles.loginContainer}`}>
                <button
                  id="submit-button"
                  type="submit"
                  key="submit"
                  className={`${styles.submitButton} ${waiting || !isFormValid ? "disabled" : ""}`}
                  disabled={waiting || !isFormValid}
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
