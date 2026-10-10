# Repositionnement Silexio — spec

Date : 2026-09-21 · Statut : validé (architecture) · Source : plan commercial « vendre un résultat, pas du code »

## 1. Objectif

Faire de silexio.be un site qui vend un **résultat économique** à des PME wallonnes (5–50 personnes) :
« la tâche que vous refaites chaque semaine peut disparaître ». Le code est le moyen, pas l'offre.

Critères de réussite :

- un patron de PME comprend en un écran ce que Silexio règle et combien ça coûte ;
- la preuve (SCALENEO) est visible avant les tarifs ;
- une demande qualifiée part en moins d'une minute, sans ouvrir de client mail ;
- aucun fait inventé, aucun chiffre non sourcé ;
- plafond de performance et accessibilité préservés (cf. CLAUDE.md § Plafond de performance).

## 2. Décisions (validées)

| Sujet | Décision |
|---|---|
| Architecture | Refonte du one-page + 3 pages dédiées (approche 1) |
| Dépannage IT particuliers | Sorti de la landing → page dédiée, lien discret depuis la landing et le footer |
| Prix | Affichés : Diagnostic 490 € HTVA ferme, « à partir de » pour Sprint (1 500 €), Outil métier (4 500 €), Suivi (150 €/mois) |
| SCALENEO | Étude de cas sur faits vérifiés ; bloc ROI masqué tant que les 3 chiffres client manquent |
| CTA principal | Formulaire court sur la page (tâche, temps perdu, email) ; l'appel reste l'alternative |
| Design | Phase B dans Claude Design, sur le contenu réel ; point de contrôle : choix de la direction |

## 3. Chantiers

| # | Chantier | Livrable |
|---|---|---|
| A | Contenu et structure | Landing réécrite, formulaire, pages dédiées, SEO, page légale — sur le design actuel |
| B | Identité visuelle | 3 directions dans Claude Design → une retenue → design system |
| C | Implémentation visuelle | Tokens et styles du système retenu portés dans `globals.css` |
| D | Pages dédiées | Livrées avec A (même gabarit, contenu propre) |

Hors périmètre : script de prospection BCE, CRM, partenariats, Start IA.

## 4. Landing — ordre et rôle des sections

| # | id | Section | Num | Rôle | Remplace |
|---|---|---|---|---|---|
| 1 | `top` | Hero | — | Promesse de résultat, CTA formulaire + CTA appel | Hero |
| 2 | `solutions` | Ce que je règle | 01 | Automatiser / Connecter / Construire, exemples concrets, lien vers les pages | Packages + panier |
| 3 | `case` | Cas client SCALENEO | 02 | Problème → solution → faits → ROI (masqué si vide) | Slide 1 du carrousel |
| 4 | `offers` | Méthode et tarifs | 03 | Échelle Premier échange → Diagnostic → Sprint → Outil → Suivi | Process épinglé (3,3 écrans) |
| 5 | `about` | Qui je suis | — | Une personne, code livré | About |
| 6 | `proof` | Avis | — | Inchangé (masqué sous `MIN_REVIEWS`) | Proof |
| 7 | `curious` | Pour les curieux | — | Projets personnels + stack, compact | Carrousel + Stack |
| 8 | `faq` | Questions | 04 | Objections B2B | FAQ |
| 9 | `contact` | Montrez-moi la tâche | — | Formulaire + appel + email/WhatsApp | Contact |

Longueur visée : ≈ 10 écrans (13,8 aujourd'hui). À mesurer après implémentation.

Vouvoiement partout (la section Process tutoyait).

## 5. Contrat de données

`lib/data.ts` reste la source du contenu de la landing. Nouveaux blocs :

- `DOMAINS: Domain[]` — `{ id: "automate" | "connect" | "build", title, lead, examples: Bilingual[], service: ServicePageId }`
- `OFFERS: Offer[]` — `{ id: OfferId, name, price: { amount, from, monthly }, body, deliverable }` ; `OfferId = "intro" | "diagnostic" | "sprint" | "tool" | "care"` (`intro` = premier échange gratuit, `amount: 0`)
- `CASE_STUDY` — `{ projectId, client, problem, solution, facts: { value, label }[], roi: { minutesBefore, minutesAfter, reportsPerWeek } (null = masqué), quote: null }`
- `I18N.solutions / caseStudy / offers / curious / lead` ; `I18N.contact` réécrit
- `LEAD_EMAILS` — templates des deux emails du formulaire

Supprimés : `PACKAGES`, `PackageId`, `PROCESS`, `CHAT`, `CHAT_UI`, `I18N.services`, `I18N.work.{prev,next,goTo,position}`.

`lib/services.ts` (nouveau, même exception que `lib/legal.ts`) : contenu des pages dédiées + helpers purs `servicePages()`, `findServicePage(lang, slug)`, `servicePath(page, lang)`.

`lib/roi.ts` (nouveau, pur) : `monthlyHoursSaved(roi)` → `number | null`.

## 6. Formulaire « Montrez-moi la tâche »

Flux : `LeadForm` (client) → `POST /api/leads` → email au propriétaire (replyTo = prospect) + accusé de réception au prospect.

| Champ | Règle |
|---|---|
| `task` | requis, 20–2000 caractères |
| `hours` | `"lt1" | "1to3" | "3to10" | "gt10" | "unknown"`, optionnel (masqué sur `/depannage`) |
| `email` | requis, email valide |
| `source` | `"home" | ServicePageId` — mesure quelle page convertit |
| `locale` | `"fr" | "en"` |
| `company` | honeypot |
| `turnstileToken` | requis |

Serveur : honeypot → Zod → Turnstile → rate limit (réutilise `RateLimitHit`) → envoi. **Pas de stockage D1** : l'email au propriétaire est la trace. Échec de cet envoi → `502 server` (le prospect voit l'erreur et le lien mailto), l'accusé de réception est best-effort. L'accusé de réception **n'écho pas** le texte saisi (pas de relais de spam).

Performance : Turnstile n'est monté qu'au premier focus dans le formulaire — aucun script tiers au chargement de page.

Codes d'erreur alignés sur le booking : `validation` 400, `captcha` 400, `rate_limit` 429, `server` 502.

Destinataire : `BOOKING_NOTIFY_EMAIL`, à défaut `EMAIL`.

## 7. Pages dédiées

Route unique `app/[lang]/[service]/page.tsx`, SSG, `dynamicParams = false`, slugs localisés :

| id | FR | EN | Offres affichées |
|---|---|---|---|
| `automation` | `/fr/automatisation` | `/en/automation` | intro, diagnostic, sprint, care |
| `software` | `/fr/logiciel-metier` | `/en/custom-software` | intro, diagnostic, tool, care |
| `support` | `/fr/depannage` | `/en/it-support` | — (zone d'intervention à la place) |

Gabarit : hero (H1 + lead + CTA) → situations → démarche → offres ou zone → FAQ propre → formulaire (`source` = id de page).
Nav avec `base` + `altPath` vers le slug de l'autre langue.

## 8. SEO

- `META` : title ≤ 60 car. et description ≤ 160 car. orientés automatisation / logiciel métier / PME / Hainaut.
- `/depannage` porte le vocabulaire particulier (dépannage, réseau, sauvegarde…) — les deux vocabulaires restent couverts, sur deux URL.
- `faqStructuredData(lang, entries, path)` : chaque page émet la FAQ qu'elle affiche, et seulement celle-là.
- Pages dédiées : `Service` JSON-LD (provider = `#studio`) + `FAQPage`.
- `hasOfferCatalog` dérivé de `OFFERS`, avec `PriceSpecification` HTVA (`valueAddedTaxIncluded: false`).
- `sitemap.ts` : 3 pages × 2 langues avec alternates.

## 9. Page légale

Nouveau traitement décrit : formulaire de demande (tâche, temps estimé, email, page d'origine), base 6.1.b, transmis par email via Brevo, non stocké sur le site. Booking : retrait des « prestations sélectionnées ». `updatedOn` → 2026-09-21.

## 10. Suppressions

Composants : `Packages`, `PackageCard`, `PackageIcon`, `ContactActions`, `Process`, `ProcessScenes`, `ChatMock`, `Work`, `Carousel`, `Stack` ; hook `usePackages`. Booking : champ `packages` retiré du schéma, de la route, du client et de l'email (la colonne D1 garde son `DEFAULT '[]'`, aucune migration). CSS morte correspondante.

## 11. Tests

- Unit : `lib/leads/schema`, `lib/leads/email`, `lib/roi`, `lib/services` ; tests booking mis à jour (packages).
- E2E : `lead.spec.ts` (validation client, envoi avec `/api/leads` intercepté), `pages.spec.ts` (chaque page statique : un seul `h1`, aucun débordement horizontal) ; `carousel.spec.ts` supprimé ; `booking.spec.ts` inchangé (le bouton « Réserver un appel » reste dans `#contact`).
- Livraison : `pnpm lint && pnpm test && pnpm build`, puis contrôle visuel 375 px + desktop, clair + sombre.

## 12. Phase B — Claude Design

Canevas Design avec trois directions, chacune sur le même contenu réel (hero, une carte « Ce que je règle », faits SCALENEO, échelle de prix), en clair et en sombre :

1. **Silex** (recommandée) — craie / silex / étincelle ; motif des ondes de fracture du dessin lithique ; ancrage Spiennes (minières néolithiques de silex, Mons, UNESCO 2000). Tailler = enlever l'inutile = l'offre.
2. **Plan technique** — papier calque, encre bleu de Prusse, cotes et annotations d'ingénieur.
3. **Wallonie industrielle** — sombre d'abord, brique et charbon, typographie condensée.

Contraintes pour toutes : polices auto-hébergées et sous-échantillonnées, tokens OKLCH clair/sombre, AA mesuré, aucun des clichés relevés (nav pilule en verre, pastille qui pulse, mot italique coloré, grain, crème + terracotta).

## 13. À valider par le propriétaire (non bloquant)

- Énoncé du problème SCALENEO (reconstruit à partir des fonctions de l'outil).
- Conditions de paiement 50/40/10 (issues du plan) publiées en FAQ.
- Les 3 chiffres ROI + une phrase de témoignage à demander au cabinet.
- Photo pour « Qui je suis ».
