import type { Bilingual } from "@/lib/i18n/utils";

export type LegalSection = {
  id: string;
  title: Bilingual;
  body: Bilingual[];
};

/**
 * Contenu des pages légales. Vit hors de lib/data.ts pour ne pas noyer le contenu marketing
 * sous plusieurs milliers de caractères juridiques — même raison que lib/i18n/error-page.ts.
 * Décrit les traitements réellement effectués par le code : toute évolution du booking, du
 * mailer ou de l'observabilité doit être répercutée ici.
 */
export const LEGAL_PAGE = {
  title: {
    fr: "Mentions légales et vie privée",
    en: "Legal notice and privacy",
  },
  intro: {
    fr: "Cette page décrit qui édite ce site, et ce qu'il advient des informations que vous y laissez. Elle est écrite pour être lue, pas pour être contournée.",
    en: "This page sets out who runs this site and what happens to the information you leave on it. It is written to be read, not to be skimmed past.",
  },
  updated: { fr: "Dernière mise à jour", en: "Last updated" },
  updatedOn: "2026-08-24",
} satisfies Record<string, unknown>;

export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "editor",
    title: { fr: "Éditeur du site", en: "Site publisher" },
    body: [
      {
        fr: "Silexio est un studio d'ingénierie indépendant dirigé par Nicolas Wieckiewicz, établi à Chapelle-lez-Herlaimont (7160), Hainaut, Belgique. Contact : contact@silexio.be.",
        en: "Silexio is an independent engineering studio run by Nicolas Wieckiewicz, based in Chapelle-lez-Herlaimont (7160), Hainaut, Belgium. Contact: contact@silexio.be.",
      },
      {
        fr: "L'activité est facturée via la coopérative Productions Associées asbl (Smart), Rue Coenraets 72, 1060 Bruxelles, inscrite à la BCE sous le numéro 0896.755.397. Ce siège est celui de la coopérative : il ne constitue pas un lieu d'accueil de Silexio, dont l'activité s'exerce depuis le Hainaut.",
        en: "Work is invoiced through the cooperative Productions Associées asbl (Smart), Rue Coenraets 72, 1060 Brussels, registered with the Belgian CBE under number 0896.755.397. That address is the cooperative's registered office: it is not a Silexio reception point, the activity being carried out from Hainaut.",
      },
    ],
  },
  {
    id: "hosting",
    title: { fr: "Hébergement", en: "Hosting" },
    body: [
      {
        fr: "Le site est hébergé sur le réseau Cloudflare Workers, opéré par Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis. Les données de réservation sont stockées dans une base Cloudflare D1 rattachée à ce compte.",
        en: "The site is hosted on the Cloudflare Workers network, operated by Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States. Booking data is stored in a Cloudflare D1 database attached to that account.",
      },
    ],
  },
  {
    id: "controller",
    title: { fr: "Responsable du traitement", en: "Data controller" },
    body: [
      {
        fr: "Nicolas Wieckiewicz, joignable à contact@silexio.be pour toute question relative à vos données. Aucun délégué à la protection des données n'a été désigné : la structure n'entre pas dans les cas où le RGPD l'impose.",
        en: "Nicolas Wieckiewicz, reachable at contact@silexio.be for any question about your data. No data protection officer has been appointed: the structure does not fall within the cases where the GDPR requires one.",
      },
    ],
  },
  {
    id: "data",
    title: { fr: "Données collectées", en: "Data collected" },
    body: [
      {
        fr: "Demande de rendez-vous : votre nom, votre adresse email, votre numéro de téléphone, le créneau choisi, le format souhaité (visioconférence ou appel), les prestations que vous avez sélectionnées et, si vous en écrivez un, votre message. Ces informations sont celles que vous saisissez vous-même : rien n'est déduit ni acheté ailleurs.",
        en: "Booking request: your name, email address, phone number, the slot you picked, the format you want (video call or phone call), the services you selected and, if you write one, your message. This is what you type yourself: nothing is inferred or bought elsewhere.",
      },
      {
        fr: "Protection contre les abus : votre adresse IP n'est jamais enregistrée en clair. Elle est transformée par une empreinte cryptographique irréversible, qui sert uniquement à compter les demandes venant d'une même origine et à bloquer les envois automatisés. L'empreinte ne permet pas de remonter à l'adresse.",
        en: "Abuse protection: your IP address is never stored in the clear. It is turned into an irreversible cryptographic fingerprint, used only to count requests coming from one origin and to block automated submissions. The fingerprint cannot be turned back into the address.",
      },
      {
        fr: "Rapports d'erreur : lorsqu'une page plante, un rapport technique est envoyé à un serveur Bugsink auto-hébergé sur sentry.silexio.be. L'envoi des données personnelles y est explicitement désactivé dans la configuration : le rapport contient la trace technique de l'erreur, pas le contenu de vos champs.",
        en: "Error reports: when a page crashes, a technical report is sent to a self-hosted Bugsink server on sentry.silexio.be. Sending personal data is explicitly disabled in its configuration: the report carries the technical stack trace, not the contents of your fields.",
      },
      {
        fr: "Ce site ne pratique aucune mesure d'audience, n'installe aucun traceur publicitaire et ne partage rien avec un réseau social. Le seul élément conservé dans votre navigateur est votre préférence de thème clair ou sombre, gardée en mémoire locale et jamais transmise.",
        en: "This site runs no audience measurement, installs no advertising tracker and shares nothing with a social network. The only thing kept in your browser is your light or dark theme preference, held in local storage and never transmitted.",
      },
    ],
  },
  {
    id: "purpose",
    title: { fr: "Pourquoi, et sur quelle base", en: "Why, and on what basis" },
    body: [
      {
        fr: "Vos coordonnées servent à honorer le rendez-vous que vous demandez, à vous en envoyer la confirmation et l'invitation d'agenda, et à vous recontacter à propos de cette demande. La base légale est l'exécution de mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).",
        en: "Your details are used to honour the appointment you request, to send you its confirmation and calendar invitation, and to get back to you about that request. The legal basis is the performance of pre-contractual steps taken at your request (GDPR article 6.1.b).",
      },
      {
        fr: "L'empreinte d'adresse IP et la vérification anti-robot répondent à l'intérêt légitime de garder le formulaire utilisable et la boîte de réception exploitable (article 6.1.f). Les rapports d'erreur relèvent du même intérêt légitime : garder le service en état de marche.",
        en: "The IP fingerprint and the anti-bot check serve the legitimate interest of keeping the form usable and the inbox workable (article 6.1.f). Error reports fall under the same legitimate interest: keeping the service working.",
      },
      {
        fr: "Vos données ne servent jamais à de la prospection non sollicitée, ne sont ni vendues ni louées, et ne nourrissent aucun profilage ni décision automatisée.",
        en: "Your data is never used for unsolicited marketing, is neither sold nor rented, and feeds no profiling or automated decision-making.",
      },
    ],
  },
  {
    id: "recipients",
    title: { fr: "Qui d'autre y a accès", en: "Who else has access" },
    body: [
      {
        fr: "Les emails de confirmation partent via Brevo (Sendinblue SAS, 106 boulevard Haussmann, 75008 Paris, France), qui traite votre nom et votre adresse email pour cet envoi.",
        en: "Confirmation emails are sent through Brevo (Sendinblue SAS, 106 boulevard Haussmann, 75008 Paris, France), which processes your name and email address for that delivery.",
      },
      {
        fr: "L'hébergement, la base de données et la vérification anti-robot Turnstile sont opérés par Cloudflare, Inc. Cette société étant établie aux États-Unis, ces traitements peuvent impliquer un transfert hors de l'Union européenne, encadré par les garanties contractuelles publiées par le prestataire.",
        en: "Hosting, the database and the Turnstile anti-bot check are operated by Cloudflare, Inc. As that company is established in the United States, these operations may involve a transfer outside the European Union, governed by the contractual safeguards published by the provider.",
      },
      {
        fr: "En dehors de ces prestataires techniques, personne. Aucun sous-traitant marketing, aucun courtier en données, aucun partenaire commercial.",
        en: "Beyond those technical providers, nobody. No marketing subcontractor, no data broker, no commercial partner.",
      },
    ],
  },
  {
    id: "retention",
    title: { fr: "Combien de temps", en: "For how long" },
    body: [
      {
        fr: "Une demande de rendez-vous refusée ou restée sans suite est conservée le temps de traiter l'échange, puis supprimée. Une demande ayant débouché sur une prestation est conservée aussi longtemps que l'exige le suivi de la relation et les obligations comptables belges, soit sept ans pour les pièces liées à une facturation.",
        en: "A booking request that is declined or left without follow-up is kept for as long as the exchange takes, then deleted. A request that led to actual work is kept for as long as the relationship and Belgian accounting obligations require, that is seven years for anything tied to invoicing.",
      },
      {
        fr: "Les empreintes d'adresse IP servant au comptage anti-abus sont éphémères et n'ont d'utilité que sur une fenêtre glissante de quelques minutes. Les rapports d'erreur sont purgés selon la rétention configurée sur le serveur Bugsink.",
        en: "The IP fingerprints used for abuse counting are short-lived and only matter over a rolling window of a few minutes. Error reports are purged according to the retention configured on the Bugsink server.",
      },
      {
        fr: "Vous pouvez demander la suppression de vos données à tout moment, sans avoir à vous justifier, sauf pour les pièces que la loi comptable impose de garder.",
        en: "You can ask for your data to be deleted at any time, without having to justify yourself, except for records that accounting law requires to be kept.",
      },
    ],
  },
  {
    id: "rights",
    title: { fr: "Vos droits", en: "Your rights" },
    body: [
      {
        fr: "Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, leur portabilité, et vous opposer à un traitement fondé sur l'intérêt légitime. Écrivez à contact@silexio.be : la réponse arrive sous un mois, et en pratique bien plus vite.",
        en: "You can request access to your data, its correction, its erasure, a restriction of its processing, its portability, and you can object to processing based on legitimate interest. Write to contact@silexio.be: an answer comes within a month, and in practice far sooner.",
      },
      {
        fr: "Si la réponse ne vous satisfait pas, vous pouvez introduire une réclamation auprès de l'Autorité de protection des données, Rue de la Presse 35, 1000 Bruxelles — autoriteprotectiondonnees.be.",
        en: "If the answer does not satisfy you, you can lodge a complaint with the Belgian Data Protection Authority, Rue de la Presse 35, 1000 Brussels — autoriteprotectiondonnees.be.",
      },
    ],
  },
  {
    id: "ip",
    title: { fr: "Propriété intellectuelle", en: "Intellectual property" },
    body: [
      {
        fr: "Les textes, la charte graphique et le code de ce site sont l'œuvre de Silexio. Les captures d'écran illustrant les réalisations montrent des projets livrés ; celles issues d'un outil client ont été produites à partir de données de démonstration, jamais de données réelles.",
        en: "The copy, the visual identity and the code of this site are Silexio's work. The screenshots illustrating the portfolio show delivered projects; those taken from a client tool were produced from demonstration data, never from real data.",
      },
      {
        fr: "Les noms et logos de tiers cités appartiennent à leurs détenteurs respectifs et ne sont utilisés qu'à titre de référence technique.",
        en: "Third-party names and logos mentioned belong to their respective holders and are used purely as technical references.",
      },
    ],
  },
];
