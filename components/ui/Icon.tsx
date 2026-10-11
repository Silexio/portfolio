export type IconName =
  | "close"
  | "menu"
  | "prev"
  | "next"
  | "moon"
  | "sun"
  | "calendar"
  | "mail"
  | "external"
  | "download"
  | "code"
  | "arrow"
  | "phone"
  | "video"
  | "wrench"
  | "spark";

const PATHS: Record<IconName, { box: number; d: string }> = {
  close: { box: 20, d: "M4 4l12 12M16 4L4 16" },
  menu: { box: 20, d: "M3 7h14M3 13h14" },
  prev: { box: 16, d: "M10 3L5 8l5 5" },
  next: { box: 16, d: "M6 3l5 5-5 5" },
  moon: { box: 18, d: "M15 10.6A6.3 6.3 0 0 1 7.4 3a6.3 6.3 0 1 0 7.6 7.6Z" },
  calendar: {
    box: 18,
    d: "M3.5 5.5h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM6 2.5v3M12 2.5v3M2.5 8.5h13",
  },
  mail: {
    box: 18,
    d: "M2.5 5.5h13v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7Zm0 .5 6.5 4.5L15.5 6",
  },
  external: {
    box: 18,
    d: "M10 3.5h4.5V8M14 4 8.5 9.5M13 10.5v3a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3",
  },
  download: {
    box: 18,
    d: "M9 2.5v8.5M5.5 7.5 9 11l3.5-3.5M3.5 14.5h11",
  },
  phone: {
    box: 18,
    d: "M4 2.5h2.6l1.1 2.9-1.6 1.1a8.4 8.4 0 0 0 3.4 3.4l1.1-1.6 2.9 1.1V12a1.5 1.5 0 0 1-1.6 1.5A10.4 10.4 0 0 1 2.5 4.1 1.5 1.5 0 0 1 4 2.5Z",
  },
  video: {
    box: 18,
    d: "M2.5 5.5h7.6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Zm8.6 2.4 4.4-2.3v7.8l-4.4-2.3Z",
  },
  code: {
    box: 18,
    d: "M6 5.5 2.5 9 6 12.5M12 5.5 15.5 9 12 12.5M10.5 3.5l-3 11",
  },
  arrow: { box: 18, d: "M3 9h11M10 5l4 4-4 4" },
  wrench: {
    box: 18,
    d: "M11.8 2.6a4 4 0 0 0-4.5 5.2L2.6 12.5a1.7 1.7 0 0 0 2.4 2.4l4.7-4.7a4 4 0 0 0 5.2-4.5l-2.3 2.3-2-.6-.6-2Z",
  },
  spark: {
    box: 18,
    d: "M9 1.8 10.7 7.3 16.2 9 10.7 10.7 9 16.2 7.3 10.7 1.8 9 7.3 7.3Z",
  },
  sun: {
    box: 18,
    d: "M12.6 9a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4",
  },
};

/** Les glyphes d'interface, d'un seul trait : épaisseur et taille viennent du CSS, pas de l'appel. */
export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const { box, d } = PATHS[name];
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      viewBox={`0 0 ${box} ${box}`}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
