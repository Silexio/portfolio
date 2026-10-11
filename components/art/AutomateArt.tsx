import { ArtLight, FLAKE } from "@/components/art/shared";
import { cssVars } from "@/lib/css";

const PAGE_LINES = [118, 104, 112, 90, 116, 70, 100];
const CELL_TEXT = [
  [30, 34, 26, 32],
  [26, 30, 34, 24],
  [32, 24, 30, 34],
];
const COLUMNS = [452, 504, 557, 609];

export function AutomateArt() {
  return (
    /* La fenêtre démarre à 45 et non à 0 : le dessin va de x 112 à 662, il serait sinon décalé
       de 45 unités vers la droite — très visible dès que la planche rétrécit. */
    <svg viewBox="45 0 684 420" fill="none">
      <ArtLight id="automate" />
      <rect
        className="art-paper"
        x="112"
        y="140"
        width="148"
        height="192"
        rx="6"
        transform="rotate(-8 112 140)"
      />
      <rect
        className="art-paper"
        x="134"
        y="128"
        width="148"
        height="192"
        rx="6"
        transform="rotate(-2 134 128)"
      />
      <g transform="translate(154 114) rotate(4)">
        <g className="art-letter">
          <rect className="art-paper" width="148" height="192" rx="6" />
          <rect
            className="art-ink"
            x="14"
            y="16"
            width="60"
            height="7"
            rx="2"
          />
          {PAGE_LINES.map((width, i) => (
            <rect
              key={i}
              className="art-line"
              x="14"
              y={38 + i * 14}
              width={width}
              height="5"
              rx="2"
            />
          ))}
          <rect
            className="art-ink"
            x="100"
            y="160"
            width="34"
            height="18"
            rx="4"
          />
          <text className="art-badge" x="117" y="173" textAnchor="middle">
            PDF
          </text>
        </g>
      </g>
      {/* La translation vit sur un groupe parent : l'animation `art-fly` pose une propriété CSS
          `transform`, qui écraserait l'attribut du polygone et renverrait l'éclat à l'origine. */}
      <g transform="translate(332 196)">
        <polygon className="art-accent" points={FLAKE} />
      </g>
      <rect
        className="art-paper"
        x="452"
        y="100"
        width="210"
        height="250"
        rx="8"
      />
      <path
        className="art-ink"
        d="M452 108a8 8 0 0 1 8-8h194a8 8 0 0 1 8 8v22H452z"
      />
      <rect
        className="art-accent-soft"
        x="452"
        y="130"
        width="210"
        height="84"
      />
      <path
        className="art-grid"
        d="M504 130V350M557 130V350M609 130V350M452 158H662M452 186H662M452 214H662M452 242H662M452 270H662M452 298H662M452 326H662"
      />
      {CELL_TEXT.map((row, r) =>
        row.map((width, c) => (
          <rect
            key={`${r}-${c}`}
            className="art-muted art-cell"
            style={cssVars({ "--i": r * row.length + c })}
            x={COLUMNS[c] + 10}
            y={141 + r * 28}
            width={width}
            height="6"
            rx="2"
          />
        )),
      )}
    </svg>
  );
}
