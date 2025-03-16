"use client"; // Required for state & interactivity in Next.js App Router

import { useRef, useEffect, useState } from "react";
import { Oswald, Tourney } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const tourney = Tourney({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"],
  display: "swap",
});

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();


  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.authToken) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid login credentials");
      return;
    }

    console.log("✅ Login successful, redirecting to dashboard...");
    router.replace("/dashboard");
  }

  function dropDown(show: boolean) {
    setShowLogin(show);
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }

  useEffect(() => {
    setIsClient(true);
    setShowLogin(false);
  }, []);

  return (
    <div className="splash-container">
      {/* POPUP CONTAINER */}
      <div className="popup">
        <h1 className={tourney.className}>GainsDB</h1>
        <h2 className={oswald.className}>Track your workouts and visualize progress!</h2>
      </div>

      {isClient && status !== "authenticated" && (
        <div id="login-drawer" className={showLogin ? "form-container exposed" : "form-container"}>
          <form method="get" onSubmit={handleLogin}>
            {/* SLIDING LOGIN FORM (Only Appears When Clicked) */}
            <div className="login-fields-container">
              <input
                ref={usernameRef}
                className="login-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                required
              />
              <input
                className="login-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="login-container">
              {showLogin ? (
                <button type="submit" key="submit" className="submit-button">
                  SUBMIT
                </button>
              ) : (
                <button
                  className="login-button"
                  key="login"
                  onClick={(e) => {
                    e.preventDefault();
                    dropDown(true);
                  }}
                >
                  LOGIN
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .splash-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          position: relative;
        }

        /* POPUP STYLES */
        .popup {
          background-color: var(--black);
          padding: 50px 50px 0 50px;
          border-radius: 10px 10px 0 0;
          min-height: 25%;
          max-height: 40%;
          width: 48%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        /* ALWAYS VISIBLE LOGIN BUTTON */
        .login-container {
          padding: 30px;
        }
        #login-drawer {
          padding-top: 20px;
        }
        .login-field {
          margin: 5px;
        }
        .login-fields-container {
          display: flex;
          align-items: center;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        div.form-container {
          background-color: var(--black);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 48%;
          border-radius: 0 0 10px 10px;
          transition: transform 500ms;
          transform: translateY(-37%);
        }
        div.form-container.exposed {
          transform: translateY(-5%);
        }

        /* SLIDING LOGIN FORM */
        .login-drawer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--black);
          padding: 20px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          z-index: 1;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        input {
          color: black;
          font-weight: 600;
          font-size: 1.25em;
          padding: 10px;
          width: 200px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          padding: 12px 25px;
          font-size: 1.5em;
          cursor: pointer;
          color: black;
          border-radius: 10px;
          font-weight: 600;
          margin: 10px;
          width: fit-content;
          font-family: "Oswald";
        }
        button.login-button {
          background-color: lightblue;
        }
        button.submit-button {
          background-color: #ADD989;
        }

        button.submit-button:hover {
          background-color: #35a031;
          color: whitesmoke;
        }

        button.submit-button:active {
          background-color: whitesmoke;
          color: black;
        }

        h1 {
          font-size: 8em;
          font-family: "Tourney";
        }

        h2 {
          font-size: 2.5em;
        }

        @media (max-width: 1699px) {
          h1 {
            font-size: 6em;
          }
          h2 {
            font-size: 2em;
          }
          div.form-container {
            max-height: 30%;
            transform: translateY(-50%);
          }
          div.popup {
            padding: 15px
          }
        }

        @media (max-width: 1199px) {
          h1 {
            font-size: 4.5em;
          }
          h2 {
            font-size: 1.5em;
          }
          .login-fields-container {
            flex-direction: column;
          }

          .popup {
            max-height: 20%;
          }
        }

        @media (max-width: 848px) {
          h1 {
            font-size: 4em;
          }
          h2 {
            font-size: 1.5em;
          }
          .login-fields-container {
            flex-direction: column;
          }

          .login-fields-container input {
            font-size: 1em;
          }

        }


        @media (max-width: 753px) {
          .popup, 
          #login-drawer {
            min-width: 243px;
            width: 60%;
          }
          h1 {
            font-size: 3.25em;
          }
          h2 {
            font-size: 1.33em;
          }
          .login-fields-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
