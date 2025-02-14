"use client"; // Required for state & interactivity in Next.js App Router

import { useRef, useEffect, useState } from "react";
import { Oswald } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const oswald = Oswald({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  display: "swap" 
});

export default function Home() {
  
  const { data: session, status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      username, 
      password,
      redirect: false,
    })

    if (res?.error) {
      alert("Invalid login credentials");
    } else {
      console.log("🤔🤔🤔 Correct credentials")
      console.log("🔍 New Session Data:", session);
      router.push("/dashboard");
    }
  }

  function dropDown(show: boolean) {
    setShowLogin(show); // Only update state, let React handle class updates
    if (usernameRef.current) {
      usernameRef.current.focus(); // Auto-focus the input field
    }
  }

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setShowLogin(false); 
  }, []);

  return (
    <div className="splash-container">
      {/* POPUP CONTAINER */}
      <div className="popup">
        <h1 className={oswald.className}>Gym Progress Tracker</h1>
        <h2>Track your workouts and visualize progress!</h2>
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
              onChange={(e) => setUsername(e.target.value)} required 
            />
            <input 
              className="login-field" 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} required 
              />
          </div>
          <div className="login-container">
            {showLogin ? (
              <button type="submit" key="submit" className="submit-button">SUBMIT</button>
            ) : (
              <button
                className="login-button"
                key="login"
                onClick={(e) => {
                  e.preventDefault();
                  dropDown(true)
                }}>
                  LOGIN
              </button>
            )}
          </div>
        </form>
      </div>)}

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
          padding: 50px 50px 0 50px;
          border-radius: 10px 10px 0 0;
          background-color: #136;
          min-height: 25%;
          width: 65%;
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
          flex-direction: column;
          align-items: center;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        div.form-container {
          background-color: #136; 
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 65%;
          border-radius: 0 0 10px 10px;
          transition: transform 500ms;
          transform: translateY(-60%);
        }
        div.form-container.exposed {
          transform: translateY(0);
        }
        
        .login-form {
        }

        /* SLIDING LOGIN FORM */
        .login-drawer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #fff;
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

        button:hover {
          {/* background-color: lightgray; */}
        }

        h1 {
          font-size: 3em;
          text-transform: uppercase;
          font-family: "Oswald";
        }

        h2 {
          font-size: 1.35em;
        }

        @media (max-width: 848px) {
          h1 {
            font-size: 28pt;
          }
          h2 {
            font-size: 1.25em;
          }
        }


        @media (max-width: 753px) {
          .popup, 
          #login-drawer {
            min-width: 90%;
          }
          h1 {
          font-size: 2.5em;
          }
          h2 {
            font-size: 1.25em;
          }
        }

        @media (max-width: 531px) {
          .popup {
            padding: 25px 25px 0;
          }
          h1 {
            font-size: 1.75em;
          }
        }
        
        @media (min-width: 1200px) {

          h1 {
            font-size: 3.5em;
          }
          h2 {
            font-size: 1.75em;
          }
          button {
            font-size: 2em;
          }
          .login-fields-container {
            flex-direction: row;
            padding: 20px 0;
          }
          div.form-container {
            transform: translateY(-50%);
          }

        }



      `}</style>
    </div>
  );
}
