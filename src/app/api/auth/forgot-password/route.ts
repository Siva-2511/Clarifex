import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSignedToken } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/email/resend";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      const token = generateSignedToken(normalizedEmail, 1000 * 60 * 60); // 1 hr
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${token}`;

      await sendEmail({
        to: normalizedEmail,
        subject: "Reset your Clarifex password",
        html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
      });

      await logAuditEvent({
        userId: user.id,
        action: "user.password_reset_request",
        resource: normalizedEmail,
      });
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
