import { describe, it, expect } from "vitest";
import { isPrivateIp, validateUrlSafety } from "@/lib/ingestion/urlFetcher";

describe("SSRF Protection & URL Safety", () => {
  it("should identify private IP addresses accurately", () => {
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("10.0.0.5")).toBe(true);
    expect(isPrivateIp("172.16.0.1")).toBe(true);
    expect(isPrivateIp("172.31.255.255")).toBe(true);
    expect(isPrivateIp("192.168.1.1")).toBe(true);
    expect(isPrivateIp("169.254.169.254")).toBe(true); // AWS/cloud metadata
    expect(isPrivateIp("::1")).toBe(true);

    expect(isPrivateIp("8.8.8.8")).toBe(false);
    expect(isPrivateIp("104.26.10.15")).toBe(false);
  });

  it("should reject localhost and internal hostnames", async () => {
    const localhostCheck = await validateUrlSafety("http://localhost:3000/admin");
    expect(localhostCheck.safe).toBe(false);
    expect(localhostCheck.error).toContain("internal hostnames");

    const internalCheck = await validateUrlSafety("https://server.internal/metrics");
    expect(internalCheck.safe).toBe(false);
  });

  it("should reject non-HTTP/HTTPS protocols", async () => {
    const ftpCheck = await validateUrlSafety("ftp://example.com/file");
    expect(ftpCheck.safe).toBe(false);
    expect(ftpCheck.error).toContain("protocols");

    const fileCheck = await validateUrlSafety("file:///etc/passwd");
    expect(fileCheck.safe).toBe(false);
  });
});
