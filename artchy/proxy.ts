import { NextResponse, type NextRequest } from "next/server";

/**
 * Staat de sandbox uit, dan bestaat /sandbox niet: harde 404 op
 * proxy-niveau (vóór rendering), zodat ook de statuscode klopt.
 * Eén codepad — geen aparte build.
 */
export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/sandbox") &&
    process.env.NEXT_PUBLIC_SANDBOX !== "true"
  ) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/sandbox/:path*",
};
