import { FetchMethods } from "@/constants/fetchConstants";
import styles from "./Login.module.css";

export default function Login() {
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

  return (
    <form method={FetchMethods.GET} onSubmit={handleLogin}>
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
      <div className={`${styles.loginContainer}`}></div>
    </form>
  );
}
