import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { analysisId, email } = await req.json();
    if (!analysisId || !email) {
      return NextResponse.json({ error: "analysisId and email are required" }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.collaboration.create({
      data: {
        analysisId,
        inviteeEmail: email.toLowerCase().trim(),
        accessToken: token,
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteUrl = `${appUrl}/dashboard/analyse/${analysisId}?token=${token}`;

    await sendEmail({
      to: email,
      subject: `[Clarifex] Invitation to collaborate on contract analysis`,
      html: `<p>${session.user.name || "A user"} invited you to review a contract analysis on Clarifex.</p><p><a href="${inviteUrl}">Click here to view the analysis</a></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
