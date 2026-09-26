import crypto from "crypto";

/**
 * Normalizes legal clause text by lowercasing, stripping punctuation,
 * and collapsing whitespace, then generates a SHA-256 hash fingerprint.
 */
export function generateClauseFingerprint(clauseText: string): string {
  if (!clauseText) return "";

  const normalized = clauseText
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

/**
 * Compares two clause fingerprints or texts for structural similarity
 */
export function calculateBoilerplateMatch(
  textA: string,
  textB: string,
): { match: boolean; similarity: number } {
  const hashA = generateClauseFingerprint(textA);
  const hashB = generateClauseFingerprint(textB);

  if (hashA === hashB && hashA !== "") {
    return { match: true, similarity: 1.0 };
  }

  // Token-based Jaccard similarity for near-identical clauses
  const tokensA = new Set(
    textA
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean),
  );
  const tokensB = new Set(
    textB
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean),
  );

  if (tokensA.size === 0 || tokensB.size === 0) {
    return { match: false, similarity: 0 };
  }

  let intersectionCount = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  });

  const unionCount = tokensA.size + tokensB.size - intersectionCount;
  const similarity = Math.round((intersectionCount / unionCount) * 100) / 100;

  return {
    match: similarity >= 0.85,
    similarity,
  };
}
