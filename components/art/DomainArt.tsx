import type { ReactNode } from "react";
import { AutomateArt } from "@/components/art/AutomateArt";
import { BuildArt } from "@/components/art/BuildArt";
import { ConnectArt } from "@/components/art/ConnectArt";
import { RepairArt } from "@/components/art/RepairArt";
import { WebsiteArt } from "@/components/art/WebsiteArt";
import type { ArtId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

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

const ART_BY_DOMAIN: Record<ArtId, (props: { lang: Locale }) => ReactNode> = {
  automate: AutomateArt,
  connect: ConnectArt,
  build: BuildArt,
  repair: RepairArt,
  website: WebsiteArt,
};
