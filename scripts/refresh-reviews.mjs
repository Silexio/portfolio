#!/usr/bin/env node
/**
 * Relève la note Google publique et l'écrit dans lib/reviews.json.
 *
 * Deux usages, le même fichier écrit :
 *   node scripts/refresh-reviews.mjs                      → interroge l'API Places
 *   node scripts/refresh-reviews.mjs --rating 5 --count 7 → pose les chiffres lus à l'œil
 *
 * L'API demande GOOGLE_PLACES_API_KEY et GOOGLE_PLACE_ID. Les champs `rating` et
 * `userRatingCount` basculent la requête dans le palier Enterprise de Places API (New) :
 * 1 000 appels gratuits par mois, soit très au-delà d'un relevé hebdomadaire.
 * Référence : developers.google.com/maps/documentation/places/web-service/place-details
 *
 * Code de sortie 0 si le fichier est à jour (modifié ou déjà bon), 1 si le relevé a échoué :
 * un relevé raté ne doit jamais écrire un chiffre inventé par-dessus un chiffre vrai.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const TARGET = join(dirname(fileURLToPath(import.meta.url)), "../lib/reviews.json");
const ENDPOINT = "https://places.googleapis.com/v1/places";

function readFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    flags[argv[i].slice(2)] = argv[i + 1];
  }
  return flags;
}

/**
 * Refuse tout ce qui n'est pas une note plausible. La conversion ne passe pas par `Number()`
 * seul : `Number(null)` vaut 0, donc une fiche sans note aurait écrit « 0 sur 0 avis » par-dessus
 * un chiffre vrai, sans la moindre erreur. Seuls un nombre, ou la chaîne venue de la ligne de
 * commande, sont acceptés.
 */
export function readingFrom(rating, count) {
  const score = typeof rating === "string" ? Number(rating) : rating;
  const total = typeof count === "string" ? Number(count) : count;
  if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 5)
    throw new RangeError(`note hors de [0, 5] : ${rating}`);
  if (typeof total !== "number" || !Number.isInteger(total) || total < 0)
    throw new RangeError(`nombre d'avis invalide : ${count}`);
  return {
    rating: Math.round(score * 10) / 10,
    count: total,
    checkedOn: new Date().toISOString().slice(0, 10),
  };
}

async function fromPlacesApi(placeId, apiKey) {
  const response = await fetch(`${ENDPOINT}/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount",
    },
  });
  if (!response.ok)
    throw new Error(`Places API ${response.status} ${await response.text()}`);
  const place = await response.json();
  return readingFrom(place.rating, place.userRatingCount);
}

async function main() {
  const flags = readFlags(process.argv.slice(2));
  let reading;
  try {
    if (flags.rating !== undefined) {
      reading = readingFrom(flags.rating, flags.count);
    } else {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      const placeId = process.env.GOOGLE_PLACE_ID;
      if (!apiKey || !placeId) {
        console.error(
          "Il manque GOOGLE_PLACES_API_KEY et GOOGLE_PLACE_ID.\n" +
            "Sans eux, posez le relevé à la main : --rating 5 --count 7",
        );
        return 1;
      }
      reading = await fromPlacesApi(placeId, apiKey);
    }
  } catch (error) {
    console.error(`Relevé abandonné, le fichier n'a pas bougé : ${error.message}`);
    return 1;
  }

  const current = JSON.parse(readFileSync(TARGET, "utf8"));
  const before = current.google;
  if (before.rating === reading.rating && before.count === reading.count) {
    console.log(`Inchangé : ${before.rating} sur ${before.count} avis.`);
    return 0;
  }

  current.google = reading;
  writeFileSync(TARGET, `${JSON.stringify(current, null, 2)}\n`);
  console.log(
    `Mis à jour : ${before.rating} (${before.count} avis) → ${reading.rating} (${reading.count} avis).`,
  );
  return 0;
}

// Importé par un test, ce module ne doit rien exécuter ni rien écrire.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  process.exit(await main());
