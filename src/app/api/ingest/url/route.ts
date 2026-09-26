import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchLegalPage } from "@/lib/ingestion/urlFetcher";
import crypto from "crypto";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const text = await fetchLegalPage(url);
    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Page content appears empty or blocked by cloud protection" },
        { status: 422 },
      );
    }

    const hostname = new URL(url).hostname;
    const docName = `WebTerms_${hostname}_${Date.now()}.txt`;
    const checksum = crypto.createHash("sha256").update(text).digest("hex");

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        name: docName,
        type: "url",
        storageKey: `urls/${session.user.id}/${Date.now()}_${hostname}.txt`,
        sizeBytes: Buffer.byteLength(text, "utf8"),
        checksum,
        extractedText: text,
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
    console.error("URL Ingestion Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch and process legal URL" },
      { status: 400 },
    );
  }
}
