import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Packer,
} from "docx";

export async function generateDocxExport(
  analysis: any,
  documentNames: string[] = [],
): Promise<Buffer> {
  const result = analysis.resultJson || {};
  const clauses = result.clauses || [];
  const checklist = result.checklist || [];

  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Clause / Risk", bold: true })] })],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Analysis & Rationale", bold: true })] })],
        }),
      ],
    }),
    ...clauses.map(
      (c: any) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: `[${(c.riskLevel || "MED").toUpperCase()}] `, bold: true }),
                    new TextRun(c.title || "Clause"),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: `"${c.text}"\n`, italics: true })] }),
                new Paragraph({ children: [new TextRun(c.reason || "")] }),
              ],
            }),
          ],
        }),
    ),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Clarifex — Legal AI Assessment Report",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Target Documents: ${documentNames.join(", ") || "Contract Document"}\n` }),
              new TextRun({ text: `Overall Risk Score: ${analysis.riskScore || "N/A"} / 10.0\n` }),
              new TextRun({ text: `Analysis Date: ${new Date().toLocaleDateString()}\n\n` }),
            ],
          }),
          new Paragraph({
            text: "Executive Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun(result.summary || "No summary available.")],
          }),
          new Paragraph({
            text: "Risk Heat-Map & Clauses",
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({
            text: "Actionable Checklist",
            heading: HeadingLevel.HEADING_2,
          }),
          ...checklist.map(
            (item: any) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [
                  new TextRun({ text: `[${item.importance?.toUpperCase() || "TODO"}] `, bold: true }),
                  new TextRun({ text: `${item.label}: `, bold: true }),
                  new TextRun(item.explanation || ""),
                ],
              }),
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: "\nDisclaimer: Clarifex is an AI legal assistant and does not replace formal legal counsel.",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
