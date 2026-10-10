import { cssVars } from "@/lib/css";
import { OfferGlyph } from "@/components/art/OfferGlyph";
import { I18N, OFFERS, type OfferId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { resolveDict, t } from "@/lib/i18n/utils";
import { priceParts } from "@/lib/price";

type OfferLadderProps = {
  lang: Locale;
  /** Offres à afficher, dans l'ordre de OFFERS. Absent = toute l'échelle. */
  ids?: OfferId[];
};

/** L'échelle que gravit un client, étape par étape : partagée par l'accueil et les pages dédiées. */
export function OfferLadder({ lang, ids }: OfferLadderProps) {
  const offers = ids
    ? OFFERS.filter((offer) => ids.includes(offer.id))
    : OFFERS;
  const labels = resolveDict(I18N.offers, lang);

  return (
    <ol className="ladder" style={cssVars({ "--count": offers.length })}>
      {offers.map((offer, step) => {
        const price = priceParts(offer.price, lang, labels);
        return (
          <li
            key={offer.id}
            className="offer"
            style={cssVars({ "--step": step })}
          >
            <OfferGlyph id={offer.id} />
            <div className="offer__text">
              <h3 className="heading-sm">{t(offer.name, lang)}</h3>
              <p className="offer__price" data-free={offer.price.amount === 0}>
                {price.lead && <span>{price.lead} </span>}
                <strong>{price.amount}</strong>
                {price.tail && <span> {price.tail}</span>}
              </p>
              {price.net && <p className="offer__net">{price.net}</p>}
              <p className="offer__summary">{t(offer.summary, lang)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
