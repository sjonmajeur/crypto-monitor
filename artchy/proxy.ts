import { NextResponse, type NextRequest } from "next/server";

/**
 * Staat de sandbox uit, dan bestaat /sandbox niet: harde 404 op
 * proxy-niveau (vóór rendering), zodat ook de statuscode klopt.
 * Eén codepad — geen aparte build.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/sandbox") &&
    process.env.NEXT_PUBLIC_SANDBOX !== "true"
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // Adminpaneel zonder database: nette uitleg in plaats van een 500.
  if (pathname.startsWith("/admin") && !process.env.DATABASE_URI) {
    return new NextResponse(ADMIN_SETUP_PAGE, {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

const ADMIN_SETUP_PAGE = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Adminpaneel nog niet ingesteld — ARTCHY</title>
<style>
 body{margin:0;background:#0a0a0a;color:#fff;font:16px/1.6 system-ui,sans-serif;
      display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
 main{max-width:34rem} h1{font-size:1.5rem;margin:0 0 .5rem;text-transform:uppercase}
 p{color:#9a968e} code{color:#c9a24b;background:#141414;padding:2px 6px}
 ol{color:#9a968e} a{color:#c9a24b}
</style></head><body><main>
<h1>Adminpaneel nog niet ingesteld</h1>
<p>Het beheerpaneel heeft een database nodig. Die is nog niet gekoppeld.</p>
<ol>
 <li>Voeg in Railway een <strong>Postgres</strong>-database toe aan dit project.</li>
 <li>Zet bij de website-service de variabele <code>DATABASE_URI</code> op de
     connectiestring van die database.</li>
 <li>Zet ook <code>PAYLOAD_SECRET</code> (een lange, willekeurige tekst).</li>
 <li>Klik op <strong>Redeploy</strong> en open daarna opnieuw <code>/admin</code>.</li>
</ol>
<p>De website zelf werkt gewoon door: <a href="/">terug naar de site</a>.</p>
</main></body></html>`;

export const config = {
  matcher: ["/sandbox/:path*", "/admin/:path*"],
};
