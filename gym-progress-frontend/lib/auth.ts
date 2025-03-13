import { AdapterUser } from "next-auth/adapters"; // Ensure this import is present
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const server = process.env.NEXT_PUBLIC_BACKEND || `http://localhost:5000`;

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
  
        async authorize(credentials): Promise<AdapterUser | null> {
          if (!credentials?.username || !credentials?.password) return null;
  
          try {
            const res = await fetch(`${server}/api/login`, {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            });
  
            if (!res.ok) throw new Error("Invalid credentials");
  
            const user = await res.json();
            if (!user || !user.id || !user.token) {
              throw new Error("User authentication failed");
            }
  
            // ✅ Convert our custom user to NextAuth's expected type
            const adaptedUser: AdapterUser = {
              id: String(user.id), // Ensure ID is always a string
              name: user.username, // NextAuth uses `name` instead of `username`
              emailVerified: null,
              email: "", // Optional, required for some providers
              image: "", // Optional, not used here
            };
  
            return adaptedUser;
          } catch (error) {
            console.error("Auth error:", error);
            return null; // Ensure the function returns null on failure
          }
        }
  
  
      }),
    ],
    pages: {
      signIn: "/",
    },
    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 24, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      // ✅ Fix: Ensure `token` always has `id`, `username`, and `authToken`
      async jwt({ token, user }): Promise<JWT> {
        if (user) {
          token.id = user.id; // ID is already a string
          token.username = user.name; // Adapted user stores username in `name`
          token.authToken = (user as any).authToken || ""; // Ensure authToken is included
        }
        return token;
      },
  
      // ✅ Fix: Ensure `session.user` is always populated correctly
      async session({ session, token }): Promise<Session> {
        if (!session.user) {
          session.user = {
            id: Number(token.id),
            username: String(token.username), // Adapt to NextAuth naming
            authToken: String(token.authToken), // Ensure token is carried over
          };
        } else {
          session.user.authToken = String(token.authToken); // Preserve authToken
        }
  
        return session;
      }
  
    },
  };
  