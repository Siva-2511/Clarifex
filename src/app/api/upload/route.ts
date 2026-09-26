import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPresignedUploadUrl } from "@/lib/storage/r2";
import { validateFileMagicBytes } from "@/lib/security/fileValidator";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileName, fileType, fileSize } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 },
      );
    }

    if (fileSize && fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    const { uploadUrl, storageKey } = await getPresignedUploadUrl(
      session.user.id,
      fileName,
      fileType,
    );

    return NextResponse.json({ uploadUrl, storageKey });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 },
    );
  }
}
