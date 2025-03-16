import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const server = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";

interface AuthUser {
  id: number;
  username: string;
  token: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(`${server}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) throw new Error("Invalid credentials");

          const user: AuthUser = await res.json();

          if (!user || !user.id || !user.username || !user.token) {
            throw new Error("Invalid user response from backend");
          }

          return {
            id: String(user.id),
            username: user.username,
            email: null,
            image: null,
            authToken: user.token
          }

        } catch (error) {
          console.error("🔴 Authentication Error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.authToken;
        token.id = user.id;
        token.name = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.authToken = String(token.accessToken);
      session.user.name = token.name;
      session.user.id = String(token.id);
      return session;
    },
  },
};
