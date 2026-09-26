export type GTMEvent =
  | { event: "document_uploaded"; fileType: string; sizeBytes: number }
  | { event: "analysis_started"; documentCount: number; comprehensionLevel: string }
  | { event: "analysis_completed"; analysisId: string; riskScore: number; modelUsed: string }
  | { event: "eli_mode_changed"; analysisId: string; level: string }
  | { event: "export_clicked"; format: "pdf" | "docx" | "markdown" | "gmail" }
  | { event: "share_created"; analysisId: string }
  | { event: "checklist_item_toggled"; category: string; checked: boolean };

export function pushGtmEvent(eventData: GTMEvent) {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(eventData);
  }
}
