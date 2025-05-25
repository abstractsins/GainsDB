"use client"; // Required for state & interactivity in Next.js App Router

import { useRef, useEffect, useState } from "react";
import { Oswald, Tourney } from "next/font/google";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiCloseFill } from "react-icons/ri";
import Loader from "@/app/components/Loader";

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
  const [popup, setPopup] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const server = process.env.NEXT_PUBLIC_BACKEND;

  // Redirect authenticated users to the dashboard
  useEffect(() => {
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
  }, [status, session, router]);

  async function handleLogin(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setWaiting(true);
    setShowLogin(true);

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

  useEffect(() => {
    if (username && password) setIsFormValid(true);
    else setIsFormValid(false);
  }, [username, password]);

  const closePopup = () => setPopup(false);

  return (
    <>
      {popup &&
        <div className="popup" id="demo-creds">
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
          <div className="close-button" onClick={closePopup}><RiCloseFill /></div>
        </div>
      }

      <div className="splash-container">
        {/* POPUP CONTAINER */}
        <div className="popup">
          {waiting &&
            <Loader></Loader>
          }
          <h1 className={tourney.className}>GainsDB</h1>
          <h2 className={oswald.className}>Track your workouts and visualize progress!</h2>
        </div>

        {isClient && (
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
                  <button type="submit" key="submit" className={`submit-button ${waiting || !isFormValid ? 'disabled' : ''}`} disabled={waiting || !isFormValid}>
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
          height: 100vh;
          text-align: center;
          position: relative;
        }

        .disabled {
          background-color: gray;
        }

        /* POPUP STYLES */
        .popup {
          background-color: var(--black);
          padding: 50px 50px 0 50px;
          border-radius: 10px 10px 0 0;
          margin-top: 100px;
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
          background-color: #add8e6;
        }
        button.login-button:hover {
          background-color:rgb(98, 129, 139);
          color: whitesmoke;
        }

        button.submit-button {
          background-color: #ADD989;
        }

        button.submit-button:hover {
          background-color: #35a031;
          color: whitesmoke;
        }

        button.login-button:active,
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
            min-width: 300px;
            width: 60%;
              padding-top: 5px;
          }
          .login-container {
            padding-top: 0;
          }
          div.form-container.exposed {
          transform: translateY(-1%);
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
    </>
  );
}
