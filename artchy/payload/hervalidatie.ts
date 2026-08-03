/**
 * Publiceren = direct live: na elke wijziging in het CMS worden de
 * geraakte pagina's opnieuw opgebouwd, zodat de verandering binnen
 * seconden zichtbaar is zonder harde refresh.
 *
 * Buiten een request (bijv. tijdens het vullen bij de eerste start)
 * kan hervalideren niet; dan slaan we het stil over — de pagina's
 * lezen toch per bezoek.
 */
export async function hervalideer(onderdeel: string): Promise<void> {
  try {
    const { revalidatePath } = await import("next/cache");

    switch (onderdeel) {
      case "homepage":
        revalidatePath("/");
        break;
      case "paginas":
        revalidatePath("/about");
        revalidatePath("/taji");
        break;
      case "artiesten":
        revalidatePath("/");
        revalidatePath("/artists");
        break;
      // Menu, footer en beelden staan overal: alles verversen.
      case "site-instellingen":
      case "media":
        revalidatePath("/", "layout");
        break;
      default:
        revalidatePath("/", "layout");
    }
  } catch {
    // Geen request-context (seed/init) of caching uitgeschakeld: prima.
  }
}
