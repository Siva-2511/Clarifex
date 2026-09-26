import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { processScreenshotOcr } from "@/lib/ingestion/ocrProcessor";
import { validateFileMagicBytes } from "@/lib/security/fileValidator";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file exceeds 5MB limit for OCR" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateFileMagicBytes(buffer, file.type);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const ocrResult = await processScreenshotOcr(buffer);

    return NextResponse.json(ocrResult);
  } catch (error) {
    console.error("OCR API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process image OCR" },
      { status: 500 },
    );
  }
}
