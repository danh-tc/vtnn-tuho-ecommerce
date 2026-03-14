import "next-auth";

declare module "next-auth" {
  interface User {
    phone: string;
    role: string;
    avatarUrl?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email?: string;
      phone: string;
      role: string;
      avatarUrl?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: string;
    avatarUrl?: string;
  }
}
