import { ArtLight } from "@/components/art/shared";
import { cssVars } from "@/lib/css";
import { ART } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const SITE_LINES = [214, 186, 230, 158];

/**
 * Le site travaille pendant qu'on est ailleurs : un visiteur clique, une demande tombe.
 * Les demandes reprennent `.art-cell`, déjà animée en cascade — aucune nouvelle image clé.
 */
export function WebsiteArt({ lang }: { lang: Locale }) {
  const site = ART.site;
  return (
    <svg viewBox="0 0 684 420" fill="none">
      <ArtLight id="website" />
      <rect
        className="art-paper"
        x="30"
        y="54"
        width="336"
        height="312"
        rx="16"
      />
      <rect className="art-line" x="30" y="100" width="336" height="1.5" />
      {[54, 74, 94].map((cx) => (
        <circle key={cx} className="art-muted" cx={cx} cy="77" r="5" />
      ))}
      <rect
        className="art-line"
        x="58"
        y="126"
        width="280"
        height="48"
        rx="8"
      />
      {SITE_LINES.map((width, i) => (
        <rect
          key={i}
          className="art-line"
          x="58"
          y={200 + i * 22}
          width={width}
          height="7"
          rx="3"
        />
      ))}
      <rect
        className="art-ink"
        x="58"
        y="298"
        width="212"
        height="46"
        rx="10"
      />
      <text
        className="art-label art-label--ink"
        x="164"
        y="327"
        textAnchor="middle"
      >
        {t(site.cta, lang)}
      </text>

      <rect className="art-spoke-bar" x="376" y="319" width="40" height="2" />
      <path className="art-accent" d="M416 312l18 8-18 8z" />

      <rect
        className="art-paper"
        x="440"
        y="66"
        width="228"
        height="252"
        rx="16"
      />
      <text className="art-label art-label--sm" x="464" y="106">
        {t(site.inbox, lang)}
      </text>
      <rect className="art-line" x="440" y="124" width="228" height="1.5" />
      {site.entries.map((entry, i) => (
        <g key={entry.fr} className="art-cell" style={cssVars({ "--i": i })}>
          <rect
            className="art-line"
            x="464"
            y={148 + i * 56}
            width="192"
            height="44"
            rx="8"
          />
          <text
            className="art-label art-label--sm"
            x="480"
            y={176 + i * 56}
          >
            {t(entry, lang)}
          </text>
        </g>
      ))}
    </svg>
  );
}
