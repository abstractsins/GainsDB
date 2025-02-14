import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: number;
  username: string;
  token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        try {
          const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const user: User = await res.json();
          if (!user || !user.id) {
            throw new Error("User not found");
          }

          return user; // Type safety for returned user
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // Keep splash page as login
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, user }): Promise<any> {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.authToken = user.token;
      }
      return token;
    },
    async session({ session, token }): Promise<any> {
      if (token) {
        session.user = { id: token.id, username: token.username };
        session.authToken = token.authToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
