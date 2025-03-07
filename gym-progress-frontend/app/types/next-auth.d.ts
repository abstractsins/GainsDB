import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    authToken?: string;
    user?: {
      id: number;
      username: string;
      authToken?: string;
    };
  }

  interface JWT {
    id: number;
    username: string;
    authToken: string;
  }
}
