import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limit check on authentication endpoints
  if (pathname.startsWith("/api/auth") && request.method === "POST") {
    const rateCheck = await rateLimit(`auth:${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before trying again.",
          retryAfter: rateCheck.reset,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.reset),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": String(rateCheck.remaining),
          },
        },
      );
    }
  }

  // Dashboard route protection
  if (pathname.startsWith("/dashboard")) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/auth/:path*",
    "/api/upload/:path*",
    "/api/ocr/:path*",
    "/api/ai/:path*",
  ],
};
