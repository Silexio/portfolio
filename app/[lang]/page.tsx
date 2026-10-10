import { SiteShell } from "@/components/layout/SiteShell";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Offers } from "@/components/sections/Offers";
import { Solutions } from "@/components/sections/Solutions";
import { Work } from "@/components/sections/Work";
import { FAQ } from "@/lib/data";
import { faqStructuredData } from "@/lib/seo";
import { localeParam } from "@/lib/i18n/utils";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const lang = await localeParam(params);

  return (
    <SiteShell lang={lang}>
      <main id="main">
        <Hero lang={lang} />
        <Solutions lang={lang} />
        <Work lang={lang} />
        <Offers lang={lang} />
        <About lang={lang} />
        <Faq lang={lang} entries={FAQ} />
        <Contact lang={lang} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData(lang)),
        }}
      />
    </SiteShell>
  );
}
