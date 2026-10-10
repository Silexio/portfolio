import Image from "next/image";
import { Btn } from "@/components/ui/Btn";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, PROJECTS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { fill, t } from "@/lib/i18n/utils";
import { monthlyHoursSaved } from "@/lib/roi";

/** Diaporama de tous les projets livrés : les diapositives sont rendues ici, le carrousel ne pilote que le défilement. */
export function Work({ lang }: { lang: Locale }) {
  const i18n = I18N.work;
  const newTab = t(I18N.a11y.newTab, lang);
  const total = String(PROJECTS.length);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          id="work-title"
          title={t(i18n.title, lang)}
          lead={t(i18n.lead, lang)}
        />
      </div>
      <Reveal>
        <Carousel
          label={t(i18n.label, lang)}
          roleDescription={t(i18n.carousel, lang)}
          prevLabel={t(i18n.prev, lang)}
          nextLabel={t(i18n.next, lang)}
          dots={PROJECTS.map((project) => ({
            id: project.id,
            label: fill(t(i18n.goTo, lang), { name: project.name }),
          }))}
        >
          {PROJECTS.map((project, index) => {
            const hours = project.roi ? monthlyHoursSaved(project.roi) : null;
            const primary = project.site
              ? {
                  href: project.site,
                  label: t(i18n.site, lang),
                  icon: "external" as const,
                }
              : project.install
                ? {
                    href: project.install,
                    label: t(i18n.install, lang),
                    icon: "download" as const,
                  }
                : null;
            return (
              <div
                key={project.id}
                className="project"
                role="group"
                aria-roledescription={t(i18n.slide, lang)}
                aria-label={fill(t(i18n.position, lang), {
                  name: project.name,
                  n: String(index + 1),
                  total,
                })}
              >
                <div className="frame">
                  {project.shot ? (
                    <Image
                      src={project.shot.src}
                      alt={t(project.shot.alt, lang)}
                      width={project.shot.width}
                      height={project.shot.height}
                      sizes="(min-width: 960px) 880px, 100vw"
                    />
                  ) : (
                    <span className="title frame__cover" aria-hidden="true">
                      {project.name}
                    </span>
                  )}
                </div>
                <div className="project__body">
                  <div className="project__info">
                    <div className="project__title-row">
                      <h3 className="subtitle">{project.name}</h3>
                      <span className="chip">
                        {t(i18n[project.kind], lang)}
                      </span>
                      <span className="chip">
                        {t(i18n.status[project.status], lang)}
                      </span>
                    </div>
                    <p>{t(project.summary, lang)}</p>
                    {hours !== null && (
                      <p className="project__result">
                        {fill(t(i18n.roi, lang), { hours: String(hours) })}
                      </p>
                    )}
                    <p className="project__stack">
                      {project.stack.join(" · ")}
                    </p>
                  </div>
                  <div className="project__actions">
                    {primary && (
                      <Btn
                        href={primary.href}
                        variant="accent"
                        icon={primary.icon}
                        srHint={newTab}
                      >
                        {primary.label}
                      </Btn>
                    )}
                    {project.repo && (
                      <Btn
                        href={project.repo}
                        variant="link"
                        icon="code"
                        srHint={newTab}
                      >
                        {t(i18n.code, lang)}
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </Reveal>
    </section>
  );
}
