import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { getPresignedDownloadUrl, deleteStorageObject } from "@/lib/storage/r2";
import { logAuditEvent } from "@/lib/audit";

export const documentRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string(), // pdf, docx, txt, screenshot, url, paste
        storageKey: z.string().default("inline"),
        sizeBytes: z.number().nonnegative(),
        extractedText: z.string().min(1),
        jurisdiction: z.string().optional().default("US-General"),
        language: z.string().optional().default("en"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const checksum = crypto
        .createHash("sha256")
        .update(input.extractedText)
        .digest("hex");

      const doc = await ctx.prisma.document.create({
        data: {
          userId: ctx.session.user.id as string,
          name: input.name,
          type: input.type,
          storageKey: input.storageKey,
          sizeBytes: input.sizeBytes,
          checksum,
          jurisdiction: input.jurisdiction,
          language: input.language,
          extractedText: input.extractedText,
        },
      });

      await logAuditEvent({
        userId: ctx.session.user.id,
        action: "document.upload",
        resource: doc.id,
      });

      return doc;
    }),

  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
          cursor: z.string().nullish(),
          searchQuery: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const { cursor, searchQuery, type } = input ?? {};

      const where: any = {
        userId: ctx.session.user.id,
      };

      if (type) {
        where.type = type;
      }

      if (searchQuery) {
        where.OR = [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { extractedText: { contains: searchQuery, mode: "insensitive" } },
        ];
      }

      const items = await ctx.prisma.document.findMany({
        take: limit + 1,
        where,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.prisma.document.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }

      let downloadUrl: string | null = null;
      if (doc.storageKey && doc.storageKey !== "inline") {
        try {
          downloadUrl = await getPresignedDownloadUrl(doc.storageKey);
        } catch (e) {
          console.warn("Could not generate download URL for storage key:", doc.storageKey);
        }
      }

      await logAuditEvent({
        userId: ctx.session.user.id,
        action: "document.view",
        resource: doc.id,
      });

      return {
        ...doc,
        downloadUrl,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.prisma.document.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }

      if (doc.storageKey && doc.storageKey !== "inline") {
        try {
          await deleteStorageObject(doc.storageKey);
        } catch (e) {
          console.warn("Failed to delete storage object:", e);
        }
      }

      await ctx.prisma.document.delete({
        where: { id: input.id },
      });

      await logAuditEvent({
        userId: ctx.session.user.id,
        action: "document.delete",
        resource: input.id,
      });

      return { success: true };
    }),
});
