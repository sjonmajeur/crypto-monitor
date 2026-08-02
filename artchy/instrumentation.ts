/**
 * Draait één keer bij het starten van de server.
 *
 * Payload maakt zijn tabellen alleen automatisch aan buiten productie.
 * Daarom zetten we bij een lege database het schema hier klaar met
 * payload/schema.sql; daarna vult Payload zelf de standaardteksten.
 * Bestaat de database al, dan gebeurt er niets.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.DATABASE_URI) return;

  try {
    const [{ Pool }, { readFile }, path] = await Promise.all([
      import("pg"),
      import("node:fs/promises"),
      import("node:path"),
    ]);

    const pool = new Pool({ connectionString: process.env.DATABASE_URI });
    try {
      const bestaat = await pool.query(
        "select to_regclass('public.users') is not null as aanwezig",
      );
      if (bestaat.rows[0]?.aanwezig) return;

      const sql = await readFile(
        path.join(process.cwd(), "payload", "schema.sql"),
        "utf8",
      );
      await pool.query(sql);
      console.log("[db-setup] Database ingericht voor het adminpaneel.");
    } finally {
      await pool.end();
    }
  } catch (error) {
    // De website blijft werken op de standaardteksten.
    console.error(
      "[db-setup] Database inrichten mislukt:",
      error instanceof Error ? error.message : error,
    );
  }
}
