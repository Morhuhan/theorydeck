// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const nextAuth = NextAuth(authConfig);

export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const handlers = nextAuth.handlers;