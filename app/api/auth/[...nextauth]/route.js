import NextAuth from "next-auth";
import { authConfig } from "@/config/auth";

const hanlder = NextAuth(authConfig)

export {hanlder as GET,hanlder as POST}