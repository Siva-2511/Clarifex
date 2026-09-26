import pdf from "pdf-parse";

export interface ParsedPdfResult {
  text: string;
  pageCount: number;
  metadata: {
    title?: string;
    author?: string;
    producer?: string;
    creationDate?: string;
  };
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdfResult> {
  const data = await pdf(buffer);
  return {
    text: data.text.replace(/\r\n/g, "\n").trim(),
    pageCount: data.numpages || 1,
    metadata: {
      title: data.info?.Title || undefined,
      author: data.info?.Author || undefined,
      producer: data.info?.Producer || undefined,
      creationDate: data.info?.CreationDate || undefined,
    },
  };
}
