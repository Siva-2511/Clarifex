import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 10,
  },
  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7c3aed",
    marginBottom: 4,
  },
  subbrand: {
    fontSize: 9,
    color: "#64748b",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 16,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 2,
  },
  summaryText: {
    lineHeight: 1.4,
    color: "#334155",
  },
  clauseCard: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    backgroundColor: "#f8fafc",
  },
  clauseHigh: {
    borderLeftColor: "#ef4444",
  },
  clauseMed: {
    borderLeftColor: "#f59e0b",
  },
  clauseLow: {
    borderLeftColor: "#10b981",
  },
  clauseTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  clauseQuote: {
    fontStyle: "italic",
    color: "#475569",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
  },
});

export const AnalysisPdfDocument = ({
  analysis,
  documentNames = [],
}: {
  analysis: any;
  documentNames?: string[];
}) => {
  const result = analysis.resultJson || {};
  const clauses = result.clauses || [];
  const checklist = result.checklist || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>CLARIFEX</Text>
          <Text style={styles.subbrand}>Clarity out of legal complexity — Comprehensive Legal AI Assessment</Text>
          <Text style={styles.title}>Contract Analysis Report</Text>
          <View style={styles.metaRow}>
            <Text>Target: {documentNames.join(", ") || "Contract Document"}</Text>
            <Text>Risk Score: {analysis.riskScore || "N/A"}/10</Text>
            <Text>Level: {analysis.comprehensionLevel || "standard"}</Text>
            <Text>Date: {new Date(analysis.createdAt || Date.now()).toLocaleDateString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Executive Summary</Text>
        <Text style={styles.summaryText}>{result.summary || "No summary provided."}</Text>

        <Text style={styles.sectionTitle}>2. Key Risk Heat-Map & Clauses</Text>
        {clauses.map((c: any, i: number) => {
          const cardStyle = [
            styles.clauseCard,
            c.riskLevel === "high"
              ? styles.clauseHigh
              : c.riskLevel === "medium"
                ? styles.clauseMed
                : styles.clauseLow,
          ];
          return (
            <View key={i} style={cardStyle}>
              <Text style={styles.clauseTitle}>
                [{c.riskLevel?.toUpperCase()}] {c.title} (Page {c.pageRef || 1})
              </Text>
              <Text style={styles.clauseQuote}>{`"${c.text}"`}</Text>
              <Text style={styles.summaryText}>{c.reason}</Text>
              {c.fingerprint && (
                <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 2 }}>
                  Clause DNA: {c.fingerprint}
                </Text>
              )}
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>3. Critical Pre-Execution Checklist</Text>
        {checklist.map((item: any, i: number) => (
          <View key={i} style={{ marginTop: 4 }}>
            <Text style={{ fontWeight: "bold" }}>
              • [{item.importance?.toUpperCase() || "TODO"}] {item.label}
            </Text>
            <Text style={{ color: "#64748b", marginLeft: 10 }}>{item.explanation}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Clarifex Legal AI Assistant • Informational analysis only • Does not replace legal counsel
        </Text>
      </Page>
    </Document>
  );
};

export async function renderPdfToBuffer(analysis: any, documentNames: string[] = []): Promise<Buffer> {
  const doc = <AnalysisPdfDocument analysis={analysis} documentNames={documentNames} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
