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

/** Les routes dont une seule en échec rend le site inutilisable pour un visiteur. */
const PAGES = [
  "/fr",
  "/en",
  "/fr/automatisation",
  "/fr/logiciel-metier",
  "/fr/depannage",
  "/en/automation",
  "/en/custom-software",
  "/en/it-support",
  "/fr/legal",
  "/en/legal",
];
const ENDPOINTS = ["/robots.txt", "/sitemap.xml", "/api/availability"];

const failures = [];
const note = (message) => failures.push(message);

const worker = spawn(
  "pnpm",
  ["exec", "opennextjs-cloudflare", "preview", "--", "--port", String(PORT)],
  { stdio: ["ignore", "pipe", "pipe"] },
);

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

  for (const path of [...PAGES, ...ENDPOINTS]) {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) note(`${path} → HTTP ${res.status}`);
  }

  const home = await (await fetch(`${BASE}/fr`)).text();
  if (!home.includes("<h1")) note("/fr ne contient aucun <h1>");

  /* La clé Turnstile est figée dans le bundle au moment du build : construite sans elle, la page
     part en production avec `siteKey:""`, le widget ne se monte jamais et aucune réservation ne
     peut partir — sans la moindre erreur. On lit donc le HTML servi, sans rien supposer de l'env. */
  if (home.includes('siteKey:""') || home.includes('"siteKey":""'))
    note(
      'le HTML servi porte `siteKey:""` : le build n\'avait pas NEXT_PUBLIC_TURNSTILE_SITE_KEY, aucune réservation ne partira',
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
      `Contrôle de fumée passé : ${PAGES.length} pages et ${ENDPOINTS.length} routes servies par workerd.`,
    );
  }
} finally {
  worker.kill("SIGTERM");
}
