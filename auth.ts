// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const handler = NextAuth(authConfig);

export const { GET, POST } = handler;

export const { auth, signIn, signOut } = handler;