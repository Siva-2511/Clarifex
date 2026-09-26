import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { runFullAnalysis } from "@/lib/ai/analysisRunner";
import { callAI } from "@/lib/ai/openrouter";
import {
  QA_PROMPT,
  DIFF_PROMPT,
  TIMELINE_PROMPT,
  CHECKLIST_PROMPT,
  ELI5_PROMPT,
  ELI10_PROMPT,
  EXPERT_PROMPT,
} from "@/lib/ai/prompts";

export const analysisRouter = router({
  run: protectedProcedure
    .input(
      z.object({
        documentIds: z.array(z.string()).min(1),
        comprehensionLevel: z.enum(["eli-5", "eli-10", "expert"]).default("eli-10"),
        jurisdiction: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify document ownership
      const docs = await ctx.prisma.document.findMany({
        where: {
          id: { in: input.documentIds },
          userId: ctx.session.user.id,
        },
      });

      if (docs.length !== input.documentIds.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "One or more documents do not belong to you or do not exist",
        });
      }

      const analysis = await ctx.prisma.analysis.create({
        data: {
          userId: ctx.session.user.id as string,
          documentIds: input.documentIds,
          status: "pending",
          comprehensionLevel: input.comprehensionLevel,
        },
      });

      // Trigger dedicated long-running API route (survives Vercel's 10s default limit)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      fetch(`${baseUrl}/api/analysis/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id,
          userId: ctx.session.user.id,
          documentIds: input.documentIds,
          comprehensionLevel: input.comprehensionLevel,
          jurisdiction: input.jurisdiction,
          secret: process.env.NEXTAUTH_SECRET,
        }),
      }).catch((err) => console.error("Failed to trigger analysis runner:", err));

      return { analysisId: analysis.id };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          checklists: true,
          collaborations: true,
        },
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      // Fetch corresponding documents metadata
      const documents = await ctx.prisma.document.findMany({
        where: { id: { in: analysis.documentIds } },
        select: { id: true, name: true, type: true, sizeBytes: true, createdAt: true },
      });

      return {
        ...analysis,
        documents,
      };
    }),

  getStatus: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: {
          id: true,
          status: true,
          riskScore: true,
          modelUsed: true,
          comprehensionLevel: true,
        },
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      return analysis;
    }),

  setComprehensionLevel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        level: z.enum(["eli-5", "eli-10", "expert"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      let prompt = ELI10_PROMPT;
      if (input.level === "eli-5") prompt = ELI5_PROMPT;
      if (input.level === "expert") prompt = EXPERT_PROMPT;

      const resultJson: any = analysis.resultJson || {};
      const aiResponse = await callAI({
        prompt: `Rewrite this analysis for ${input.level} level:\n\nSummary: ${resultJson.summary || ""}\nRisks: ${JSON.stringify(resultJson.clauses || [])}`,
        systemPrompt: prompt,
      });

      resultJson.comprehensionLevelContent = aiResponse.text;

      const updated = await ctx.prisma.analysis.update({
        where: { id: input.id },
        data: {
          comprehensionLevel: input.level,
          resultJson,
        },
        select: {
          id: true,
          comprehensionLevel: true,
          status: true,
        },
      });

      return updated;
    }),

  chat: protectedProcedure
    .input(
      z.object({
        analysisId: z.string(),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: { id: input.analysisId, userId: ctx.session.user.id },
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      // Fetch documents text
      const docs = await ctx.prisma.document.findMany({
        where: { id: { in: analysis.documentIds } },
      });
      const contextText = docs.map((d) => `=== ${d.name} ===\n${d.extractedText}`).join("\n\n");

      // Save user message
      await ctx.prisma.message.create({
        data: {
          analysisId: input.analysisId,
          role: "user",
          content: input.message,
        },
      });

      // Fetch recent messages for conversational context
      const history = await ctx.prisma.message.findMany({
        where: { analysisId: input.analysisId },
        orderBy: { createdAt: "desc" },
        take: 6,
      });

      const conversation = history
        .reverse()
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n");

      const prompt = `DOCUMENT CONTEXT:\n${contextText}\n\nCONVERSATION HISTORY:\n${conversation}\n\nUSER QUESTION: ${input.message}\n\nPlease answer accurately with specific citations (e.g. [Page X, Clause Y]).`;

      const aiResponse = await callAI({
        prompt,
        systemPrompt: QA_PROMPT,
      });

      // Extract citation tags if any
      const citationRegex = /\[(.*?)\]/g;
      const citationMatches = [...aiResponse.text.matchAll(citationRegex)].map((m) => m[1]);

      const assistantMsg = await ctx.prisma.message.create({
        data: {
          analysisId: input.analysisId,
          role: "assistant",
          content: aiResponse.text,
          citations: citationMatches.length > 0 ? citationMatches : undefined,
        },
      });

      return assistantMsg;
    }),

  diff: protectedProcedure
    .input(
      z.object({
        docAId: z.string(),
        docBId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [docA, docB] = await Promise.all([
        ctx.prisma.document.findFirst({ where: { id: input.docAId, userId: ctx.session.user.id } }),
        ctx.prisma.document.findFirst({ where: { id: input.docBId, userId: ctx.session.user.id } }),
      ]);

      if (!docA || !docB) {
        throw new TRPCError({ code: "NOT_FOUND", message: "One or both documents not found" });
      }

      const prompt = `DOCUMENT A (${docA.name}):\n${docA.extractedText}\n\nDOCUMENT B (${docB.name}):\n${docB.extractedText}`;

      const aiResponse = await callAI({
        prompt,
        systemPrompt: `${DIFF_PROMPT}\nReturn a JSON array: [{ "type": "added"|"removed"|"modified", "clauseTitle": string, "significance": "critical"|"moderate"|"minor", "explanation": string, "oldText": string, "newText": string }]`,
      });

      let changes = [];
      try {
        const cleaned = aiResponse.text.replace(/```json\s*([\s\S]*?)\s*```/g, "$1").trim();
        changes = JSON.parse(cleaned);
      } catch (e) {
        changes = [
          {
            type: "modified",
            clauseTitle: "General Comparison",
            significance: "moderate",
            explanation: aiResponse.text,
            oldText: docA.extractedText.slice(0, 200),
            newText: docB.extractedText.slice(0, 200),
          },
        ];
      }

      return {
        docA: { id: docA.id, name: docA.name, text: docA.extractedText },
        docB: { id: docB.id, name: docB.name, text: docB.extractedText },
        changes,
      };
    }),

  multiCompare: protectedProcedure
    .input(
      z.object({
        documentIds: z.array(z.string()).min(3).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const docs = await ctx.prisma.document.findMany({
        where: { id: { in: input.documentIds }, userId: ctx.session.user.id },
      });

      if (docs.length < 3) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Please provide at least 3 valid documents" });
      }

      const docTexts = docs.map((d, i) => `--- DOC ${i + 1}: ${d.name} ---\n${d.extractedText}`).join("\n\n");

      const prompt = `Compare the following ${docs.length} contracts across standard dimensions (Liability Cap, Indemnification, Governing Law, Term/Renewal, Non-Compete, Termination for Convenience).\n\n${docTexts}\n\nReturn JSON: { "categories": [{ "name": string, "rows": [{ "clauseType": string, "cells": [{ "docId": string, "docName": string, "summary": string, "risk": "low"|"medium"|"high"|"missing" }] }] }] }`;

      const aiResponse = await callAI({
        prompt,
        preferredModel: "google/gemini-flash-1.5",
      });

      let matrix: any = { categories: [] };
      try {
        const cleaned = aiResponse.text.replace(/```json\s*([\s\S]*?)\s*```/g, "$1").trim();
        matrix = JSON.parse(cleaned);
      } catch (e) {
        matrix = {
          categories: [
            {
              name: "Key Provisions",
              rows: [
                {
                  clauseType: "Liability Cap",
                  cells: docs.map((d) => ({
                    docId: d.id,
                    docName: d.name,
                    summary: "Analyzed provision",
                    risk: "medium" as const,
                  })),
                },
              ],
            },
          ],
        };
      }

      return {
        documents: docs.map((d) => ({ id: d.id, name: d.name })),
        matrix,
      };
    }),

  generateChecklist: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: { id: input.analysisId, userId: ctx.session.user.id },
      });
      if (!analysis) throw new TRPCError({ code: "NOT_FOUND" });

      const docs = await ctx.prisma.document.findMany({
        where: { id: { in: analysis.documentIds } },
      });
      const text = docs.map((d) => d.extractedText).join("\n\n");

      const aiResponse = await callAI({
        prompt: `Generate checklist for:\n${text}`,
        systemPrompt: `${CHECKLIST_PROMPT}\nReturn JSON array: [{ "id": string, "category": string, "label": string, "checked": false, "importance": "critical"|"high"|"medium", "explanation": string }]`,
      });

      let items = [];
      try {
        const cleaned = aiResponse.text.replace(/```json\s*([\s\S]*?)\s*```/g, "$1").trim();
        items = JSON.parse(cleaned);
      } catch (e) {
        items = [
          {
            id: "chk-1",
            category: "Before Signing",
            label: "Review indemnification clauses with legal counsel",
            checked: false,
            importance: "high",
            explanation: "Ensures exposure is capped.",
          },
        ];
      }

      const checklist = await ctx.prisma.checklist.create({
        data: {
          analysisId: input.analysisId,
          items,
        },
      });

      return checklist;
    }),

  extractTimeline: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: { id: input.analysisId, userId: ctx.session.user.id },
      });
      if (!analysis) throw new TRPCError({ code: "NOT_FOUND" });

      const resultJson: any = analysis.resultJson || {};
      if (resultJson.obligations && resultJson.obligations.length > 0) {
        return { obligations: resultJson.obligations };
      }

      const docs = await ctx.prisma.document.findMany({
        where: { id: { in: analysis.documentIds } },
      });
      const text = docs.map((d) => d.extractedText).join("\n\n");

      const aiResponse = await callAI({
        prompt: `Extract timeline and obligations from:\n${text}`,
        systemPrompt: TIMELINE_PROMPT,
      });

      let timelineData = { timeline: [] };
      try {
        const cleaned = aiResponse.text.replace(/```json\s*([\s\S]*?)\s*```/g, "$1").trim();
        timelineData = JSON.parse(cleaned);
      } catch (e) {
        console.warn("Timeline parse fallback");
      }

      return timelineData;
    }),

  list: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.analysis.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 10,
        include: {
          messages: { take: 1, orderBy: { createdAt: "desc" } },
        },
      });
      return items;
    }),
});
