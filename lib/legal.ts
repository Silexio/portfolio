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
 * mailer ou de l’observabilité doit être répercutée ici.
 */
export const LEGAL_PAGE = {
  title: {
    fr: "Mentions légales et vie privée",
    en: "Legal notice and privacy",
  },
  intro: {
    fr: "Cette page décrit qui édite ce site, et ce qu’il advient des informations que vous y laissez. Elle est écrite pour être lue, pas pour être contournée.",
    en: "This page sets out who runs this site and what happens to the information you leave on it. It is written to be read, not to be skimmed past.",
  },
  updated: { fr: "Dernière mise à jour", en: "Last updated" },
  updatedOn: "2026-10-09",
} satisfies Record<string, unknown>;

export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "editor",
    title: { fr: "Éditeur du site", en: "Site publisher" },
    body: [
      {
        fr: "Silexio est le nom commercial sous lequel Nicolas Wieckiewicz exerce son activité d’ingénierie informatique, depuis Chapelle-lez-Herlaimont (7160), Hainaut, Belgique. Contact : contact@silexio.be.",
        en: "Silexio is the trading name under which Nicolas Wieckiewicz carries out his software engineering work, from Chapelle-lez-Herlaimont (7160), Hainaut, Belgium. Contact: contact@silexio.be.",
      },
      {
        fr: "Silexio n’est pas une entité juridique distincte. Les prestations sont contractées, exécutées et facturées par Productions Associées ASBL (groupe Smart), Rue Coenraets 72, 1060 Bruxelles, inscrite à la Banque-Carrefour des Entreprises sous le numéro 0896.755.397 et assujettie à la TVA sous le numéro BE 0896.755.397, que Nicolas Wieckiewicz représente valablement auprès des clients. Ce siège est celui de l’ASBL : il ne constitue pas un lieu d’accueil, l’activité s’exerçant depuis le Hainaut.",
        en: "Silexio is not a separate legal entity. Work is contracted, carried out and invoiced by Productions Associées ASBL (Smart group), Rue Coenraets 72, 1060 Brussels, registered with the Belgian Crossroads Bank for Enterprises under number 0896.755.397 and VAT-registered under BE 0896.755.397, which Nicolas Wieckiewicz validly represents towards clients. That is the ASBL’s registered office: it is not a reception point, the work being carried out from Hainaut.",
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
        fr: "Nicolas Wieckiewicz, joignable à contact@silexio.be pour toute question relative à vos données. Aucun délégué à la protection des données n’a été désigné : la structure n’entre pas dans les cas où le RGPD l’impose.",
        en: "Nicolas Wieckiewicz, reachable at contact@silexio.be for any question about your data. No data protection officer has been appointed: the structure does not fall within the cases where the GDPR requires one.",
      },
    ],
  },
  {
    id: "data",
    title: { fr: "Données collectées", en: "Data collected" },
    body: [
      {
        fr: "Demande de rendez-vous : votre nom, votre adresse email, votre numéro de téléphone, le créneau choisi, le format souhaité (visioconférence ou appel) et, si vous en écrivez un, votre message. Ces informations sont celles que vous saisissez vous-même : rien n’est déduit ni acheté ailleurs.",
        en: "Booking request: your name, email address, phone number, the slot you picked, the format you want (video call or phone call) and, if you write one, your message. This is what you type yourself: nothing is inferred or bought elsewhere.",
      },
      {
        fr: "Formulaire de demande (« Montrez-moi la tâche », « Décrivez la panne ») : la description que vous écrivez, le temps perdu par semaine si vous l’indiquez, votre adresse email et la page depuis laquelle vous écrivez. Ces informations me sont transmises par email et ne sont pas enregistrées sur le site ; un accusé de réception vous est envoyé à la même adresse.",
        en: "Request form (“Show me the task”, “Describe the problem”): the description you write, the time lost per week if you give it, your email address and the page you write from. This is sent to me by email and is not stored on the site; an acknowledgement is sent to the same address.",
      },
      {
        fr: "Protection contre les abus : votre adresse IP n’est jamais enregistrée en clair. Elle est transformée par une empreinte cryptographique irréversible, qui sert uniquement à compter les demandes venant d’une même origine et à bloquer les envois automatisés. L’empreinte ne permet pas de remonter à l’adresse.",
        en: "Abuse protection: your IP address is never stored in the clear. It is turned into an irreversible cryptographic fingerprint, used only to count requests coming from one origin and to block automated submissions. The fingerprint cannot be turned back into the address.",
      },
      {
        fr: "Rapports d’erreur : lorsqu’une page plante, un rapport technique est envoyé à un serveur Bugsink auto-hébergé sur sentry.silexio.be. L’envoi des données personnelles y est explicitement désactivé dans la configuration : le rapport contient la trace technique de l’erreur, pas le contenu de vos champs.",
        en: "Error reports: when a page crashes, a technical report is sent to a self-hosted Bugsink server on sentry.silexio.be. Sending personal data is explicitly disabled in its configuration: the report carries the technical stack trace, not the contents of your fields.",
      },
      {
        fr: "Ce site ne pratique aucune mesure d’audience, n’installe aucun traceur publicitaire et ne partage rien avec un réseau social. Il ne dépose aucun cookie, pas même après la vérification anti-robot — laquelle n’est chargée qu’au moment où vous commencez à remplir un formulaire, et pas avant. Le seul élément conservé dans votre navigateur est votre préférence de thème clair ou sombre, gardée en mémoire locale et jamais transmise.",
        en: "This site runs no audience measurement, installs no advertising tracker and shares nothing with a social network. It sets no cookie, not even after the anti-bot check — which is loaded only once you start filling in a form, never before. The only thing kept in your browser is your light or dark theme preference, held in local storage and never transmitted.",
      },
    ],
  },
  {
    id: "purpose",
    title: { fr: "Pourquoi, et sur quelle base", en: "Why, and on what basis" },
    body: [
      {
        fr: "Vos coordonnées servent à honorer le rendez-vous que vous demandez ou à répondre à la demande que vous envoyez, à vous en accuser réception, et à vous recontacter à propos de cette demande. La base légale est l’exécution de mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).",
        en: "Your details are used to honour the appointment you request or to answer the request you send, to acknowledge it, and to get back to you about that request. The legal basis is the performance of pre-contractual steps taken at your request (GDPR article 6.1.b).",
      },
      {
        fr: "L’empreinte d’adresse IP et la vérification anti-robot répondent à l’intérêt légitime de garder le formulaire utilisable et la boîte de réception exploitable (article 6.1.f). Les rapports d’erreur relèvent du même intérêt légitime : garder le service en état de marche.",
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
    title: { fr: "Qui d’autre y a accès", en: "Who else has access" },
    body: [
      {
        fr: "Les emails partent via Brevo (Sendinblue SAS, Paris, France), qui traite pour cet envoi votre adresse email, votre nom et, pour le formulaire de demande, le texte que vous avez écrit.",
        en: "Emails are sent through Brevo (Sendinblue SAS, Paris, France), which processes for that delivery your email address, your name and, for the request form, the text you wrote.",
      },
      {
        fr: "Un rendez-vous en visioconférence se tient sur kMeet, le service d’Infomaniak Network SA (Rue Eugène-Marziano 25, 1227 Les Acacias, Genève, Suisse). Ce site ne lui transmet rien : le lien de la salle vous est envoyé par email, et c’est en le rejoignant que vous entrez en relation avec ce prestataire. Un rendez-vous par téléphone n’implique personne d’autre.",
        en: "A video appointment takes place on kMeet, the service of Infomaniak Network SA (Rue Eugène-Marziano 25, 1227 Les Acacias, Geneva, Switzerland). This site sends it nothing: the room link reaches you by email, and you enter into a relationship with that provider by joining it. A phone appointment involves nobody else.",
      },
      {
        fr: "L’hébergement, la base de données et la vérification anti-robot Turnstile sont opérés par Cloudflare, Inc. Cette société étant établie aux États-Unis, ces traitements peuvent impliquer un transfert hors de l’Union européenne, encadré par les garanties contractuelles publiées par le prestataire.",
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
        fr: "Une demande de rendez-vous reste dans la base le temps de traiter l’échange, puis je la supprime ; la suppression est manuelle, et vous pouvez la demander à tout moment. Un message du formulaire de demande n’est jamais enregistré sur le site : il ne vit que dans ma boîte mail, d’où je le supprime de la même façon.",
        en: "A booking request stays in the database for as long as the exchange takes, then I delete it; deletion is manual, and you can ask for it at any time. A request-form message is never stored on the site: it only lives in my mailbox, from which I delete it the same way.",
      },
      {
        fr: "Ce qui touche à une prestation facturée est conservé aussi longtemps que l’imposent les obligations légales belges — dix ans pour les pièces liées à une facturation en matière fiscale et TVA.",
        en: "Anything tied to invoiced work is kept for as long as Belgian law requires — ten years for records tied to invoicing under tax and VAT rules.",
      },
      {
        fr: "Les empreintes d’adresse IP servant au comptage anti-abus comptent les envois sur une fenêtre glissante d’une heure. Passé cette heure elles n’entrent plus dans aucun calcul, et elles sont effacées de la base au premier envoi suivant leur vingt-quatrième heure. Les rapports d’erreur sont purgés selon la rétention configurée sur le serveur Bugsink.",
        en: "The IP fingerprints used for abuse counting cover a rolling one-hour window. Past that hour they no longer count towards anything, and they are erased from the database on the first submission after their twenty-fourth hour. Error reports are purged according to the retention configured on the Bugsink server.",
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
        fr: "Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, leur portabilité, et vous opposer à un traitement fondé sur l’intérêt légitime. Écrivez à contact@silexio.be : la réponse arrive sous un mois, et en pratique bien plus vite.",
        en: "You can request access to your data, its correction, its erasure, a restriction of its processing, its portability, and you can object to processing based on legitimate interest. Write to contact@silexio.be: an answer comes within a month, and in practice far sooner.",
      },
      {
        fr: "Si la réponse ne vous satisfait pas, vous pouvez introduire une réclamation auprès de l’Autorité de protection des données, Rue de la Presse 35, 1000 Bruxelles — autoriteprotectiondonnees.be.",
        en: "If the answer does not satisfy you, you can lodge a complaint with the Belgian Data Protection Authority, Rue de la Presse 35, 1000 Brussels — autoriteprotectiondonnees.be.",
      },
    ],
  },
  {
    id: "ip",
    title: { fr: "Propriété intellectuelle", en: "Intellectual property" },
    body: [
      {
        fr: "Les textes, la charte graphique et le code de ce site sont l’œuvre de Silexio. Les captures d’écran illustrant les réalisations montrent des projets livrés ; celles issues d’un outil client ont été produites à partir de données de démonstration, jamais de données réelles.",
        en: "The copy, the visual identity and the code of this site are Silexio’s work. The screenshots illustrating the portfolio show delivered projects; those taken from a client tool were produced from demonstration data, never from real data.",
      },
      {
        fr: "Les noms et logos de tiers cités appartiennent à leurs détenteurs respectifs et ne sont utilisés qu’à titre de référence technique.",
        en: "Third-party names and logos mentioned belong to their respective holders and are used purely as technical references.",
      },
    ],
  },
];
