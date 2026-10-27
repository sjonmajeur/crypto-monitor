import { NextResponse, type NextRequest } from "next/server";

/**
 * Staat de sandbox uit, dan bestaat /sandbox niet: harde 404 op
 * proxy-niveau (vóór rendering), zodat ook de statuscode klopt.
 * Eén codepad — geen aparte build.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Onderhoudsmodus: met ONDERHOUD=true ziet iedereen de
  // "We zijn zo bij je terug"-pagina. Alleen de eigenaar komt erdoor
  // (via /eigenaar inloggen zet een ondertekende toegangscookie).
  if (process.env.ONDERHOUD === "true" && !isVrijTijdensOnderhoud(pathname)) {
    const cookie = request.cookies.get(ONDERHOUD_COOKIE)?.value;
    if (!cookie || cookie !== (await onderhoudToken())) {
      return new NextResponse(ONDERHOUD_PAGE, {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "retry-after": "86400",
          "cache-control": "no-store",
        },
      });
    }
  }

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

export const ONDERHOUD_COOKIE = "artchy-onderhoud";

/** Wat tijdens onderhoud altijd bereikbaar blijft. */
function isVrijTijdensOnderhoud(pathname: string): boolean {
  return (
    pathname.startsWith("/eigenaar") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/users/login") ||
    /\.(png|jpe?g|svg|ico|webp|woff2?)$/i.test(pathname)
  );
}

/** Ondertekende waarde van de toegangscookie, afgeleid van het geheim. */
export async function onderhoudToken(): Promise<string> {
  const data = new TextEncoder().encode(
    `${process.env.PAYLOAD_SECRET ?? ""}:onderhoud-eigenaar`,
  );
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ONDERHOUD_PAGE = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>We zijn zo bij je terug — ARTCHY</title>
<link rel="icon" href="/logo-kroon.png">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400&display=swap" rel="stylesheet">
<style>
 *{box-sizing:border-box}
 body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
      padding:24px;background:#0a0a0a;color:#fff;
      font:16px/1.6 Inter,system-ui,-apple-system,sans-serif;text-align:center}
 main{max-width:36rem}
 img{width:96px;height:auto;margin:0 auto 32px;display:block}
 .label{font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:#c9a24b;margin:0}
 h1{margin:16px 0;font-family:Anton,Impact,"Arial Narrow",sans-serif;font-weight:400;
    font-size:clamp(2.5rem,9vw,4.5rem);line-height:.95;text-transform:uppercase}
 p{color:#9a968e;margin:0}
 .lijn{width:48px;height:1px;background:#2a2a2a;margin:32px auto}
</style></head><body><main>
 <img src="/logo-kroon.png" alt="ARTCHY">
 <p class="label">ARTCHY</p>
 <h1>We zijn zo bij je terug</h1>
 <p>We werken achter de schermen aan de site. Kom snel weer kijken.</p>
 <div class="lijn"></div>
 <p class="label" style="color:#9a968e">Where imagination becomes identity</p>
</main></body></html>`;

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
  // Alles behalve de statische Next-bestanden; de onderhoudsmodus moet
  // elke pagina kunnen afvangen.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
