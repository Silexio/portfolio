import { ChapterMarkers } from "@/components/layout/ChapterMarkers";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";
import { CHAPTERS, I18N } from "@/lib/data";
import { localeParam, t } from "@/lib/i18n/utils";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const lang = await localeParam(params);
  const chapters = CHAPTERS.map((chapter) => ({ id: chapter.id, label: t(chapter.label, lang) }));

  return (
    <>
      <a href="#main" className="skip-link">{t(I18N.a11y.skip, lang)}</a>
      <div className="grain" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <Nav lang={lang} />
      <ChapterMarkers chapters={chapters} ariaLabel={t(I18N.a11y.chapters, lang)} />
      <main id="main">
        <Hero lang={lang} />
        <Packages lang={lang} />
        <Process lang={lang} />
        <Work lang={lang} />
        <Stack lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
