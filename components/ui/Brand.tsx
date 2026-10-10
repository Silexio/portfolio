import { Mark } from "@/components/ui/Mark";

type BrandProps = {
  href: string;
  label: string;
  onClick?: () => void;
  /** Portée du balayage de braise. Absent = marque immobile (pied de page). */
  glint?: string;
};

/** Marque et wordmark, identiques dans l'en-tête, le menu et le pied de page. */
export function Brand({ href, label, onClick, glint }: BrandProps) {
  return (
    <a href={href} className="brand" aria-label={label} onClick={onClick}>
      <Mark glint={glint} />
      <span className="wordmark">SILEXIO</span>
    </a>
  );
}
