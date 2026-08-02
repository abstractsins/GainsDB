import { loginRequest } from "@/utils/fetchRequests";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        return loginRequest(credentials);
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
