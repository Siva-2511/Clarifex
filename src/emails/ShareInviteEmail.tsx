import React from "react";

export interface ShareInviteEmailProps {
  inviterName?: string;
  documentName?: string;
  inviteUrl: string;
}

export function ShareInviteEmail({
  inviterName = "A colleague",
  documentName = "a contract",
  inviteUrl,
}: ShareInviteEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#0f172a", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#7c3aed", margin: "0", fontSize: "28px" }}>CLARIFEX</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Contract Collaboration</p>
      </div>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
        <h2>Collaboration Invitation</h2>
        <p><strong>{inviterName}</strong> has invited you to collaborate in real-time on the legal analysis for <strong>{documentName}</strong>.</p>
        <p>You can review clauses, check obligations, and participate in shared Q&A.</p>
        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}>
          <a
            href={inviteUrl}
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
            Accept Invitation & View Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
