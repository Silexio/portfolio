import { cssVars } from "@/lib/css";

/**
 * Les 16 facettes de la marque Silexio, extraites de public/icon.svg. Le tracé n'est écrit
 * qu'ici : <MarkSprite /> en fait le sprite du document, <MarkFacets /> le rend en clair là où
 * chaque facette doit s'animer séparément — le CSS n'entre pas dans l'arbre fantôme d'un <use>.
 * Les tons viennent des jetons --mark-1 à --mark-4, donc le thème sombre recolore tout sans règle
 * par composant.
 */
/** Les trois volumes du silex. Un plan d'ombre appartient à son volume et ne s'en détache pas. */
const PARTS = [
  { name: "lame gauche", from: 0, to: 6 },
  { name: "lame droite, intérieur", from: 6, to: 10 },
  { name: "lame droite, extérieur", from: 10, to: 15 },
];

const FACETS: { d: string; tone: 1 | 2 | 3 | 4 }[] = [
  {
    d: "M120.367,443.269C120.367,443.269 199.974,343.203 200,307C200.003,303.259 205.756,297.051 210,295C220,290.167 260,282 260,282L289,248C289,248 301.942,210.207 302,210C302.058,209.793 480,25 480,25C359.883,266.554 240.006,405.945 120.367,443.269",
    tone: 1,
  },
  { d: "M480,25L480,1348L20,560L480,25Z", tone: 1 },
  { d: "M420,197L480,1348L20,560L272.805,537.214L420,197Z", tone: 2 },
  { d: "M480,1348L20,560L259,560L480,1348Z", tone: 3 },
  {
    d: "M20,560L84,704C84,704 108.933,726.25 113,733C117.067,739.75 121.068,751.071 121,759C120.932,766.929 187,909 187,909C187,909 204.056,906.967 224,925C246.599,945.434 240,979 240,979C240,979 250.05,994.371 251,996C252.167,998 254.936,1000.723 257,1003C261.833,1008.333 270.784,1010.926 280,1028C289.216,1045.074 282.245,1061.902 288,1071C293.755,1080.098 480,1348 480,1348C354.431,1069.023 230.757,788.932 20,560Z",
    tone: 3,
  },
  {
    d: "M367.186,945.745C369.43,952.883 293,560 293,560L480,26L480,1348C480,1348 369.6,957.868 367.186,945.745Z",
    tone: 4,
  },
  { d: "M550,470L841.267,849.046L550,1348L550,470Z", tone: 3 },
  {
    d: "M550,1348L739,1084C739,1084 751.559,1007.182 761,998C768.19,991.007 806,933 806,933L841,849C701.911,986.474 616.389,1160.678 550,1348Z",
    tone: 3,
  },
  {
    d: "M550,470L841,849L744,849C744,849 658.771,1062.098 658,1064C657.434,1065.396 719,849 719,849L550,470Z",
    tone: 1,
  },
  {
    d: "M646.763,687L719,849C719,849 657.434,1065.396 658,1064C658.771,1062.098 744,849 744,849L841,849L732.962,835.782L646.763,687Z",
    tone: 2,
  },
  {
    d: "M899.702,748.945L550,370.002L550,25L1010,560L899.702,748.945Z",
    tone: 3,
  },
  { d: "M796.702,369.937L550,370.002L550,25L796.702,369.937Z", tone: 4 },
  { d: "M550,25L1010,560L682.055,370L550,25Z", tone: 1 },
  {
    d: "M550,25L662,132C664.248,134.04 676.673,154.899 692,168C709.076,182.596 727.885,199.031 733,208C737.982,216.735 740.006,248.266 751,260C763.163,273.139 789.163,286.028 799,287C808.837,287.972 827.828,295.204 830,298C832.172,300.796 854.368,363.308 858,367C861.632,370.692 1010,560 1010,560C808.587,407.728 656.601,228.665 550,25Z",
    tone: 1,
  },
  {
    d: "M609.712,181L696.892,355.744L863,474.833L682.055,370L609.712,181Z",
    tone: 2,
  },
];

/** La transformation du sprite, aplatie : matrix(0.593591) · translate(-517.5,-686.5). */
const MARK_TRANSFORM = "matrix(0.593591,0,0,0.593591,204.817,104.5)";

/**
 * Le centre du tracé, dans l'espace des `FACETS` ci-dessus — le même point que la translation de
 * MARK_TRANSFORM. `lib/boot.ts` en déduit l'axe de départ de chaque volume : si le tracé change,
 * les deux doivent bouger ensemble, d'où la constante partagée plutôt que deux nombres en dur.
 */
export const MARK_CENTER = { x: 517.5, y: 686.5 };

export function MarkSprite() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      <symbol id="silexio-mark" viewBox="0 0 1024 1024">
        <use href="#silexio-facets" />
      </symbol>
      <g id="silexio-facets">
        {FACETS.map((facet) => (
          <path
            key={facet.d}
            transform={MARK_TRANSFORM}
            d={facet.d}
            style={{ fill: `var(--mark-${facet.tone})` }}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * La marque posée en clair dans un SVG hôte, une facette par <path>, chacune numérotée par `--i`.
 * C'est la seule forme qui permet d'animer les éclats un par un : la pierre se retaille.
 * `size` est le côté du carré occupé, dans les unités du viewBox hôte.
 */
export function MarkFacets({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 1024})`}>
      <g transform={MARK_TRANSFORM}>
        {PARTS.map((part, index) => (
          <g
            key={part.name}
            className="knap__part"
            style={cssVars({ "--i": index })}
            suppressHydrationWarning
          >
            {FACETS.slice(part.from, part.to).map((facet) => (
              <path
                key={facet.d}
                d={facet.d}
                style={{ fill: `var(--mark-${facet.tone})` }}
              />
            ))}
          </g>
        ))}
      </g>
    </g>
  );
}

/**
 * `glint` porte un identifiant de portée, pas un booléen : un serveur de peinture (dégradé) et un
 * clipPath ne traversent pas les frontières de <svg>, ils doivent donc vivre dans l'instance — et
 * leurs identifiants être uniques par instance.
 */
type MarkProps = { className?: string; glint?: string };

/**
 * Marque posée dans la page. `glint` ajoute le balayage de braise : une bande détourée par le
 * tracé lui-même, qui ne peut pas vivre dans le <symbol> — le CSS n'entre pas dans l'arbre
 * fantôme d'un <use>, donc l'animation doit rester dans l'instance.
 */
export function Mark({ className, glint }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      aria-hidden="true"
      focusable="false"
    >
      <use href="#silexio-mark" />
      {glint && (
        <>
          <defs>
            <clipPath id={`silexio-clip-${glint}`}>
              <path transform={MARK_TRANSFORM} d="M480,25L480,1348L20,560Z" />
              <path transform={MARK_TRANSFORM} d="M550,25L1010,560L550,1348Z" />
            </clipPath>
            <linearGradient
              id={`silexio-glint-${glint}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0"
                style={{ stopColor: "var(--spark)", stopOpacity: 0 }}
              />
              <stop
                offset="0.5"
                style={{ stopColor: "var(--spark)", stopOpacity: 0.9 }}
              />
              <stop
                offset="1"
                style={{ stopColor: "var(--spark)", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>
          <g clipPath={`url(#silexio-clip-${glint})`}>
            <g transform="rotate(14 512 512)">
              <rect
                className="mark__glint"
                x="-420"
                y="-320"
                width="300"
                height="1664"
                fill={`url(#silexio-glint-${glint})`}
              />
            </g>
          </g>
        </>
      )}
    </svg>
  );
}
