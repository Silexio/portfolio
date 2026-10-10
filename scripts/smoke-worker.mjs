import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

/**
 * Contrôle de fumée dans workerd, le runtime réel de la production.
 *
 * `pnpm lint`, `pnpm test` et `pnpm build` étaient tous verts le jour où le site entier a répondu
 * 404 : ils vérifient le code et le build de Next, jamais ce que le Worker sert vraiment. Une mise
 * à jour de Next avait cassé le service des pages prérendues par l'adaptateur Cloudflare, et rien
 * ne pouvait le voir avant la mise en ligne. Ce script sert ce qui sera déployé et le relit.
 */

const PORT = 8788;
const BASE = `http://localhost:${PORT}`;
const BOOT_TIMEOUT_MS = 180_000;

/** Routes techniques, les seules à connaître d'avance : tout le reste vient du sitemap. */
const ENDPOINTS = ["/robots.txt", "/sitemap.xml", "/api/availability"];

/**
 * Les pages à servir viennent du sitemap du site lui-même, pas d'une liste recopiée : une page
 * ajoutée est couverte sans qu'on y pense, et un slug renommé ne laisse pas le contrôle valider
 * des chemins qui n'existent plus.
 */
async function sitemapPaths() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return urls.map((url) => new URL(url).pathname);
}

const failures = [];
const note = (message) => failures.push(message);

const worker = spawn(
  "pnpm",
  ["exec", "opennextjs-cloudflare", "preview", "--", "--port", String(PORT)],
  {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
    // Wrangler pose une question sur l'envoi de statistiques au premier lancement : sans réponse,
    // il attend indéfiniment là où personne ne peut taper.
    env: { ...process.env, WRANGLER_SEND_METRICS: "false", CI: "true" },
  },
);

/** Arrête le groupe entier, pas seulement le `pnpm` de surface. */
function stopWorker() {
  try {
    process.kill(-worker.pid, "SIGTERM");
  } catch {
    worker.kill("SIGTERM");
  }
}

let log = "";
for (const stream of [worker.stdout, worker.stderr])
  stream.on("data", (chunk) => {
    log += chunk;
  });

async function reachable() {
  try {
    await fetch(`${BASE}/robots.txt`);
    return true;
  } catch {
    return false;
  }
}

async function waitForWorker() {
  const deadline = Date.now() + BOOT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await reachable()) return true;
    await wait(2000);
  }
  return false;
}

try {
  if (!(await waitForWorker())) {
    console.error(log.slice(-3000));
    throw new Error(`workerd n'a pas démarré en ${BOOT_TIMEOUT_MS / 1000} s`);
  }

  const pages = await sitemapPaths();
  if (pages.length === 0) note("le sitemap ne liste aucune page");

  for (const path of [...pages, ...ENDPOINTS]) {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) note(`${path} → HTTP ${res.status}`);
  }

  const home = await (await fetch(`${BASE}/fr`)).text();
  if (!home.includes("<h1")) note("/fr ne contient aucun <h1>");

  /* La réservation ne part que si le widget peut se monter, donc si la page porte une vraie clé.
     Vérifier sa *présence* reste vrai quelle que soit sa provenance — l'environnement du build ou
     le repli de `lib/turnstile.ts` ; chercher `siteKey:""` ne prouverait plus rien depuis que ce
     repli existe. */
  if (!/siteKey\\?":\\?"[^"\\]+/.test(home))
    note(
      "le HTML servi ne porte aucune clé Turnstile : aucune demande ne partira",
    );

  for (const symptom of ["NoFallbackError", "WebAssembly.compile"])
    if (log.includes(symptom)) note(`le runtime a signalé « ${symptom} »`);

  if (failures.length > 0) {
    console.error(`\nContrôle de fumée en échec :`);
    for (const failure of failures) console.error(`  - ${failure}`);
    console.error(`\n--- fin du journal workerd ---\n${log.slice(-2000)}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Contrôle de fumée passé : ${pages.length} pages et ${ENDPOINTS.length} routes servies par workerd.`,
    );
  }
} finally {
  stopWorker();
  process.exit(process.exitCode ?? 0);
}
