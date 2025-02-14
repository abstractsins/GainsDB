import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      authToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    username: string;
    token: string;
  }
}
