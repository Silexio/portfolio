import { PackageCard } from "@/components/ui/PackageCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, PACKAGES } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Packages({ lang }: { lang: Locale }) {
  const addLabel = t(I18N.services.add, lang);
  const addedLabel = t(I18N.services.added, lang);

  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead
          id="services-title"
          eyebrow={t(I18N.services.eyebrow, lang)}
          num="01"
          title={t(I18N.services.title, lang)}
          subtitle={t(I18N.services.subtitle, lang)}
        />
        <Reveal className="packages__grid" delay={60}>
          {PACKAGES.map((pkg) => (
            <PackageCard
              key={pkg.id}
              addLabel={addLabel}
              addedLabel={addedLabel}
              pkg={{
                id: pkg.id,
                num: pkg.num,
                title: t(pkg.title, lang),
                body: t(pkg.body, lang),
                tags: pkg.tags,
              }}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
