import type { NextRequest } from "next/server";
import { runFullAnalysis } from "@/lib/ai/analysisRunner";
import { prisma } from "@/lib/prisma";

/**
 * Dedicated long-running serverless function for AI analysis.
 * maxDuration=60 keeps the function alive on Vercel long enough for OpenRouter calls.
 */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisId, userId, documentIds, comprehensionLevel, jurisdiction, secret } = body;

    // Basic internal secret to prevent public abuse
    if (secret !== (process.env.NEXTAUTH_SECRET || "clarifex-secure-fallback-secret-for-tokens-2026")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!analysisId || !userId || !documentIds?.length) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify analysis exists and belongs to user
    const analysis = await prisma.analysis.findFirst({
      where: { id: analysisId, userId },
    });

    if (!analysis) {
      return Response.json({ error: "Analysis not found" }, { status: 404 });
    }

    if (analysis.status === "completed") {
      return Response.json({ success: true, status: "already_completed" });
    }

    // Run analysis — this stays alive because maxDuration = 60s
    await runFullAnalysis({
      analysisId,
      userId,
      documentIds,
      comprehensionLevel: comprehensionLevel || "eli-10",
      jurisdiction,
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("[/api/analysis/run] Error:", err?.message || err);
    return Response.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
