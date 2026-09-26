import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "user.login"
  | "user.logout"
  | "user.register"
  | "user.failed_login"
  | "user.password_reset_request"
  | "user.password_reset_success"
  | "mfa.enabled"
  | "mfa.disabled"
  | "document.upload"
  | "document.view"
  | "document.delete"
  | "analysis.start"
  | "analysis.complete"
  | "analysis.export_pdf"
  | "analysis.export_docx"
  | "analysis.share";

export async function logAuditEvent(params: {
  userId?: string | null;
  action: AuditAction;
  resource: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        resource: params.resource,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    // Audit logging should never bring down the primary application
    console.error("Failed to log audit event:", error);
    return null;
  }
}
