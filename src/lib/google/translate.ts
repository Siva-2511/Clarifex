/**
 * Google Translate API v2 client for auto-translating legal analysis outputs
 */
export async function translateText(
  text: string,
  targetLanguage: string,
): Promise<{ translatedText: string; sourceLanguage: string }> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_TRANSLATE_API_KEY not configured. Returning original text.");
    return {
      translatedText: text,
      sourceLanguage: "en",
    };
  }

  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: "text",
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`Google Translate error: ${res.statusText}`);
    }

    const data = await res.json();
    const translation = data.data?.translations?.[0];

    return {
      translatedText: translation?.translatedText || text,
      sourceLanguage: translation?.detectedSourceLanguage || "auto",
    };
  } catch (error) {
    console.error("Translation error:", error);
    return { translatedText: text, sourceLanguage: "en" };
  }
}
