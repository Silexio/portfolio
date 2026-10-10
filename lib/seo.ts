import {
  BOOKING,
  COVERAGE,
  EMAIL,
  FAQ,
  GEO,
  LEGAL,
  META,
  OFFERS,
  URLS,
  type FaqEntry,
} from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";
import { BASE_URL } from "@/lib/metadata";
import type { Price } from "@/lib/price";
import { servicePath, type ServicePage } from "@/lib/services";

const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const hour = (value: number) => `${String(value).padStart(2, "0")}:00`;

/** Horaires dérivés de BOOKING : ce que Google annonce est exactement ce que le calendrier propose. */
const OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: BOOKING.workdays.map((day) => WEEKDAY[day]),
  opens: hour(BOOKING.startHour),
  closes: hour(BOOKING.endHour),
};

function servedCities() {
  return COVERAGE.flatMap((area) => area.cities).map((city) => ({
    "@type": "City",
    name: city,
  }));
}

/** Prix HTVA : un prix « à partir de » devient un minPrice, un abonnement une unité mensuelle. */
function priceSpecification(price: Price) {
  return {
    "@type": price.monthly ? "UnitPriceSpecification" : "PriceSpecification",
    ...(price.from ? { minPrice: price.amount } : { price: price.amount }),
    priceCurrency: "EUR",
    valueAddedTaxIncluded: false,
    ...(price.monthly && { unitCode: "MON" }),
  };
}

function offerCatalog(lang: Locale) {
  return {
    "@type": "OfferCatalog",
    name: t(META.title, lang),
    itemListElement: OFFERS.map((offer) => ({
      "@type": "Offer",
      priceSpecification: priceSpecification(offer.price),
      itemOffered: {
        "@type": "Service",
        name: t(offer.name, lang),
        description: t(offer.summary, lang),
        areaServed: { "@type": "AdministrativeArea", name: GEO.region },
        provider: { "@id": `${BASE_URL}/#studio` },
      },
    })),
  };
}

/**
 * Graphe schema.org de la page d'accueil : identité, entreprise locale, offres et FAQ.
 * L'adresse volontairement sans rue déclare un profil service-area ancré sur GEO, pas sur
 * le siège administratif de LEGAL — mélanger les deux déplacerait la pertinence sur Bruxelles.
 */
export function structuredData(lang: Locale) {
  const url = `${BASE_URL}/${lang}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Nicolas Wieckiewicz",
        url: BASE_URL,
        email: EMAIL,
        jobTitle: t(
          {
            fr: "Développeur full-stack indépendant",
            en: "Independent full-stack developer",
          },
          lang,
        ),
        hasOccupation: {
          "@type": "Occupation",
          name: t(
            { fr: "Développeur full-stack", en: "Full-stack developer" },
            lang,
          ),
          occupationalCategory: "15-1252 Software Developers",
          occupationLocation: { "@type": "Country", name: "Belgique" },
        },
        sameAs: [
          URLS.github,
          URLS.githubPersonal,
          URLS.linkedin,
          URLS.facebook,
          URLS.instagram,
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: GEO.locality,
          addressRegion: GEO.region,
          addressCountry: GEO.country,
        },
        knowsAbout: [
          "Développement full-stack",
          "Développement web",
          "Développement backend",
          "Développement frontend",
          "Création de site internet",
          "Application web",
          "API REST",
          "Base de données",
          "Automatisation",
          "Automatisation des processus",
          "Intégration de logiciels",
          "Logiciel métier sur mesure",
          "Facturation électronique Peppol",
          "Intelligence artificielle",
          "Intégration d'IA",
          "DevOps",
          "Infrastructure informatique",
          "Hébergement web",
          "Administration de serveurs",
          "Réseau informatique",
          "Sécurité informatique",
          "Sauvegarde et récupération de données",
          "Maintenance informatique",
          "Installation et configuration de postes",
          "Scripts d'automatisation",
          "Support IT",
          "Dépannage informatique",
          "TypeScript",
          "React",
          "Next.js",
          "Python",
          "Django",
          "FastAPI",
          "PostgreSQL",
          "Docker",
          "Linux",
        ],
      },
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": `${BASE_URL}/#studio`,
        name: LEGAL.entity,
        url,
        logo: `${BASE_URL}/icon.png`,
        image: `${BASE_URL}/opengraph.png`,
        email: EMAIL,
        description: t(META.description, lang),
        inLanguage: lang,
        priceRange: "€€",
        currenciesAccepted: "EUR",
        address: {
          "@type": "PostalAddress",
          addressLocality: GEO.locality,
          postalCode: GEO.postalCode,
          addressRegion: GEO.region,
          addressCountry: GEO.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO.latitude,
          longitude: GEO.longitude,
        },
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: GEO.latitude,
            longitude: GEO.longitude,
          },
          geoRadius: GEO.radiusMeters,
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: GEO.region },
          { "@type": "AdministrativeArea", name: "Brabant wallon" },
          { "@type": "Country", name: "Belgique" },
          ...servedCities(),
        ],
        openingHoursSpecification: OPENING_HOURS,
        hasOfferCatalog: offerCatalog(lang),
        founder: { "@id": `${BASE_URL}/#person` },
        sameAs: [URLS.github, URLS.linkedin, URLS.facebook, URLS.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url,
        name: LEGAL.entity,
        inLanguage: lang,
        publisher: { "@id": `${BASE_URL}/#studio` },
      },
    ],
  };
}

/**
 * Markup FAQ, à injecter **uniquement par la page qui affiche réellement ces questions**.
 * Il vivait dans le graphe du layout, donc il était aussi émis sur /[lang]/legal, qui ne
 * porte aucune question : Google exige que les données structurées décrivent le contenu
 * visible, et sanctionne l'écart comme du spam de données structurées.
 */
export function faqStructuredData(
  lang: Locale,
  entries: FaqEntry[] = FAQ,
  path = `/${lang}`,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}${path}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: t(entry.q, lang),
      acceptedAnswer: { "@type": "Answer", text: t(entry.a, lang) },
    })),
  };
}

/** Service décrit par une page dédiée, rattaché au studio. Le dépannage déclare les communes servies. */
export function serviceStructuredData(page: ServicePage, lang: Locale) {
  const url = `${BASE_URL}${servicePath(page, lang)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name: t(page.name, lang),
    serviceType: t(page.name, lang),
    description: t(page.meta.description, lang),
    inLanguage: lang,
    provider: { "@id": `${BASE_URL}/#studio` },
    areaServed:
      page.id === "support"
        ? [
            { "@type": "AdministrativeArea", name: GEO.region },
            ...servedCities(),
          ]
        : { "@type": "Country", name: "Belgique" },
  };
}
