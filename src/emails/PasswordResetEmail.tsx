import React from "react";

export interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#0f172a", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#7c3aed", margin: "0", fontSize: "28px" }}>CLARIFEX</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Security Notice</p>
      </div>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password for your Clarifex account.</p>
        <p>Click the secure button below to set a new password. This link is valid for 1 hour.</p>
        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
          <a
            href={resetUrl}
            style={{
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Reset Password
          </a>
        </div>
        <p style={{ fontSize: "13px", color: "#64748b" }}>
          If you did not request this password reset, please ignore this email or contact support.
        </p>
      </div>
    </div>
  );
}
