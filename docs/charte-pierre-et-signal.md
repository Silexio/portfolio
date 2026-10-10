# Charte Silexio — « La pierre et le signal »

Direction artistique du site silexio.be, arrêtée le 2026-10-09. Ce document est la référence :
il contient tout ce qu'il faut pour refaire la charte à l'identique, y compris les mesures.

Canevas de référence (rendu vivant, clair et sombre) :
<https://claude.ai/artifact/A5LUBEqGwVxJisSUwQPQsf>
Comparaison des trois directions étudiées avant celle-ci :
<https://claude.ai/artifact/4FK9xcMPGL4hmy45g69YXF>

---

## 1. Le concept

Le nom porte la direction. **Silex** : le premier outil taillé par l'homme, matière chaude,
arêtes vives, cassure conchoïdale. **IO** : l'entrée et la sortie, l'informatique.

> Le site n'a pas de couleur. Il est en pierre chaude le jour, en graphite la nuit.
> Une seule chose s'allume : l'étincelle. On frappe la pierre, elle crache une braise.

La signature de la marque n'est pas une teinte, c'est **une règle**. Décision prise après mesure :
la bande orange est saturée par neuf marques mondiales entre 28° et 65° de teinte OKLCH
(Netflix 28,0° · HubSpot 35,1° · Anthropic 38,8° · SoundCloud 38,8° · Home Depot 43,3° ·
Firefox 45,2° · Hermès 46,5° · Blender 53,5° · Amazon 64,6°). Cinq oranges candidats généraux
pour Silexio tombaient tous à moins de 3° d'une marque existante. **On ne peut pas être
distinctif par la teinte** ; on l'est par la discipline — comme le blanc d'Apple.

Deux pièges à ne jamais rouvrir :

- **Crème + terre cuite** = l'identité d'un éditeur d'IA. C'est d'où vient le projet, c'est le
  reproche initial du client.
- **Bleu-gris** = le défaut de tous les studios de développement. Un pansement posé en octobre
  2026 avant cette charte, retiré pour cette raison.

---

## 2. Les jetons

Déclarés une seule fois dans `app/globals.css`, section 01. Le thème sombre redéfinit les mêmes
noms sous `[data-theme="dark"]`. Miroir hors CSS (emails, manifeste, barre du navigateur) :
`lib/brand.ts` — seul endroit du projet où un hex vit en TypeScript.

### Thème clair — pierre chaude

| Jeton | Hex | Rôle |
|---|---|---|
| `--bg` | `#efebe7` | le papier |
| `--surface` | `#e5e0da` | panneaux, cartes |
| `--raised` | `#faf8f6` | champs, surfaces hautes |
| `--border` | `#d5cec7` | filet décoratif |
| `--border-strong` | `#7b736c` | contour de composant (WCAG 1.4.11) |
| `--heading` | `#1b1816` | titres |
| `--text` | `#342f2b` | corps |
| `--muted` | `#605952` | secondaire |
| `--accent` | `#1b1816` | aplats d'action — encre |
| `--accent-hover` | `#000000` | survol |
| `--accent-ink` | `#1b1816` | texte et liens d'accent, focus |
| `--on-accent` | `#efebe7` | texte posé sur un aplat d'accent |
| `--spark` | `#ffb020` | **l'étincelle** |
| `--arris-light` | `#ffffff` | face éclairée d'une arête |
| `--arris-dark` | `#cfc7bf` | face d'ombre d'une arête |
| `--error` | `#9a2a1e` | |
| `--success` | `#26614a` | |

### Thème sombre — graphite chaud

| Jeton | Hex |
|---|---|
| `--bg` | `#181512` |
| `--surface` | `#201c18` |
| `--raised` | `#282420` |
| `--border` | `#322d28` |
| `--border-strong` | `#7f776f` |
| `--heading` | `#efebe6` |
| `--text` | `#d4cec8` |
| `--muted` | `#a09890` |
| `--accent` | `#e8e3dc` |
| `--accent-hover` | `#ffffff` |
| `--accent-ink` | `#e8e3dc` |
| `--on-accent` | `#181512` |
| `--spark` | `#ffb020` (identique) |
| `--arris-light` | `#383229` |
| `--arris-dark` | `#0d0b09` |
| `--error` | `#f0a192` |
| `--success` | `#7fcfa8` |

### Pourquoi ce fond est chaud sans être crème

L'écart entre la composante rouge et la composante bleue du fond vaut **8** sur 255.
Le crème de l'ancienne charte était à 13 — chaud *et* jaune, c'est ce qui faisait « IA ».
Le gris du pansement était à 5 — froid, générique. 8, c'est de la pierre.

### Contrastes mesurés

Formule WCAG 2.x appliquée aux hex. Aucune paire sous son seuil.

| Paire | Clair | Sombre | Seuil |
|---|---|---|---|
| Texte sur fond | 11,15 | 11,66 | 4,5 |
| Texte sur surface | 10,08 | 10,85 | 4,5 |
| Secondaire, pire cas | 5,25 | 5,42 | 4,5 |
| Accent en texte, pire cas | 13,46 | 12,98 | 4,5 |
| Texte sur bouton | 14,89 | 14,25 | 4,5 |
| Étincelle sur le bouton encre | 9,66 | — | 3,0 |
| Contour de champ | 3,55 | 3,85 | 3,0 |

Procédure : composer l'alpha sur le fond opaque parent avant de comparer. `getComputedStyle`
seul ne suffit pas quand un fond est semi-transparent.

---

## 3. La règle de l'étincelle

`--spark` est la seule couleur du site. Elle obéit à trois interdits, et c'est ce qui l'empêche
de dériver en « accent orange » :

1. **Jamais de texte en étincelle.** Sur la pierre claire elle tombe à 1,54:1.
2. **Jamais d'aplat en étincelle.** Pas de fond de bouton, pas de fond de pastille.
3. **Jamais de frontière de composant portée par elle seule.** Si un élément en étincelle doit
   délimiter quelque chose, il porte en plus un filet encre.

Elle n'apparaît qu'à deux endroits, soit environ 1 % de la surface :

- **Le flanc frappé du bouton principal** — 3 px, posés par `.btn::before` en ombre interne,
  donc clippés par le pan coupé comme le fond l'est.
- **Le balayage de la marque** — voir § 5.

En liseré décoratif de 3 px sur un plateau clair (thème sombre), elle est admise : elle ne porte
aucune information et la frontière du bouton est déjà assurée par le plateau lui-même.

---

## 4. La taille — l'effet creusé

Deux gestes inverses, et rien d'autre. **Lumière fixe en haut à gauche**, qui est la convention
du dessin archéologique : c'est elle qui fait qu'une page entière se lit comme une seule matière.

```css
/* une facette se soulève — boutons, cartes surélevées */
box-shadow: inset 1px 1px 0 var(--arris-light), inset -1px -1px 0 var(--arris-dark);

/* une gorge se creuse — champs, zones de saisie */
box-shadow: inset 1px 1px 0 var(--arris-dark), inset -1px -1px 0 var(--arris-light);
```

Règles non négociables :

- **1 px, jamais flouté.** La moindre ombre douce fait basculer dans le neumorphisme.
- **Deux angles seulement** : 45° pour les petits coins, et **1:2 (26,57°)** pour les arêtes
  longues — c'est la pente d'un négatif d'éclat réel, long et surbaissé. C'est ce qui sépare
  « taillé » de « rectangle à encoche ».
- **L'arête se mérite.** Elle ne va que sur ce qui est interactif ou surélevé ; ailleurs le ton
  de surface et l'espace suffisent. Sans cette règle, tout brille et plus rien ne ressort.
- Le pan coupé reste peint par `.btn::before` et **jamais** par un `clip-path` sur le bouton :
  posé sur l'élément, il rognerait le contour de focus clavier.

---

## 5. La marque

Vecteur à 16 facettes réparties en quatre groupes de tons (`--mark-1` à `--mark-4`), écrit une
seule fois dans `<MarkSprite />` et instancié par `<use href="#silexio-mark">`.

Le balayage de braise est une bande en dégradé `--spark`, détourée par le tracé lui-même via
`clipPath` + `use`, et déplacée par un `transform: translateX` — une seule propriété, composée
par le GPU, zéro JavaScript.

**Il vit dans l'instance, pas dans le `<symbol>`** : le CSS n'entre pas dans l'arbre fantôme d'un
`<use>`, donc une animation déclarée au-dehors n'y arriverait jamais. C'est aussi pourquoi les
remplissages des facettes sont posés en `style` en ligne et non par un sélecteur de classe.

- Joue **une fois à l'arrivée**, 2,2 s après un délai de 0,7 s.
- Au repos, la bande est parquée hors du cadre, donc invisible.
- Sous `prefers-reduced-motion`, elle ne joue pas — l'animation est déclarée *dans*
  `@media (prefers-reduced-motion: no-preference)`, jamais annulée après coup.
- Les facettes ne bougent pas : c'est la lumière qui passe, pas la pierre qui s'agite.

---

## 6. Les composants

| Composant | Traitement |
|---|---|
| Bouton principal | Plateau `--accent` à pan coupé, arête soulevée, 3 px d'étincelle sur le flanc gauche, texte `--on-accent` |
| Bouton secondaire | Lien `--accent-ink` souligné, `text-underline-offset: 4px` |
| Carte | `--surface`, pan coupé, arête soulevée seulement si elle est interactive |
| Champ | `--raised`, 1,5 px `--border-strong`, gorge creusée |
| Focus | 2 px `--accent-ink`, `outline-offset: 3px` — 14,89:1 en clair, 12,98:1 en sombre |
| Séparateur de section | Espace, pas de filet |

---

## 7. Typographie

Inchangée par cette charte. **Montserrat** pour les titres et le wordmark, **Luciole** pour tout
le reste — dessinée pour les lecteurs malvoyants et dyslexiques, c'est un choix d'accessibilité
assumé et elle ne se remplace pas.

Les deux familles sont auto-hébergées et sous-échantillonnées dans `app/fonts/`, procédure dans
son `README.md`. Aucune police n'est téléchargée au build.

Piège connu : `.display` impose `line-height: 1.1` alors que la boîte naturelle de Montserrat
fait 1,219 em. `overflow-clip-margin: 0.16em` étend la zone de clip sans toucher à la mise en
page. À revérifier **en image** après tout changement de police : `getBoundingClientRect` ignore
`overflow-clip-margin`.

---

## 8. Mouvement

Le projet n'a **aucune bibliothèque d'animation**. Tout est keyframe CSS ; le seul JavaScript
restant est un IntersectionObserver de huit lignes dans le script inline du layout.

Le mouvement est **activé** sous `@media (prefers-reduced-motion: no-preference)`, il n'est pas
désactivé après coup : une animation ajoutée plus tard ne peut donc pas laisser un bloc invisible
chez quelqu'un qui a demandé moins de mouvement.

Barème mesuré sur ce projet, à opposer à toute demande de bibliothèque :
**75 Ko de JavaScript ≈ 0,4 s de LCP simulé mobile ≈ 8 points de score Lighthouse.**
Motion avait été retiré pour cette raison (74 Ko transférés, une hydratation par instance).
Tout ce que porte cette charte — effet creusé, balayage de la marque, survols — est faisable
en CSS natif. Une bibliothèque ne se justifierait que pour un geste physique (glisser-lâcher
inertiel), confinée à un îlot chargé après le premier rendu, et mesurée avant/après.

---

## 9. Où ça vit dans le code

| Quoi | Fichier |
|---|---|
| Tous les jetons, les deux thèmes | `app/globals.css`, section 01 |
| Système d'arêtes, bouton, champs | `app/globals.css`, sections 04 et 13 |
| Balayage de la marque | `app/globals.css` section 05 + `components/ui/Mark.tsx` |
| Couleurs hors CSS (emails, manifeste, `theme-color`) | `lib/brand.ts` |
| Illustrations | `components/art/` — SVG serveur, zéro couleur en dur |

Règle de fond : **aucune valeur de design en dur** dans une règle ou un composant. Si une valeur
manque, c'est un jeton à ajouter.

---

## 10. Ce qui reste ouvert

- **Le wordmark** est composé en Montserrat. À décider : le laisser composé, ou le redessiner en
  tracé SVG une fois pour toutes — le tracé survit à tout changement de police et ne coûte aucun
  glyphe au sous-ensemble.
- **Spiennes.** Les minières néolithiques de Spiennes, dans le Hainaut, sont le plus vaste
  ensemble de mines de silex d'Europe, inscrites à l'UNESCO (n° 1006, en 2000), et le musée sur
  place s'appelle SILEX'S. On n'y vendait pas du caillou : on y produisait des haches et des
  lames, l'outil fini qui fait gagner du temps. C'est un atout de récit et de référencement
  local. À trancher : une ligne explicite dans `ABOUT`, ou rien de visible et Spiennes ne reste
  que la source du vocabulaire graphique. La distance exacte depuis Chapelle-lez-Herlaimont est
  à vérifier avant publication ; seule la province est confirmée.
- **Les illustrations** (`DomainArt`, `OfferGlyph`, `ChoreMap`) suivent les jetons, donc elles
  héritent de la peau. Leur passage au vocabulaire taillé — volumes à facettes plutôt que
  contours — n'est pas fait et représente le vrai budget de la refonte.
