import type { OfferId } from "@/lib/data";
import { cssVars } from "@/lib/css";

/** Une face du silex. Le ton va de 1 (face éclairée, en haut à gauche) à 4 (face dans l'ombre). */
type Facet = { d: string; tone: 1 | 2 | 3 | 4 };

type Glyph = {
  outline: string;
  facets: Facet[];
  /** Ondes de percussion et barre d'échelle : des traits, pas des volumes. */
  ripples?: string;
  grain?: [x: number, y: number][];
  spark?: string;
  point?: [x: number, y: number];
};

const TOOL = "M60 12L88 44L84 84L60 110L36 84L32 44Z";
const TOOL_FACETS: Facet[] = [
  { d: "M60 12L32 44L60 60Z", tone: 1 },
  { d: "M60 12L60 60L88 44Z", tone: 2 },
  { d: "M32 44L60 60L60 72L36 84Z", tone: 2 },
  { d: "M88 44L84 84L60 72L60 60Z", tone: 3 },
  { d: "M36 84L60 72L60 110Z", tone: 3 },
  { d: "M84 84L60 110L60 72Z", tone: 4 },
];

/** La lame : un éclat déjà retouché, utile tel quel. Entre l'éclat brut et l'outil emmanché. */
const BLADE = "M60 12L84 56L72 110L48 110L36 56Z";
const BLADE_FACETS: Facet[] = [
  { d: "M60 12L36 56L60 68Z", tone: 1 },
  { d: "M60 12L60 68L84 56Z", tone: 2 },
  { d: "M36 56L60 68L60 110L48 110Z", tone: 3 },
  { d: "M84 56L72 110L60 110L60 68Z", tone: 4 },
];

const NODULE =
  "M30 70C24 48 40 28 62 30C84 32 98 46 94 68C90 88 70 96 52 92C38 89 33 82 30 70Z";

/* Une étape = un stade de la taille du silex : le rognon brut, le rognon entamé et mesuré,
   l'éclat détaché, l'outil fini, puis l'outil qu'on entretient. La lumière vient d'en haut
   à gauche sur les cinq, comme sur le reste du site. */
const GLYPHS: Record<OfferId, Glyph> = {
  intro: {
    outline: NODULE,
    facets: [
      { d: NODULE, tone: 2 },
      { d: "M30 70C24 48 40 28 62 30C46 36 34 50 30 70Z", tone: 1 },
      { d: "M94 68C90 88 70 96 52 92C72 88 88 80 94 68Z", tone: 4 },
    ],
    grain: [
      [48, 50],
      [62, 44],
      [74, 56],
      [56, 64],
      [80, 72],
      [44, 74],
      [66, 80],
    ],
  },
  audit: {
    outline:
      "M30 70C24 48 40 28 62 30L86 36L92 70C88 88 70 96 52 92C38 89 33 82 30 70Z",
    facets: [
      {
        d: "M30 70C24 48 40 28 62 30L86 36L92 70C88 88 70 96 52 92C38 89 33 82 30 70Z",
        tone: 2,
      },
      { d: "M62 30L86 36L92 70L70 58Z", tone: 1 },
      { d: "M92 70C88 88 70 96 52 92C72 88 86 82 92 70Z", tone: 4 },
    ],
    ripples: "M62 30L70 58L92 70M30 106H92M30 101V111M92 101V111",
    grain: [
      [46, 52],
      [52, 70],
      [42, 76],
    ],
  },
  automation: {
    outline: "M22 78L58 26L98 40L86 84L40 98Z",
    facets: [
      { d: "M22 78L58 26L62 90L40 98Z", tone: 1 },
      { d: "M58 26L78 34L74 88L62 90Z", tone: 2 },
      { d: "M78 34L98 40L86 84L74 88Z", tone: 3 },
    ],
    ripples: "M52 36Q58 42 64 36M50 44Q58 52 66 44",
    point: [58, 26],
  },
  site: {
    outline: BLADE,
    facets: BLADE_FACETS,
    ripples: "M50 40Q60 48 70 40",
  },
  software: { outline: TOOL, facets: TOOL_FACETS },
  care: {
    outline: TOOL,
    facets: TOOL_FACETS,
    spark: "M92 22L100 12M96 28L108 26M90 18L90 6",
  },
};

export function OfferGlyph({ id }: { id: OfferId }) {
  const glyph = GLYPHS[id];
  return (
    <svg className="glyph" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {glyph.facets.map((facet, index) => (
        <path
          key={facet.d}
          className={`glyph__face glyph__face--${facet.tone}`}
          style={cssVars({ "--i": index })}
          d={facet.d}
        />
      ))}
      {glyph.ripples && <path className="glyph__facet" d={glyph.ripples} />}
      <path className="glyph__outline" d={glyph.outline} />
      {glyph.grain?.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          className="glyph__grain"
          cx={x}
          cy={y}
          r="1.4"
        />
      ))}
      {glyph.spark && <path className="glyph__spark" d={glyph.spark} />}
      {glyph.point && (
        <circle
          className="glyph__point"
          cx={glyph.point[0]}
          cy={glyph.point[1]}
          r="3.5"
        />
      )}
    </svg>
  );
}
