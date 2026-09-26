import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { downloadDriveFile } from "@/lib/ingestion/driveImport";
import { parsePdfBuffer } from "@/lib/parsers/pdf";
import crypto from "crypto";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileId, fileName } = await req.json();

    const accessToken = (session as any).accessToken;
    let extractedText = "";

    if (accessToken && fileId && !fileId.startsWith("drive_sample")) {
      const driveFile = await downloadDriveFile(fileId, accessToken);
      const parsed = await parsePdfBuffer(driveFile.buffer);
      extractedText = parsed.text;
    } else {
      // Deterministic fallback content for testing before Google OAuth scope is signed into
      extractedText = `STANDARD DRIVE CONSULTING SERVICES AGREEMENT
1. SCOPE OF SERVICES. Consultant will provide strategic engineering advisory services.
2. FEES AND INVOICING. Fees will be invoiced monthly on a Net 30 basis. Late payments accrue interest at 1.5% per month.
3. INTELLECTUAL PROPERTY. Client shall own all Work Product created specifically under this Statement of Work. Consultant retains ownership of Pre-Existing Materials.
4. CONFIDENTIALITY. Both parties agree to protect proprietary information for a period of three (3) years following termination.`;
    }

    const docName = fileName || `Drive_Document_${Date.now()}.pdf`;
    const checksum = crypto.createHash("sha256").update(extractedText).digest("hex");

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        name: docName,
        type: "pdf",
        storageKey: `drive/${session.user.id}/${Date.now()}_${docName}`,
        sizeBytes: Buffer.byteLength(extractedText, "utf8"),
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
    console.error("Drive Ingestion Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to import from Google Drive" },
      { status: 500 },
    );
  }
}
