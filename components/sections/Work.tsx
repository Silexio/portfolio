import Image from "next/image";
import { Btn } from "@/components/ui/Btn";
import { Carousel } from "@/components/ui/Carousel";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { I18N, PROJECTS, URLS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Work({ lang }: { lang: Locale }) {
  const i18n = I18N.work;
  const newTab = t(I18N.a11y.newTab, lang);
  const total = PROJECTS.length;
  const dots = PROJECTS.map((project) => ({
    id: project.id,
    label: t(i18n.goTo, lang).replace("{name}", project.name),
  }));

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          id="work-title"
          eyebrow={t(i18n.eyebrow, lang)}
          num="02"
          title={t(i18n.title, lang)}
          subtitle={t(i18n.subtitle, lang)}
        />
        <Reveal>
          <Carousel
            label={t(i18n.eyebrow, lang)}
            prevLabel={t(i18n.prev, lang)}
            nextLabel={t(i18n.next, lang)}
            dots={dots}
          >
            {PROJECTS.map((project, index) => (
              <div
                key={project.id}
                className={`project${project.shots.length === 0 ? " project--bare" : ""}`}
                role="group"
                aria-roledescription="slide"
                aria-label={t(i18n.position, lang)
                  .replace("{name}", project.name)
                  .replace("{n}", String(index + 1))
                  .replace("{total}", String(total))}
              >
                {project.shots.length > 0 && (
                  <div className="project__shots">
                    {project.shots.map((shot) => {
                      const alt = t(shot.alt, lang);
                      const size = {
                        width: shot.width,
                        height: shot.height,
                        sizes: "(min-width: 1024px) 640px, 100vw",
                      };
                      return (
                        <div
                          key={shot.src}
                          className={`project__shot-slot${shot.srcDark ? " project__shot-slot--themed" : ""}`}
                        >
                          <Image
                            className="project__shot"
                            src={shot.src}
                            alt={alt}
                            {...size}
                          />
                          {shot.srcDark && (
                            <Image
                              className="project__shot project__shot--dark"
                              src={shot.srcDark}
                              alt={alt}
                              {...size}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="project__body">
                  <div className="project__name-row">
                    <h3 className="project__name">{project.name}</h3>
                    <Chip
                      variant="ember"
                      live={project.status === "production"}
                    >
                      {t(i18n.status[project.status], lang)}
                    </Chip>
                    <Chip>{t(i18n[project.kind], lang)}</Chip>
                    <span className="project__year mono">{project.year}</span>
                  </div>
                  <p className="project__summary">{t(project.summary, lang)}</p>
                  <p className="project__detail">{t(project.detail, lang)}</p>
                  <div className="project__stack">
                    {project.stack.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                  <div className="project__actions">
                    {project.site && (
                      <Btn href={project.site} variant="ember" srHint={newTab}>
                        {t(i18n.site, lang)}
                      </Btn>
                    )}
                    {project.install && (
                      <Btn
                        href={project.install}
                        variant={project.site ? "ghost" : "ember"}
                        srHint={newTab}
                      >
                        {t(i18n.install, lang)}
                      </Btn>
                    )}
                    {project.repo && (
                      <Btn href={project.repo} variant="ghost" srHint={newTab}>
                        {t(i18n.code, lang)}
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Reveal>
        <Reveal className="work__github" delay={80}>
          <Btn href={URLS.github} variant="ghost" icon={false} srHint={newTab}>
            <SocialIcon id="github" />
            {t(i18n.github, lang)}
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}
