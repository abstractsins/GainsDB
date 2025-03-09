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
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await res.json();
          if (!data || !data.user.id || !data.token) {
            throw new Error("User authentication failed");
          }

          console.log(data.user);

          return {
            id: data.user.id,
            username: data.user.username,
            authToken: data.token, 
            preferences: data.user.preferences
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
        token.preferences = user.preferences;
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
          preferences: token.preferences || { theme: "light", unit: "lbs" }
        };
      }
      return session;
    },

  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
