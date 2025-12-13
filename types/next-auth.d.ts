import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
    email: string;
    name?: string | null;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface AdapterUser {
    id: string;
    role: UserRole;
    email: string;
    name?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}