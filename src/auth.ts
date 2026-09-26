import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { logAuditEvent } from "@/lib/audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/gmail.send",
              },
            },
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          await logAuditEvent({
            action: "user.failed_login",
            resource: email,
            userAgent: req.headers?.get("user-agent") ?? undefined,
          });
          return null;
        }

        const isMatch = await verifyPassword(String(credentials.password), user.password);
        if (!isMatch) {
          await logAuditEvent({
            userId: user.id,
            action: "user.failed_login",
            resource: user.email ?? "unknown",
            userAgent: req.headers?.get("user-agent") ?? undefined,
          });
          return null;
        }

        await logAuditEvent({
          userId: user.id,
          action: "user.login",
          resource: user.email ?? "unknown",
          userAgent: req.headers?.get("user-agent") ?? undefined,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          mfaEnabled: user.mfaEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.mfaEnabled = (user as any).mfaEnabled || false;
        token.mfaVerified = false; // requires TOTP step if mfaEnabled is true
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      if (trigger === "update" && session) {
        token.mfaVerified = session.mfaVerified ?? token.mfaVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).mfaEnabled = token.mfaEnabled as boolean;
        (session.user as any).mfaVerified = token.mfaVerified as boolean;
        (session as any).accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "clarifex-secure-fallback-secret-for-tokens-2026",
});
