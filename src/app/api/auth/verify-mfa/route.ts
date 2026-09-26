import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyTotpToken } from "@/lib/auth/mfa";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token } = await req.json();
    if (!token || token.length !== 6) {
      return NextResponse.json({ error: "6-digit token is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.mfaSecret) {
      return NextResponse.json({ error: "MFA not configured" }, { status: 400 });
    }

    const isValid = verifyTotpToken(token, user.mfaSecret);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    await logAuditEvent({
      userId: user.id,
      action: "mfa.enabled",
      resource: "totp.session.verified",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MFA verification error:", error);
    return NextResponse.json({ error: "Failed to verify MFA" }, { status: 500 });
  }
}
