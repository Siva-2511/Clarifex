import { describe, it, expect } from "vitest";
import { validateFileMagicBytes } from "@/lib/security/fileValidator";

describe("File Validator Magic Byte Detection", () => {
  it("should validate legitimate PDF files", () => {
    // %PDF-1.4 header
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const result = validateFileMagicBytes(pdfBuffer, "application/pdf");
    expect(result.valid).toBe(true);
    expect(result.detectedType).toBe("application/pdf");
  });

  it("should reject spoofed PDF files with executable or wrong header", () => {
    // MZ header (exe) renamed as .pdf
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const result = validateFileMagicBytes(exeBuffer, "application/pdf");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("magic bytes do not match %PDF");
  });

  it("should validate legitimate DOCX files with PK zip header", () => {
    // PK\x03\x04
    const docxBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
    const result = validateFileMagicBytes(docxBuffer, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    expect(result.valid).toBe(true);
  });

  it("should validate PNG image files", () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const result = validateFileMagicBytes(pngBuffer, "image/png");
    expect(result.valid).toBe(true);
    expect(result.detectedType).toBe("image/png");
  });

  it("should reject files larger than 10MB", () => {
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
    const result = validateFileMagicBytes(largeBuffer, "application/pdf");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("10MB");
  });
});
