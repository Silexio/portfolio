import { ArtLight } from "@/components/art/shared";
import { ART } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const HUB = { x: 342, y: 210 };
const NODES = [
  { x: 342, y: 53 },
  { x: 508, y: 153 },
  { x: 446, y: 353 },
  { x: 238, y: 353 },
  { x: 176, y: 153 },
];

export function ConnectArt({ lang }: { lang: Locale }) {
  return (
    <svg viewBox="0 0 684 420" fill="none">
      <ArtLight id="connect" />
      <path
        className="art-spoke"
        d={NODES.map((node) => `M${HUB.x} ${HUB.y}L${node.x} ${node.y}`).join(
          "",
        )}
      />
      <path
        className="art-pulse"
        d={NODES.map((node) => `M${node.x} ${node.y}L${HUB.x} ${HUB.y}`).join(
          "",
        )}
      />
      {NODES.map((node) => (
        <circle
          key={`${node.x}-${node.y}`}
          className="art-accent"
          cx={(HUB.x + node.x) / 2}
          cy={(HUB.y + node.y) / 2}
          r="4.5"
        />
      ))}
      <circle className="art-hub" cx={HUB.x} cy={HUB.y} r="46" />
      <use
        href="#silexio-mark"
        x={HUB.x - 30}
        y={HUB.y - 30}
        width="60"
        height="60"
      />
      {NODES.map((node, i) => (
        <g key={i}>
          <rect
            className="art-paper"
            x={node.x - 75}
            y={node.y - 25}
            width="150"
            height="50"
            rx="12"
          />
          <text
            className="art-label"
            x={node.x}
            y={node.y + 7}
            textAnchor="middle"
          >
            {t(ART.apps[i], lang)}
          </text>
        </g>
      ))}
    </svg>
  );
}
