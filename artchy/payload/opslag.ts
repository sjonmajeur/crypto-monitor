/**
 * Instellingen voor de S3-compatibele bucket (Railway Object Storage).
 *
 * Waarom deze laag bestaat: de plugin geeft de waarde van
 * BUCKET_ENDPOINT ongewijzigd door aan de AWS-SDK én plakt de publieke
 * URL samen als `${endpoint}/${bucket}/${bestand}`. Eén tikfout in die
 * variabele levert daardoor twee heel verschillende fouten op:
 *
 * - zonder "https://" gooit de SDK "Invalid URL" en mislukt de upload
 *   met de nietszeggende melding "Something went wrong.";
 * - mét de bucketnaam erin komt die naam twee keer in de URL en zijn de
 *   foto's wel geüpload maar niet zichtbaar.
 *
 * We repareren beide vormen hier, zodat de variabele in Railway op de
 * "logische" manier ingevuld mag worden.
 */

export const bucketNaam = process.env.BUCKET_NAME?.trim() || "media";

/** Endpoint zonder schema, zonder slash op het eind, zonder bucketnaam. */
export function bucketEndpoint(): string | undefined {
  const ruw = process.env.BUCKET_ENDPOINT?.trim();
  if (!ruw) return undefined;

  // Schema toevoegen als het ontbreekt: de SDK eist een volledige URL.
  let waarde = /^https?:\/\//i.test(ruw) ? ruw : `https://${ruw}`;
  waarde = waarde.replace(/\/+$/, "");

  // Is de bucketnaam per ongeluk meegekopieerd, haal hem er dan af:
  // met forcePathStyle zet de SDK die er zelf achter.
  const achtervoegsel = `/${bucketNaam}`;
  if (waarde.toLowerCase().endsWith(achtervoegsel.toLowerCase())) {
    waarde = waarde.slice(0, -achtervoegsel.length);
  }

  return waarde;
}

/**
 * Regio. Railway levert er één; "auto" (de waarde van Cloudflare R2)
 * laat de handtekening bij een MinIO-achtige opslag mislukken, dus die
 * gebruiken we niet meer als terugval.
 */
export function bucketRegio(): string {
  return (
    process.env.BUCKET_REGION?.trim() ||
    process.env.AWS_REGION?.trim() ||
    "us-east-1"
  );
}

/**
 * Hostnaam waar de foto's vandaan komen. next/image weigert beelden van
 * een host die niet in de configuratie staat, dus leiden we hem bij
 * voorkeur af uit het endpoint zelf: dat is per definitie de host waar
 * de plugin naar linkt.
 */
export function bucketHostnaam(): string | undefined {
  const opgegeven = process.env.BUCKET_PUBLIC_HOSTNAME?.trim();
  if (opgegeven) return opgegeven.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");

  const endpoint = bucketEndpoint();
  if (!endpoint) return undefined;
  try {
    return new URL(endpoint).hostname;
  } catch {
    return undefined;
  }
}

/**
 * Volledige clientconfiguratie voor de S3-SDK — één plek, gebruikt door
 * zowel het CMS (payload.config.ts) als het diagnose-endpoint
 * (/api/opslag-test), zodat die twee gegarandeerd hetzelfde testen.
 *
 * De twee checksum-instellingen zijn essentieel voor S3-compatibele
 * opslag zoals die van Railway (MinIO-achtig): sinds versie 3.729
 * stuurt de AWS-SDK standaard bij elke upload een CRC32-checksum mee
 * ("data integrity protections") en verwacht die ook terug. AWS zelf
 * kan dat; veel S3-compatibele diensten niet, en dan mislukt elke
 * upload. "WHEN_REQUIRED" herstelt het oude gedrag: alleen checksums
 * waar S3 dat echt eist.
 */
export function bucketClientConfig() {
  return {
    endpoint: bucketEndpoint(),
    region: bucketRegio(),
    credentials: {
      accessKeyId: process.env.BUCKET_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY ?? "",
    },
    // Railway verwacht de bucket in het pad (endpoint/bucket/bestand),
    // niet als subdomein.
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED" as const,
    responseChecksumValidation: "WHEN_REQUIRED" as const,
  };
}

/**
 * Veilige samenvatting van de opslaginstellingen voor logs en het
 * diagnose-endpoint. Bevat bewust géén sleutels.
 */
export function bucketOverzicht() {
  return {
    endpoint: bucketEndpoint() ?? "(niet ingesteld)",
    bucket: bucketNaam,
    regio: bucketRegio(),
    forcePathStyle: true,
    accessKeyAanwezig: Boolean(process.env.BUCKET_ACCESS_KEY_ID?.trim()),
    secretAanwezig: Boolean(process.env.BUCKET_SECRET_ACCESS_KEY?.trim()),
  };
}

/**
 * Haalt uit een AWS-SDK-fout de bruikbare details (zonder secrets):
 * foutcode, HTTP-status en de kale melding.
 */
export function s3FoutDetails(error: unknown) {
  const e = error as {
    name?: string;
    message?: string;
    Code?: string;
    $metadata?: { httpStatusCode?: number; attempts?: number };
  };
  return {
    fout: e?.name ?? "onbekend",
    code: e?.Code ?? null,
    httpStatus: e?.$metadata?.httpStatusCode ?? null,
    pogingen: e?.$metadata?.attempts ?? null,
    melding: e?.message ?? String(error),
  };
}

/** Zijn alle gegevens aanwezig om te kunnen uploaden? */
export function bucketCompleet(): boolean {
  return Boolean(
    bucketEndpoint() &&
      process.env.BUCKET_ACCESS_KEY_ID?.trim() &&
      process.env.BUCKET_SECRET_ACCESS_KEY?.trim(),
  );
}
