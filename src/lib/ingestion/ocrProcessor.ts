export interface OcrResult {
  text: string;
  confidence: number; // 0.0 - 1.0
  wordCount: number;
}

export async function processScreenshotOcr(imageBuffer: Buffer): Promise<OcrResult> {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_CLOUD_API_KEY is not configured");
  }

  const base64Image = imageBuffer.toString("base64");

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Cloud Vision API failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const annotation = data.responses?.[0]?.fullTextAnnotation;

  if (!annotation || !annotation.text) {
    return {
      text: "",
      confidence: 0,
      wordCount: 0,
    };
  }

  // Calculate average confidence from pages/blocks/paragraphs/words if present
  let totalConfidence = 0;
  let blockCount = 0;

  for (const page of annotation.pages || []) {
    for (const block of page.blocks || []) {
      if (typeof block.confidence === "number") {
        totalConfidence += block.confidence;
        blockCount++;
      }
    }
  }

  const avgConfidence = blockCount > 0 ? totalConfidence / blockCount : 0.95;
  const words = annotation.text.trim().split(/\s+/).filter(Boolean);

  return {
    text: annotation.text.trim(),
    confidence: Math.round(avgConfidence * 100) / 100,
    wordCount: words.length,
  };
}
