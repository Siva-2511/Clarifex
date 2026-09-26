import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  generateMfaSecret,
  generateOtpauthUri,
  generateQrCodeDataUrl,
  verifyTotpToken,
} from "@/lib/auth/mfa";
import { logAuditEvent } from "@/lib/audit";

export const authRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        mfaEnabled: true,
        firstLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return user;
  }),

  enableMfa: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user || !user.email) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "User has no email" });
    }

    const secret = generateMfaSecret();
    const uri = generateOtpauthUri(user.email, secret);
    const qrCode = await generateQrCodeDataUrl(uri);

    // Temporarily save secret until verified
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: { mfaSecret: secret },
    });

    return { secret, qrCode };
  }),

  verifyMfaSetup: protectedProcedure
    .input(z.object({ token: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || !user.mfaSecret) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "MFA setup not initialized" });
      }

      const isValid = verifyTotpToken(input.token, user.mfaSecret);
      if (!isValid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid 6-digit TOTP code" });
      }

      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { mfaEnabled: true },
      });

      await logAuditEvent({
        userId: user.id,
        action: "mfa.enabled",
        resource: "user.security",
      });

      return { success: true };
    }),

  disableMfa: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { mfaEnabled: false, mfaSecret: null },
    });

    await logAuditEvent({
      userId: ctx.session.user.id,
      action: "mfa.disabled",
      resource: "user.security",
    });

    return { success: true };
  }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { firstLogin: false },
    });
    return { success: true };
  }),

  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1).optional(), image: z.string().url().optional() }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          image: input.image,
        },
      });
      return updated;
    }),
});
