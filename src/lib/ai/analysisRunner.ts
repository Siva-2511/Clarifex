import { prisma } from "@/lib/prisma";
import { callAI } from "./openrouter";
import {
  FULL_ANALYSIS_PROMPT,
  ELI5_PROMPT,
  ELI10_PROMPT,
  EXPERT_PROMPT,
  JURISDICTION_PREFIX,
} from "./prompts";
import { generateClauseFingerprint } from "./fingerprint";
import { logAuditEvent } from "@/lib/audit";

export interface AnalysisRunParams {
  analysisId: string;
  userId: string;
  documentIds: string[];
  comprehensionLevel?: "eli-5" | "eli-10" | "expert";
  jurisdiction?: string;
}

export async function runFullAnalysis(params: AnalysisRunParams) {
  const { analysisId, userId, documentIds, comprehensionLevel = "eli-10", jurisdiction } = params;

  try {
    // 1. Update status to processing
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "processing" },
    });

    await logAuditEvent({
      userId,
      action: "analysis.start",
      resource: analysisId,
    });

    // 2. Fetch all document texts
    const documents = await prisma.document.findMany({
      where: { id: { in: documentIds }, userId },
    });

    if (documents.length === 0) {
      throw new Error("No documents found for analysis");
    }

    const combinedText = documents
      .map((doc, idx) => `=== DOCUMENT ${idx + 1}: ${doc.name} ===\n${doc.extractedText}`)
      .join("\n\n");

    const effectiveJurisdiction =
      jurisdiction || documents[0].jurisdiction || "General Commercial Law";

    const systemPrompt = `${JURISDICTION_PREFIX(effectiveJurisdiction)}\n\n${FULL_ANALYSIS_PROMPT}`;

    // 3. Call OpenRouter fallback chain
    const aiResult = await callAI({
      prompt: `Analyze the following legal document(s):\n\n${combinedText}`,
      systemPrompt,
      preferredModel: "google/gemini-flash-1.5",
    });

    // 4. Parse AI output
    let parsedData: any;
    try {
      // Find JSON block if wrapped in markdown ```json ... ```
      const cleaned = aiResult.text.replace(/```json\s*([\s\S]*?)\s*```/g, "$1").trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn("Failed to parse AI output as JSON, creating structured fallback from raw text:", parseErr);
      parsedData = {
        summary: aiResult.text.slice(0, 500),
        riskScore: 5.0,
        clauses: [
          {
            id: "clause-1",
            title: "General Terms",
            type: "general",
            riskLevel: "medium",
            text: aiResult.text.slice(0, 300),
            reason: "Parsed from document text",
            pageRef: 1,
          },
        ],
        obligations: [],
        checklist: [],
      };
    }

    // 5. Add Clause DNA Fingerprints
    if (Array.isArray(parsedData.clauses)) {
      parsedData.clauses = parsedData.clauses.map((clause: any) => ({
        ...clause,
        fingerprint: generateClauseFingerprint(clause.text || ""),
      }));
    }

    // 6. Generate comprehension level rewrite if requested
    let levelPrompt = ELI10_PROMPT;
    if (comprehensionLevel === "eli-5") levelPrompt = ELI5_PROMPT;
    if (comprehensionLevel === "expert") levelPrompt = EXPERT_PROMPT;

    const comprehensionResult = await callAI({
      prompt: `Rewrite the following summary and risk points for the requested level:\n\nSummary:\n${parsedData.summary}\n\nKey risks:\n${JSON.stringify(parsedData.clauses)}`,
      systemPrompt: levelPrompt,
    });

    parsedData.comprehensionLevelContent = comprehensionResult.text;

    // 7. Persist to Database
    const updated = await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: "completed",
        modelUsed: aiResult.modelUsed,
        comprehensionLevel,
        riskScore: typeof parsedData.riskScore === "number" ? parsedData.riskScore : 5.0,
        resultJson: parsedData,
      },
    });

    // 8. Create Checklist records
    if (Array.isArray(parsedData.checklist) && parsedData.checklist.length > 0) {
      await prisma.checklist.create({
        data: {
          analysisId,
          items: parsedData.checklist,
        },
      });
    }

    await logAuditEvent({
      userId,
      action: "analysis.complete",
      resource: analysisId,
    });

    return updated;
  } catch (error) {
    console.error(`Analysis failed for id ${analysisId}:`, error);
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "failed" },
    });
    throw error;
  }
}
