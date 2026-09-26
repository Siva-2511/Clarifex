import mammoth from "mammoth";

export interface ParsedDocxResult {
  text: string;
  html: string;
}

export async function parseDocxBuffer(buffer: Buffer): Promise<ParsedDocxResult> {
  const [textResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ buffer }),
    mammoth.convertToHtml({ buffer }),
  ]);

  return {
    text: textResult.value.replace(/\r\n/g, "\n").trim(),
    html: htmlResult.value,
  };
}
