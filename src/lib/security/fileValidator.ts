export interface ValidationResult {
  valid: boolean;
  detectedType?: string;
  error?: string;
}

export function validateFileMagicBytes(buffer: Buffer, declaredType: string): ValidationResult {
  if (!buffer || buffer.length < 4) {
    return { valid: false, error: "File buffer is too small or empty" };
  }

  // 10 MB cap check
  if (buffer.length > 10 * 1024 * 1024) {
    return { valid: false, error: "File exceeds 10MB maximum size limit" };
  }

  // PDF magic bytes: 0x25 0x50 0x44 0x46 (%PDF)
  const isPdf =
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46;

  // ZIP / DOCX magic bytes: 0x50 0x4B 0x03 0x04 (PK..)
  const isZipOrDocx =
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04;

  // PNG magic bytes: 0x89 0x50 0x4E 0x47
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;

  // JPEG magic bytes: 0xFF 0xD8 0xFF
  const isJpeg =
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  // WEBP magic bytes: RIFF....WEBP
  const isWebp =
    buffer.length >= 12 &&
    buffer.toString("utf-8", 0, 4) === "RIFF" &&
    buffer.toString("utf-8", 8, 12) === "WEBP";

  const lowerDeclared = declaredType.toLowerCase();

  if (lowerDeclared.includes("pdf")) {
    return isPdf
      ? { valid: true, detectedType: "application/pdf" }
      : { valid: false, error: "Invalid PDF file: magic bytes do not match %PDF" };
  }

  if (
    lowerDeclared.includes("word") ||
    lowerDeclared.includes("docx") ||
    lowerDeclared.includes("officedocument")
  ) {
    return isZipOrDocx
      ? { valid: true, detectedType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      : { valid: false, error: "Invalid DOCX file: magic bytes do not match ZIP/DOCX format" };
  }

  if (lowerDeclared.includes("png")) {
    return isPng
      ? { valid: true, detectedType: "image/png" }
      : { valid: false, error: "Invalid PNG file: magic bytes mismatch" };
  }

  if (lowerDeclared.includes("jpeg") || lowerDeclared.includes("jpg")) {
    return isJpeg
      ? { valid: true, detectedType: "image/jpeg" }
      : { valid: false, error: "Invalid JPEG file: magic bytes mismatch" };
  }

  if (lowerDeclared.includes("webp")) {
    return isWebp
      ? { valid: true, detectedType: "image/webp" }
      : { valid: false, error: "Invalid WEBP file: magic bytes mismatch" };
  }

  if (lowerDeclared.includes("text/plain") || lowerDeclared.includes("txt")) {
    // UTF-8 check for text
    const isBinary = buffer.slice(0, 1024).some((byte) => byte === 0);
    return !isBinary
      ? { valid: true, detectedType: "text/plain" }
      : { valid: false, error: "Text file contains invalid binary content" };
  }

  return { valid: false, error: `Unsupported or unverified file type: ${declaredType}` };
}
