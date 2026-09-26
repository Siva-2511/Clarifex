import dns from "dns/promises";
import { URL } from "url";

const PRIVATE_IP_REGEX = [
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 127.0.0.0/8
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
  /^192\.168\.\d{1,3}\.\d{1,3}$/, // 192.168.0.0/16
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // Cloud metadata / link-local
  /^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^::1$/, // IPv6 loopback
  /^fc00:/, // IPv6 private
  /^fe80:/, // IPv6 link-local
];

export function isPrivateIp(ip: string): boolean {
  return PRIVATE_IP_REGEX.some((regex) => regex.test(ip));
}

/**
 * Validates a URL against SSRF attacks and Google Safe Browsing
 */
export async function validateUrlSafety(urlStr: string): Promise<{ safe: boolean; error?: string }> {
  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { safe: false, error: "Only http and https protocols are supported" };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return { safe: false, error: "Access to internal hostnames is prohibited (SSRF prevention)" };
    }

    // Resolve DNS and check resolved IP
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (isPrivateIp(addr.address)) {
        return {
          safe: false,
          error: `URL resolves to private or restricted network address (${addr.address})`,
        };
      }
    }

    // Check with Google Safe Browsing API if key is available
    const safeBrowsingKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (safeBrowsingKey) {
      try {
        const response = await fetch(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client: {
                clientId: "clarifex-app",
                clientVersion: "1.0.0",
              },
              threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: urlStr }],
              },
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.matches && data.matches.length > 0) {
            return {
              safe: false,
              error: `URL flagged as unsafe by Google Safe Browsing: ${data.matches[0].threatType}`,
            };
          }
        }
      } catch (err) {
        console.warn("Safe Browsing API check skipped due to network error:", err);
      }
    }

    return { safe: true };
  } catch (err) {
    return { safe: false, error: `Invalid URL format: ${(err as Error).message}` };
  }
}

/**
 * Fetches content from a URL with SSRF protection, 5-second timeout, and HTML text stripping
 */
export async function fetchLegalPage(urlStr: string): Promise<string> {
  const safetyCheck = await validateUrlSafety(urlStr);
  if (!safetyCheck.safe) {
    throw new Error(safetyCheck.error || "URL is not safe to fetch");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(urlStr, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ClarifexLegalAssistantBot/1.0 (+https://clarifex.app)",
        Accept: "text/html,application/xhtml+xml,text/plain",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch page: HTTP status ${res.status}`);
    }

    const html = await res.text();

    // Strip HTML tags and normalize whitespace
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}
