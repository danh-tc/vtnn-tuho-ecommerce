import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  phone: z.string().min(9).max(12),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/dang-nhap",
    error: "/dang-nhap",
  },
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Số điện thoại", type: "text" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { phone, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { phone },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            passwordHash: true,
            role: true,
            isActive: true,
            avatarUrl: true,
          },
        });

        if (!user || !user.isActive) return null;

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        return {
          id: String(user.id),
          name: user.firstName,
          lastName: user.lastName,
          email: user.email ?? undefined,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.lastName = (user as { lastName: string }).lastName;
        token.phone = (user as { phone: string }).phone;
        token.role = (user as { role: string }).role;
        token.avatarUrl = (user as { avatarUrl?: string }).avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.lastName = token.lastName as string;
      session.user.phone = token.phone as string;
      session.user.role = token.role as string;
      session.user.avatarUrl = token.avatarUrl as string | undefined;
      return session;
    },
  },
});
