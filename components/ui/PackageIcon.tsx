import type { PackageId } from "@/lib/data";

const PATHS: Record<PackageId, React.ReactNode> = {
  site: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6" cy="6.5" r="0.6" fill="currentColor" />
      <circle cx="8.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  webapp: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M13 9h4M13 13h4" />
    </>
  ),
  api: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="2.5" />
      <path d="M4 5v7c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5M4 12v7c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-7" />
    </>
  ),
  infra: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
      <circle cx="7" cy="7" r="0.7" fill="currentColor" />
      <circle cx="7" cy="17" r="0.7" fill="currentColor" />
    </>
  ),
  automation: <path d="M13 2 5 13h6l-1 9 9-12h-6z" />,
  it: (
    <>
      <rect x="2" y="5" width="20" height="13" rx="1.5" />
      <path d="M8 21h8M10 18v3M14 18v3" />
    </>
  ),
};

export function PackageIcon({ id }: { id: PackageId }) {
  return (
    <svg
      className="package__icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[id]}
    </svg>
  );
}
