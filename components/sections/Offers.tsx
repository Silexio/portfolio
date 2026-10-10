import { OfferLadder } from "@/components/ui/OfferLadder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, type OfferId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

type OffersProps = {
  lang: Locale;
  /** Offres d'une page dédiée. Absent = toute l'échelle, sous le titre de l'accueil. */
  ids?: OfferId[];
  title?: string;
};

export function Offers({ lang, ids, title }: OffersProps) {
  const i18n = I18N.offers;
  return (
    <section id="offers" className="panel" aria-labelledby="offers-title">
      <div className="wrap">
        <SectionHead
          id="offers-title"
          title={title ?? t(i18n.title, lang)}
          lead={t(i18n.lead, lang)}
        />
        <Reveal delay={60}>
          <OfferLadder lang={lang} ids={ids} />
        </Reveal>
        <p className="offers__note">{t(i18n.note, lang)}</p>
      </div>
    </section>
  );
}
