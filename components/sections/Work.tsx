import { WorkList, type ProjectView } from "@/components/sections/WorkList";
import { Btn } from "@/components/ui/Btn";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, PROJECTS, URLS } from "@/lib/data";
import { fetchRepoStats, repoFromUrl } from "@/lib/github";
import { type Locale, LOCALES } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const SHOWN_PROJECTS = 4;
const MIN_STARS = 5;

const starFormat = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }),
  ]),
);

export async function Work({ lang }: { lang: Locale }) {
  const shown = PROJECTS.slice(0, SHOWN_PROJECTS);
  const stats = await fetchRepoStats(shown.map((project) => project.url));

  const projects: ProjectView[] = shown.map((project, i) => {
    const repo = repoFromUrl(project.url);
    const stars = repo && stats[repo] ? stats[repo].stars : 0;
    return {
      id: project.id,
      num: String(i + 1).padStart(2, "0"),
      name: project.name,
      year: project.year,
      url: project.url,
      stack: project.stack,
      statusLabel: t(I18N.work.status[project.status], lang),
      live: project.status === "production",
      summary: t(project.summary, lang),
      detail: t(project.detail, lang),
      stars: stars >= MIN_STARS ? starFormat[lang].format(stars) : undefined,
    };
  });

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          id="work-title"
          eyebrow={t(I18N.work.eyebrow, lang)}
          num="02"
          title={t(I18N.work.title, lang)}
          subtitle={t(I18N.work.subtitle, lang)}
        />
        <WorkList
          projects={projects}
          viewLabel={t(I18N.work.view, lang)}
          detailLabel={t(I18N.a11y.detail, lang)}
          newTabHint={t(I18N.a11y.newTab, lang)}
        />
        <div className="work__more">
          <Btn href={URLS.github} variant="ghost" srHint={t(I18N.a11y.newTab, lang)}>
            {t(I18N.work.allGithub, lang)}
          </Btn>
        </div>
      </div>
    </section>
  );
}
