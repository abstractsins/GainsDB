import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ Correctly import authOptions

const handler = NextAuth(authOptions); // ✅ Pass authOptions to NextAuth

export { handler as GET, handler as POST }; // ✅ Export GET and POST handlers
