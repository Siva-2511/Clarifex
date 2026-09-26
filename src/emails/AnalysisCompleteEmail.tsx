import React from "react";

export interface AnalysisCompleteEmailProps {
  documentName: string;
  riskScore: number;
  viewUrl: string;
}

export function AnalysisCompleteEmail({
  documentName,
  riskScore,
  viewUrl,
}: AnalysisCompleteEmailProps) {
  const isHighRisk = riskScore >= 7;

  return (
    <div style={{ fontFamily: "sans-serif", color: "#0f172a", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ color: "#7c3aed", margin: "0", fontSize: "28px" }}>CLARIFEX</h1>
        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Analysis Notification</p>
      </div>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
        <h2>Analysis Complete: {documentName}</h2>
        <p>Your contract has been analyzed across all dimensions: risk heat-map, obligation timeline, and clause DNA.</p>
        <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: isHighRisk ? "#fee2e2" : "#f0fdf4", marginBottom: "20px" }}>
          <p style={{ margin: "0", fontWeight: "bold", color: isHighRisk ? "#b91c1c" : "#15803d" }}>
            Risk Score: {riskScore} / 10.0 ({isHighRisk ? "Action Required - High Risk" : "Low to Moderate Risk"})
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}>
          <a
            href={viewUrl}
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
            View Interactive Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
