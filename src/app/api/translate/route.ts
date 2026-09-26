import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { translateText } from "@/lib/google/translate";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, targetLanguage } = await req.json();
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and targetLanguage are required" },
        { status: 400 },
      );
    }

    const result = await translateText(text, targetLanguage);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Translation route error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Translation failed" },
      { status: 500 },
    );
  }
}
