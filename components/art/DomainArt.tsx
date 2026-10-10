import { Fragment, type ReactNode } from "react";
import { ART, type ArtId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { cssVars } from "@/lib/css";
import { t } from "@/lib/i18n/utils";

type DomainArtProps = { id: ArtId; lang: Locale };

/** Illustration d'une famille de solutions, partagée par l'accueil et les pages dédiées. Décorative. */
export function DomainArt({ id, lang }: DomainArtProps) {
  const Art = ART_BY_DOMAIN[id];
  return (
    // L'observateur du script d'amorçage y pose `data-visible` avant l'hydratation.
    <div
      className={`domain-art domain-art--${id}`}
      aria-hidden="true"
      suppressHydrationWarning
    >
      <Art lang={lang} />
    </div>
  );
}

/**
 * Lumière de la planche : haut éclairé, bas dans l'ombre, comme les arêtes de l'interface.
 * Déclarée dans chaque <svg> — un serveur de peinture ne se référence pas d'un SVG à l'autre.
 */
function ArtLight({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`art-lit-${id}`} x1="0" y1="0" x2="0.25" y2="1">
        <stop
          offset="0"
          style={{
            stopColor:
              "color-mix(in srgb, var(--raised) 86%, var(--arris-light))",
          }}
        />
        <stop
          offset="1"
          style={{
            stopColor:
              "color-mix(in srgb, var(--raised) 84%, var(--arris-dark))",
          }}
        />
      </linearGradient>
    </defs>
  );
}

const ART_BY_DOMAIN: Record<ArtId, (props: { lang: Locale }) => ReactNode> = {
  automate: AutomateArt,
  connect: ConnectArt,
  build: BuildArt,
  repair: RepairArt,
};

/** L'éclat qui traverse une planche. Écrit une fois, posé par translation. */
const FLAKE = "0,0 54,-18 92,8 54,36 0,18 14,9";

const PAGE_LINES = [118, 104, 112, 90, 116, 70, 100];
const CELL_TEXT = [
  [30, 34, 26, 32],
  [26, 30, 34, 24],
  [32, 24, 30, 34],
];
const COLUMNS = [452, 504, 557, 609];

function AutomateArt() {
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
      <polygon
        className="art-accent"
        points={FLAKE}
        transform="translate(332 196)"
      />
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

/* Dépanner : l'éclat frappe le poste, l'écran se repeuple ligne à ligne et la liaison vers la
   box repart. Les barres portent `art-cell`, donc elles héritent du remplissage progressif des
   autres planches — un seul mouvement à entretenir pour tout le site. */
function RepairArt() {
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
      <polygon
        className="art-accent"
        points={FLAKE}
        transform="translate(56 178)"
      />
    </svg>
  );
}

const SCREEN_LINES = [228, 196, 244, 168, 212];

const HUB = { x: 342, y: 210 };
const NODES = [
  { x: 342, y: 53 },
  { x: 508, y: 153 },
  { x: 446, y: 353 },
  { x: 238, y: 353 },
  { x: 176, y: 153 },
];

function ConnectArt({ lang }: { lang: Locale }) {
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

function BuildArt({ lang }: { lang: Locale }) {
  const planning = ART.planning;
  return (
    <div className="planning">
      <div className="planning__window">
        <div className="planning__bar">
          <span>{t(planning.title, lang)}</span>
          <span className="chip">{t(planning.sample, lang)}</span>
        </div>
        <div className="planning__grid">
          {planning.days.map((day, i) => (
            <span
              key={day.fr}
              className="planning__day"
              style={{ gridColumn: i + 2 }}
            >
              {t(day, lang)}
            </span>
          ))}
          {planning.rows.map((row, r) => (
            <Fragment key={row.team.fr}>
              <span className="planning__team" style={{ gridRow: r + 2 }}>
                {t(row.team, lang)}
              </span>
              {row.tasks.map((task) => (
                <span
                  key={task.label.fr}
                  className="planning__task"
                  data-tone={task.tone}
                  style={cssVars({
                    gridRow: r + 2,
                    gridColumn: `${task.span[0] + 1} / ${task.span[1] + 1}`,
                    "--i": r * 3 + task.span[0],
                  })}
                >
                  {t(task.label, lang)}
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="planning__phone">
        <span className="heading-sm">{t(planning.today, lang)}</span>
        {planning.checklist.map((item, i) => (
          <span
            key={item.fr}
            className="planning__check"
            data-done={i === 0}
            style={cssVars({ "--i": i })}
          >
            {t(item, lang)}
          </span>
        ))}
      </div>
    </div>
  );
}
