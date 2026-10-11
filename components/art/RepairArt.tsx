import { ArtLight, FLAKE } from "@/components/art/shared";
import { cssVars } from "@/lib/css";

const SCREEN_LINES = [228, 196, 244, 168, 212];

/* Dépanner : l'éclat frappe le poste, l'écran se repeuple ligne à ligne et la liaison vers la
   box repart. Les barres portent `art-cell`, donc elles héritent du remplissage progressif des
   autres planches — un seul mouvement à entretenir pour tout le site. */
export function RepairArt() {
  return (
    <svg viewBox="11 0 684 420" fill="none">
      <ArtLight id="repair" />
      <path className="art-spoke" d="M520 192H566" />
      <path className="art-pulse" d="M566 192H520" />
      <rect
        className="art-paper"
        x="566"
        y="140"
        width="84"
        height="104"
        rx="10"
      />
      <rect
        className="art-muted"
        x="584"
        y="164"
        width="48"
        height="7"
        rx="2"
      />
      <rect
        className="art-muted"
        x="584"
        y="182"
        width="32"
        height="7"
        rx="2"
      />
      <circle className="art-accent" cx="590" cy="214" r="6" />
      <rect
        className="art-paper"
        x="188"
        y="62"
        width="332"
        height="214"
        rx="12"
      />
      <rect
        className="art-accent-soft"
        x="206"
        y="80"
        width="296"
        height="160"
        rx="5"
      />
      {SCREEN_LINES.map((width, index) => (
        <rect
          key={width}
          className="art-muted art-cell"
          style={cssVars({ "--i": index })}
          x="226"
          y={104 + index * 26}
          width={width}
          height="8"
          rx="2"
        />
      ))}
      <polygon className="art-paper" points="316,276 392,276 406,320 302,320" />
      <rect
        className="art-paper"
        x="272"
        y="320"
        width="164"
        height="14"
        rx="5"
      />
      {/* La translation vit sur un groupe parent : l'animation `art-fly` pose une propriété CSS
          `transform`, qui écraserait l'attribut du polygone et renverrait l'éclat à l'origine. */}
      <g transform="translate(56 178)">
        <polygon className="art-accent" points={FLAKE} />
      </g>
    </svg>
  );
}
