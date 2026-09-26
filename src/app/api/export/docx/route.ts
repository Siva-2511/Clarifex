import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateDocxExport } from "@/lib/export/docx";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { analysisId } = await req.json();
    if (!analysisId) {
      return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
    }

    const analysis = await prisma.analysis.findFirst({
      where: { id: analysisId, userId: session.user.id },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    const docs = await prisma.document.findMany({
      where: { id: { in: analysis.documentIds } },
      select: { name: true },
    });

    const docxBuffer = await generateDocxExport(
      analysis,
      docs.map((d) => d.name),
    );

    await logAuditEvent({
      userId: session.user.id,
      action: "analysis.export_docx",
      resource: analysis.id,
    });

    return new Response(new Uint8Array(docxBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Clarifex_Summary_${analysis.id.slice(-6)}.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate DOCX" },
      { status: 500 },
    );
  }
}
