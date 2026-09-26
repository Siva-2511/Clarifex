import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateFileMagicBytes } from "@/lib/security/fileValidator";
import { parsePdfBuffer } from "@/lib/parsers/pdf";
import { parseDocxBuffer } from "@/lib/parsers/docx";
import crypto from "crypto";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate magic bytes
    const validation = validateFileMagicBytes(buffer, file.type || file.name);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let extractedText = "";
    let docType = "txt";

    if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
      docType = "pdf";
      const parsed = await parsePdfBuffer(buffer);
      extractedText = parsed.text;
    } else if (
      file.name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      docType = "docx";
      const parsed = await parseDocxBuffer(buffer);
      extractedText = parsed.text;
    } else {
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract readable text from document" },
        { status: 422 },
      );
    }

    const checksum = crypto.createHash("sha256").update(extractedText).digest("hex");

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        name: file.name,
        type: docType,
        storageKey: `documents/${session.user.id}/${Date.now()}_${file.name}`,
        sizeBytes: buffer.length,
        checksum,
        extractedText,
      },
    });

    await logAuditEvent({
      userId: session.user.id,
      action: "document.upload",
      resource: document.id,
    });

    return NextResponse.json({
      id: document.id,
      name: document.name,
      text: document.extractedText,
    });
  } catch (error) {
    console.error("File ingestion error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process file" },
      { status: 500 },
    );
  }
}
