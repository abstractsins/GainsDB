import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const user = await res.json();
          if (!user || !user.id || !user.token) {
            throw new Error("User authentication failed");
          }

          return {
            id: user.id,
            username: user.username,
            authToken: user.token, // ✅ Store token properly
          };
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
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    
    async () {
      console.log('test!!!!!!!!!');
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.authToken = user.authToken;
      }
      return token;
    },

    async session({ session, token }) {
      console.log('session: ' + session);
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          authToken: token.authToken, 
        };
      }
      return session;
    },

  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
