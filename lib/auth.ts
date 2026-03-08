import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

const getAuthUrl = () => {
  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  return baseUrl;
};

const isDevelopment = process.env.NODE_ENV === "development";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: isDevelopment ? "sqlite" : "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    trustedOrigins: [
      getAuthUrl(),
      `${getAuthUrl()}/api/auth`,
    ],
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

// Export types
export type Session = typeof auth.$Infer.Session;
export type SessionUser = typeof auth.$Infer.Session.user;