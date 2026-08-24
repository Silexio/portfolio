/**
 * Préchauffe les routes avant la première assertion.
 *
 * Le webServer des tests est `next dev`, qui compile à la demande : sans ce passage, les
 * premiers workers attaquent des routes non compilées et la modale de réservation attend
 * la compilation de `/api/availability` — plus, si un agenda est configuré, un aller-retour
 * réseau vers celui-ci. Le premier test échouait pour cette seule raison.
 */
async function globalSetup() {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
  for (const path of ["/fr", "/en", "/api/availability"]) {
    await fetch(`${base}${path}`).catch(() => {});
  }
}

export default globalSetup;
