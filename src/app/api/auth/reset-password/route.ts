import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignedToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    const verification = verifySignedToken(token);
    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { error: verification.error || "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: verification.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await logAuditEvent({
      userId: user.id,
      action: "user.password_reset_success",
      resource: user.email || "user",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
