import { cssVars } from "@/lib/css";
import { MarkFacets } from "@/components/ui/Mark";
import { ART } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

type Layout = {
  width: number;
  height: number;
  mark: [x: number, y: number, size: number];
  trails: string;
  flakes: { points: string; tone: 1 | 2 | 3 }[];
  labels: {
    x: number;
    y: number;
    chore: number;
    anchor: "start" | "middle" | "end";
  }[];
  spark: string;
};

/* Deux compositions plutôt qu'une seule mise à l'échelle : sur mobile, les huit étiquettes de la
   version large tomberaient à 4 px. La version étroite n'en garde que quatre, lisibles. */
const WIDE: Layout = {
  width: 1440,
  height: 380,
  mark: [510, 0, 420],
  trails:
    "M640 128Q560 104 494 110M604 214Q520 238 430 250M632 150Q460 128 306 152M652 300Q450 322 242 304M800 128Q880 100 954 100M836 214Q930 234 1028 240M808 150Q980 134 1150 158M788 300Q990 322 1202 310",
  flakes: [
    { points: "452,98 486,92 494,116 466,128", tone: 1 },
    { points: "378,236 418,230 430,258 396,272 380,260", tone: 1 },
    { points: "278,140 302,138 306,156 284,162", tone: 2 },
    { points: "222,292 240,292 242,306 226,310", tone: 3 },
    { points: "954,92 988,86 996,108 964,116", tone: 1 },
    { points: "1028,228 1068,222 1080,250 1046,262 1030,250", tone: 1 },
    { points: "1150,150 1172,148 1176,166 1154,170", tone: 2 },
    { points: "1202,302 1220,302 1222,316 1206,320", tone: 3 },
  ],
  labels: [
    { x: 440, y: 104, chore: 0, anchor: "end" },
    { x: 366, y: 256, chore: 1, anchor: "end" },
    { x: 266, y: 156, chore: 2, anchor: "end" },
    { x: 210, y: 307, chore: 3, anchor: "end" },
    { x: 1006, y: 99, chore: 4, anchor: "start" },
    { x: 1092, y: 247, chore: 5, anchor: "start" },
    { x: 1186, y: 164, chore: 6, anchor: "start" },
    { x: 1234, y: 316, chore: 7, anchor: "start" },
  ],
  spark:
    "M812 96L826 80M818 102L838 98M812 90L815 70M806 94L796 78M820 110L834 118",
};

const NARROW: Layout = {
  width: 390,
  height: 280,
  mark: [85, 20, 220],
  trails:
    "M150 110Q110 92 80 96M142 196Q104 212 66 218M240 110Q280 92 310 96M248 196Q288 212 324 218",
  flakes: [
    { points: "60,88 82,84 86,100 66,106", tone: 1 },
    { points: "44,210 68,206 74,224 52,230", tone: 2 },
    { points: "308,88 330,84 334,100 314,106", tone: 1 },
    { points: "320,210 344,206 350,224 328,230", tone: 2 },
  ],
  labels: [
    { x: 72, y: 76, chore: 0, anchor: "middle" },
    { x: 60, y: 252, chore: 1, anchor: "middle" },
    { x: 320, y: 76, chore: 4, anchor: "middle" },
    { x: 334, y: 252, chore: 5, anchor: "middle" },
  ],
  spark: "M244 84L254 72M248 90L262 88M242 80L244 66",
};

/** La marque au centre, les corvées détachées autour comme des éclats de silex. Purement décoratif. */
export function ChoreMap({ lang }: { lang: Locale }) {
  return (
    <div className="chore-map" aria-hidden="true" suppressHydrationWarning>
      <Composition layout={WIDE} lang={lang} variant="wide" />
      <Composition layout={NARROW} lang={lang} variant="narrow" />
    </div>
  );
}

function Composition({
  layout,
  lang,
  variant,
}: {
  layout: Layout;
  lang: Locale;
  variant: "wide" | "narrow";
}) {
  const [x, y, size] = layout.mark;
  return (
    <svg
      className={`chore-map__art chore-map__art--${variant}`}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      fill="none"
    >
      <defs>
        {[1, 2, 3].map((tone) => (
          <linearGradient
            key={tone}
            id={`chore-${variant}-${tone}`}
            x1="0"
            y1="0"
            x2="0.8"
            y2="1"
          >
            <stop
              offset="0"
              style={{
                stopColor: `color-mix(in srgb, var(--flake-${tone}) 74%, var(--arris-light))`,
              }}
            />
            <stop
              offset="1"
              style={{
                stopColor: `color-mix(in srgb, var(--flake-${tone}) 80%, var(--arris-dark))`,
              }}
            />
          </linearGradient>
        ))}
      </defs>
      <path className="chore-map__trail" d={layout.trails} />
      {layout.flakes.map((flake, index) => (
        <polygon
          key={flake.points}
          className="chore-map__flake"
          style={cssVars({ "--i": index })}
          fill={`url(#chore-${variant}-${flake.tone})`}
          points={flake.points}
        />
      ))}
      {layout.labels.map((label, index) => (
        <text
          key={label.chore}
          className="chore-map__label"
          style={cssVars({ "--i": index })}
          x={label.x}
          y={label.y}
          textAnchor={label.anchor}
        >
          {t(ART.chores[label.chore], lang)}
        </text>
      ))}
      <path className="chore-map__spark" d={layout.spark} />
      <g
        className="knap"
        data-knap
        style={cssVars({
          "--ox": `${x + size / 2}px`,
          "--oy": `${y + size / 2}px`,
        })}
      >
        <MarkFacets x={x} y={y} size={size} />
      </g>
    </svg>
  );
}
