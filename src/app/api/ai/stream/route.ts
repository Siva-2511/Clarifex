import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { callAI } from "@/lib/ai/openrouter";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt, analysisId, systemPrompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Verify analysis ownership if analysisId provided
    if (analysisId) {
      const analysis = await prisma.analysis.findFirst({
        where: { id: analysisId, userId: session.user.id },
      });
      if (!analysis) {
        return NextResponse.json({ error: "Analysis not found or unauthorized" }, { status: 403 });
      }
    }

    const aiResult = await callAI({
      prompt,
      systemPrompt,
      stream: true,
      preferredModel: "google/gemini-flash-1.5",
    });

    if (aiResult.stream) {
      return new Response(aiResult.stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Fallback if provider didn't return stream
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: aiResult.text })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Stream route error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to stream AI response" },
      { status: 500 },
    );
  }
}
