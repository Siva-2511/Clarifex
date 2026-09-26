import { describe, it, expect } from "vitest";

// ─── Accessibility Helper Utilities ──────────────────────────────────────────

/**
 * Generate a stable ARIA ID for form field associations.
 * @param prefix - Component prefix (e.g., "login", "upload")
 * @param field  - Field name (e.g., "email", "password")
 */
function ariaId(prefix: string, field: string): string {
  return `${prefix}-${field}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

/**
 * Resolve an accessible label for a risk badge.
 * Screen readers need descriptive text, not just colour-coded dots.
 */
function riskBadgeAriaLabel(riskLevel: string, clauseName: string): string {
  return `${clauseName}: ${riskLevel} risk`;
}

/**
 * Determine whether a colour contrast ratio meets WCAG AA (4.5:1 minimum).
 * @param ratio - Contrast ratio as a decimal (e.g., 4.52)
 */
function meetsWcagAA(ratio: number): boolean {
  return ratio >= 4.5;
}

/**
 * Determine whether a colour contrast ratio meets WCAG AAA (7:1 minimum).
 */
function meetsWcagAAA(ratio: number): boolean {
  return ratio >= 7.0;
}

/**
 * Build a keyboard-accessible skip-link href.
 */
function skipLinkHref(targetId: string): string {
  return `#${targetId}`;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Accessibility Utilities", () => {
  describe("ariaId", () => {
    it("generates kebab-case ARIA ID", () => {
      expect(ariaId("login", "email")).toBe("login-email");
    });

    it("lowercases the result", () => {
      expect(ariaId("Upload", "FileName")).toBe("upload-filename");
    });

    it("replaces invalid characters with hyphens", () => {
      expect(ariaId("form_v2", "field@name")).toBe("form-v2-field-name");
    });
  });

  describe("riskBadgeAriaLabel", () => {
    it("produces readable label for screen readers", () => {
      const label = riskBadgeAriaLabel("high", "Indemnification Clause");
      expect(label).toBe("Indemnification Clause: high risk");
    });

    it("works for low risk", () => {
      expect(riskBadgeAriaLabel("low", "Termination")).toBe("Termination: low risk");
    });
  });

  describe("WCAG contrast helpers", () => {
    it("passes WCAG AA at ratio 4.5", () => {
      expect(meetsWcagAA(4.5)).toBe(true);
    });

    it("fails WCAG AA below 4.5", () => {
      expect(meetsWcagAA(4.49)).toBe(false);
    });

    it("passes WCAG AAA at ratio 7.0", () => {
      expect(meetsWcagAAA(7.0)).toBe(true);
    });

    it("fails WCAG AAA at ratio 6.99", () => {
      expect(meetsWcagAAA(6.99)).toBe(false);
    });
  });

  describe("skipLinkHref", () => {
    it("prepends # to target ID", () => {
      expect(skipLinkHref("main-content")).toBe("#main-content");
    });
  });
});
