import React from "react";

export interface WelcomeEmailProps {
  name?: string;
  appUrl?: string;
}

export function WelcomeEmail({ name = "there", appUrl = "https://clarifex.app" }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#0f172a", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#7c3aed", margin: "0", fontSize: "28px" }}>CLARIFEX</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Clarity out of legal complexity</p>
      </div>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
        <h2>Welcome to Clarifex, {name}!</h2>
        <p>You now have access to a production-grade, GenAI-powered legal assistant built to demystify complex agreements and protect your interests.</p>
        <ul>
          <li><strong>ELI-5 / ELI-10 / Expert Mode:</strong> Instant readability for any audience.</li>
          <li><strong>Risk Heat-Map:</strong> Colour-coded clause scoring for hidden hazards.</li>
          <li><strong>Clause DNA Fingerprint:</strong> Detect boilerplate patterns across contracts.</li>
          <li><strong>Obligation Timeline:</strong> Gantt timeline of upcoming contract deadlines.</li>
        </ul>
        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}>
          <a
            href={`${appUrl}/dashboard`}
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
            Go to Your Dashboard
          </a>
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "24px" }}>
        © 2026 Clarifex Inc. All rights reserved.
      </p>
    </div>
  );
}
