import { describe, it, expect } from "vitest";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalise a document name by trimming whitespace and lowercasing.
 * Used before Algolia indexing to produce consistent search tokens.
 */
function normaliseDocName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Truncate extracted text to a maximum length for safe AI prompting.
 * Avoids exceeding model token budgets.
 */
function truncateForPrompt(text: string, maxChars = 12000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n…[truncated]";
}

/**
 * Sanitise a storage key to prevent path traversal attacks.
 */
function sanitiseStorageKey(key: string): string {
  return key.replace(/\.\.\//g, "").replace(/\/\//g, "/");
}

/**
 * Derive a risk level label from a numeric score (0–100).
 */
function riskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score < 25) return "low";
  if (score < 50) return "medium";
  if (score < 75) return "high";
  return "critical";
}

/**
 * Compute overall risk score as a weighted average of clause scores.
 */
function weightedRiskScore(scores: number[], weights: number[]): number {
  if (scores.length === 0 || scores.length !== weights.length) return 0;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weighted = scores.reduce((sum, s, i) => sum + s * weights[i], 0);
  return Math.round(weighted / totalWeight);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Document Processing Utilities", () => {
  describe("normaliseDocName", () => {
    it("lowercases and trims the name", () => {
      expect(normaliseDocName("  NDA Agreement  ")).toBe("nda agreement");
    });

    it("collapses internal whitespace", () => {
      expect(normaliseDocName("Service  Level   Agreement")).toBe("service level agreement");
    });

    it("handles empty string", () => {
      expect(normaliseDocName("")).toBe("");
    });
  });

  describe("truncateForPrompt", () => {
    it("returns text unchanged if under limit", () => {
      const text = "short text";
      expect(truncateForPrompt(text, 100)).toBe(text);
    });

    it("truncates and appends ellipsis when over limit", () => {
      const text = "a".repeat(200);
      const result = truncateForPrompt(text, 100);
      expect(result).toHaveLength(100 + "\n…[truncated]".length);
      expect(result).toContain("[truncated]");
    });

    it("uses default 12000 char limit", () => {
      const text = "x".repeat(15000);
      const result = truncateForPrompt(text);
      expect(result.startsWith("x".repeat(12000))).toBe(true);
    });
  });

  describe("sanitiseStorageKey", () => {
    it("removes path traversal sequences", () => {
      expect(sanitiseStorageKey("users/../../../etc/passwd")).toBe("users/etc/passwd");
    });

    it("collapses double slashes", () => {
      expect(sanitiseStorageKey("users//siva//doc.pdf")).toBe("users/siva/doc.pdf");
    });

    it("leaves clean keys unchanged", () => {
      expect(sanitiseStorageKey("users/abc/file.pdf")).toBe("users/abc/file.pdf");
    });
  });
});

describe("Risk Scoring Engine", () => {
  describe("riskLevel", () => {
    it("returns low for score < 25", () => {
      expect(riskLevel(0)).toBe("low");
      expect(riskLevel(24)).toBe("low");
    });

    it("returns medium for 25–49", () => {
      expect(riskLevel(25)).toBe("medium");
      expect(riskLevel(49)).toBe("medium");
    });

    it("returns high for 50–74", () => {
      expect(riskLevel(50)).toBe("high");
      expect(riskLevel(74)).toBe("high");
    });

    it("returns critical for 75+", () => {
      expect(riskLevel(75)).toBe("critical");
      expect(riskLevel(100)).toBe("critical");
    });
  });

  describe("weightedRiskScore", () => {
    it("computes correct weighted average", () => {
      expect(weightedRiskScore([80, 40], [3, 1])).toBe(70); // (80*3 + 40*1) / 4 = 70
    });

    it("returns 0 for mismatched array lengths", () => {
      expect(weightedRiskScore([80, 40], [1])).toBe(0);
    });

    it("returns 0 for empty arrays", () => {
      expect(weightedRiskScore([], [])).toBe(0);
    });

    it("handles single element", () => {
      expect(weightedRiskScore([65], [1])).toBe(65);
    });
  });
});
