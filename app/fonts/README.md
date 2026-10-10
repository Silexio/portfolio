# Polices

Les deux familles sont auto-hébergées et **sous-échantillonnées**. Ne pas remplacer un `.woff2`
par le fichier d'origine : il pèse 2 à 3 fois plus et se charge en priorité `High` au premier paint,
ce qui dégrade directement le LCP mobile.

| Fichier                        | Famille                                          | Graisses    | Licence     | Source                                   |
| ------------------------------ | ------------------------------------------------ | ----------- | ----------- | ---------------------------------------- |
| `Montserrat-Variable.woff2`    | Montserrat — titres et wordmark (`--font-title`) | axe 500-600 | SIL OFL 1.1 | https://github.com/JulietaUla/Montserrat |
| `Luciole-{Regular,Bold}.woff2` | Luciole — tout le reste (`--font-body`)          | 400, 700    | CC BY 4.0   | https://www.luciole-vision.com           |

Les mentions de copyright restent dans la table `name` de chaque fichier (`nameID 0`).

Inter, Fira Code et les italiques de Luciole ont été retirées avec la charte A3 : le texte courant,
les libellés et les champs sont tous en Luciole, et la charte réserve l'insistance au gras — jamais
d'italique ni de capitales. `Luciole-Bold` sert aux libellés de formulaire, aux boutons et au gras.

## Régénérer

Prérequis : `pip install "fonttools[woff]" brotli`.

Montserrat est dérivée du sous-ensemble `latin` que l'API Google Fonts livre — une police variable
couvrant l'axe `wght` 100-900 alors que le site n'emploie que deux graisses. Deux étapes : borner
l'axe, puis sous-échantillonner.

```sh
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD'
FEAT='kern,liga,clig,ccmp,mark,mkmk,locl'

# 1. borner l'axe des graisses
python -m fontTools.varLib.instancer source.woff2 'wght=500:600' -o instance.ttf

# 2. jeu latin, features utiles seulement, sans hinting
pyftsubset instance.ttf --output-file=Montserrat-Variable.woff2 --flavor=woff2 \
  --unicodes="$LATIN" --layout-features="$FEAT" --no-hinting --drop-tables+=FFTM
```

Luciole part des fichiers d'origine du fondeur et ne passe que par l'étape 2, avec `latin` **plus**
`latin-ext` — le corps de texte reçoit des noms saisis dans le formulaire de réservation :

```sh
EXT='U+0100-017F,U+0180-024F,U+1E00-1EFF,U+20A0-20CF,U+2113,U+2C60-2C7F'
pyftsubset Luciole-Regular.woff2 --output-file=Luciole-Regular.woff2 --flavor=woff2 \
  --unicodes="$LATIN,$EXT" --layout-features="$FEAT" --no-hinting --drop-tables+=FFTM
```

## Après régénération

Vérifier qu'aucun caractère rendu ne manque au jeu — le contrôle se fait sur les quatre pages
statiques, pas à l'œil :

```js
// dans la console, sur /fr puis /en, /fr/legal, /en/legal
[...new Set(document.body.innerText)]
  .filter((c) => c.charCodeAt(0) > 31)
  .join("");
```

Le seul caractère volontairement absent est `★` (U+2605) : Luciole ne l'a jamais contenu, il est
rendu par la police de repli depuis toujours.
