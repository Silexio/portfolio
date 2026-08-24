import { ChapterMarkers } from "@/components/layout/ChapterMarkers";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Booking } from "@/components/sections/Booking";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";
import { CHAPTERS, I18N } from "@/lib/data";
import { faqStructuredData } from "@/lib/seo";
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
        <About lang={lang} />
        <Work lang={lang} />
        <Proof lang={lang} />
        <Faq lang={lang} />
        <Stack lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData(lang)) }}
      />
      <Booking lang={lang} />
    </>
  );
}
