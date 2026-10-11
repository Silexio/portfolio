import type { IconName } from "@/components/ui/Icon";
import MEASURED from "@/lib/reviews.json";
import type { Bilingual } from "@/lib/i18n/utils";
import type { Price } from "@/lib/price";
import type { Roi } from "@/lib/roi";

export const META = {
  title: {
    fr: "Automatisation et logiciels métier pour PME — Hainaut",
    en: "Automation & custom software for SMEs in Belgium",
  },
  description: {
    fr: "J’automatise les tâches qui font perdre du temps aux PME du Hainaut : Excel, PDF, e-mails, facturation Peppol. Intégrations et logiciels métier sur mesure.",
    en: "I automate the tasks that eat small businesses' time: spreadsheets, PDFs, email, Peppol invoicing. Integrations and custom business software, in Belgium.",
  },
} satisfies Record<string, Bilingual>;

export const EMAIL = "contact@silexio.be";

/** Ancrage géographique du profil service-area : commune de rattachement, pas d’adresse de rue. */
export const GEO = {
  locality: "Chapelle-lez-Herlaimont",
  postalCode: "7160",
  region: "Hainaut",
  country: "BE",
  latitude: 50.4167,
  longitude: 4.3333,
  radiusMeters: 45000,
} as const;

/**
 * Mentions légales belges. Le siège social et la TVA sont ceux de la coopérative SMartCoop :
 * ils vivent ici et dans le footer, jamais dans le JSON-LD local, qui doit pointer sur GEO.
 * `whatsappUrl` est un lien d’invitation : il ouvre la conversation sans publier le numéro,
 * qui n’a rien à faire dans ce dépôt public. Champs vides = affichage masqué.
 */
export const LEGAL: {
  entity: string;
  host: string;
  street: string;
  city: string;
  vat: string;
  whatsappUrl: string;
} = {
  entity: "Silexio",
  host: "Productions Associées asbl (Smart)",
  street: "Rue Coenraets 72",
  city: "1060 Bruxelles",
  vat: "BE 0896.755.397",
  whatsappUrl: "https://wa.me/message/GWBTZEIIOC4XF1",
};

export const URLS = {
  email: `mailto:${EMAIL}`,
  linkedin: "https://www.linkedin.com/company/silexio-be",
  github: "https://github.com/Silexio",
  /** Compte personnel : publié dans `sameAs` pour lier la personne au studio (E-E-A-T). */
  githubPersonal: "https://github.com/TheSawkit",
  /** Profil personnel : le studio a sa page entreprise, la personne a la sienne. */
  linkedinPersonal: "https://www.linkedin.com/in/nicolasjzw",
  /** Contribution publique au pilote libre des périphériques Razer, citée sous les réalisations. */
  openrazer: "https://github.com/openrazer/openrazer/commits?author=TheSawkit",
  facebook: "https://www.facebook.com/silexio",
  instagram: "https://www.instagram.com/silexio.be",
} as const;

/** Règles d’ouverture du calendrier de rendez-vous (jours/heures en heure de Bruxelles). */
export const BOOKING = {
  timezone: "Europe/Brussels",
  workdays: [1, 2, 3, 4, 5],
  startHour: 9,
  endHour: 17,
  slotMinutes: 30,
  horizonDays: 21,
  leadMinutes: 120,
} as const;

export type SocialId =
  "linkedin" | "github" | "facebook" | "instagram" | "whatsapp";

export const SOCIALS: { id: SocialId; label: string; url: string }[] = [
  { id: "linkedin", label: "LinkedIn", url: URLS.linkedin },
  { id: "github", label: "GitHub", url: URLS.github },
  { id: "facebook", label: "Facebook", url: URLS.facebook },
  { id: "instagram", label: "Instagram", url: URLS.instagram },
];

/** Pages dédiées (contenu dans lib/services.ts). L’identifiant sert aussi de source au formulaire. */
export type ServicePageId =
  | "automation"
  | "software"
  | "website"
  | "support";

export const I18N = {
  nav: {
    solutions: { fr: "Solutions", en: "Solutions" },
    work: { fr: "Réalisations", en: "Work" },
    offers: { fr: "Tarifs", en: "Pricing" },
    faq: { fr: "Questions", en: "FAQ" },
  },
  a11y: {
    skip: { fr: "Aller au contenu", en: "Skip to content" },
    menu: { fr: "Ouvrir le menu", en: "Open menu" },
    close: { fr: "Fermer", en: "Close" },
    toggleLang: { fr: "Passer en anglais", en: "Switch to French" },
    toggleTheme: { fr: "Basculer le thème", en: "Toggle theme" },
    home: { fr: "Silexio — retour en haut", en: "Silexio — back to top" },
    newTab: { fr: "ouvre un nouvel onglet", en: "opens in a new tab" },
    breadcrumb: { fr: "Fil d’Ariane", en: "Breadcrumb" },
    nav: { fr: "Navigation principale", en: "Main navigation" },
  },
  hero: {
    eyebrow: {
      fr: "Silexio — studio de développement, Hainaut",
      en: "Silexio — software studio in Hainaut, Belgium",
    },
    titleA: {
      fr: "La tâche que vous refaites chaque semaine",
      en: "The task you redo every week",
    },
    titleB: { fr: "peut disparaître.", en: "can disappear." },
    cta: { fr: "Montrez-moi la tâche", en: "Show me the task" },
    pricing: { fr: "Voir les tarifs", en: "See pricing" },
    rating: {
      fr: "{score} · {count} avis {platform}",
      en: "{score} · {count} {platform} reviews",
    },
    ratingChecked: {
      fr: "note relevée le {date}",
      en: "rating checked on {date}",
    },
  },
  solutions: {
    more: { fr: "En savoir plus", en: "Learn more" },
    supportLead: {
      fr: "Un ordinateur qui rame, une imprimante ou un wifi capricieux ?",
      en: "A slow computer, a stubborn printer or flaky wifi?",
    },
    supportLink: {
      fr: "C’est par ici : dépannage informatique",
      en: "This way: IT support",
    },
    websiteLead: {
      fr: "Pas encore de site, ou un site qui ne vous ressemble plus ?",
      en: "No website yet, or one that no longer looks like you?",
    },
    websiteLink: {
      fr: "C’est par ici : création de site internet",
      en: "This way: website design",
    },
  },
  work: {
    title: { fr: "Ce qui tourne déjà", en: "Already up and running" },
    lead: {
      fr: "Un outil livré à un client, et des projets personnels menés jusqu’au bout.",
      en: "A tool delivered to a client, and personal projects taken all the way.",
    },
    label: { fr: "Réalisations", en: "Work" },
    carousel: { fr: "carrousel", en: "carousel" },
    slide: { fr: "diapositive", en: "slide" },
    position: {
      fr: "{name} — projet {n} sur {total}",
      en: "{name} — project {n} of {total}",
    },
    goTo: { fr: "Aller au projet {name}", en: "Go to project {name}" },
    prev: { fr: "Projet précédent", en: "Previous project" },
    next: { fr: "Projet suivant", en: "Next project" },
    site: { fr: "Voir le site", en: "Visit the site" },
    code: { fr: "Voir le code", en: "View the code" },
    install: { fr: "Installer", en: "Install" },
    client: { fr: "Projet client", en: "Client project" },
    personal: { fr: "Projet personnel", en: "Personal project" },
    status: {
      production: { fr: "En production", en: "In production" },
      shipped: { fr: "Livré", en: "Shipped" },
      wip: { fr: "En cours", en: "In progress" },
    },
    contribution: {
      fr: "Côté open source : le support du casque Razer Kraken Tournament Edition que j’ai ajouté à OpenRazer.",
      en: "On the open-source side: the Razer Kraken Tournament Edition support I added to OpenRazer.",
    },
    contributionLink: { fr: "Voir le commit", en: "See the commit" },
    roi: {
      fr: "≈ {hours} h rendues chaque mois",
      en: "≈ {hours} h given back each month",
    },
  },
  offers: {
    title: {
      fr: "Des prix clairs, étape par étape",
      en: "Clear prices, step by step",
    },
    lead: {
      fr: "Le premier échange est gratuit. Vous pouvez vous arrêter après chaque étape.",
      en: "The first conversation is free. You can stop after any step.",
    },
    free: { fr: "Gratuit", en: "Free" },
    from: { fr: "dès", en: "from" },
    perMonth: { fr: "/mois", en: "/month" },
    net: {
      fr: "soit {amount} TVA comprise",
      en: "i.e. {amount} incl. VAT",
    },
    note: {
      fr: "Montants hors TVA, à partir de — les tarifs s’adressent à des professionnels, qui récupèrent la TVA. Un particulier ajoute 21 %. Le périmètre exact et le montant définitif sont fixés par écrit avant de commencer, et vous ne payez rien à la commande.",
      en: "Amounts exclude VAT, starting from — these prices are for businesses, which reclaim VAT. A private customer adds 21%. The exact scope and final amount are set in writing before we start, and you pay nothing on order.",
    },
  },
  faq: {
    title: { fr: "Vos questions", en: "Your questions" },
    lead: {
      fr: "Les réponses franches à ce qu’on me demande avant de commencer.",
      en: "Straight answers to what people ask me before we start.",
    },
    more: {
      fr: "Une autre question ? Écrivez-moi",
      en: "Another question? Write to me",
    },
  },
  contact: {
    title: { fr: "Montrez‑moi la tâche", en: "Show me the task" },
    sub: {
      fr: "Quelques lignes suffisent. Réponse sous 24 h, premier avis gratuit.",
      en: "A few lines are enough. Reply within 24 hours, first opinion free.",
    },
    task: { fr: "La tâche", en: "The task" },
    taskPlaceholder: {
      fr: "Ex. : chaque vendredi, on recopie les bons de livraison PDF dans un tableau Excel pour préparer la facturation.",
      en: "E.g. every Friday we copy PDF delivery notes into a spreadsheet to prepare invoicing.",
    },
    cal: { fr: "Réserver un appel", en: "Book a call" },
  },
  form: {
    optional: { fr: "facultatif", en: "optional" },
    submitting: { fr: "Envoi…", en: "Sending…" },
    captchaLabel: {
      fr: "Vérification anti-robot",
      en: "Anti-bot verification",
    },
    errorRate: {
      fr: "Trop de demandes. Réessayez plus tard.",
      en: "Too many requests. Try again later.",
    },
    errorCaptcha: {
      fr: "Vérification anti-robot échouée. Réessayez.",
      en: "Anti-bot check failed. Try again.",
    },
    errorValidation: {
      fr: "Vérifiez les champs du formulaire.",
      en: "Please check the form fields.",
    },
  },
  lead: {
    taskHint: {
      fr: "Quelques lignes suffisent (20 caractères minimum).",
      en: "A few lines are enough (20 characters minimum).",
    },
    hours: { fr: "Temps perdu par semaine", en: "Time lost per week" },
    hoursPlaceholder: { fr: "Je choisis…", en: "Pick one…" },
    hoursLt1: { fr: "Moins d’une heure", en: "Less than an hour" },
    hours1to3: { fr: "1 à 3 heures", en: "1 to 3 hours" },
    hours3to10: { fr: "3 à 10 heures", en: "3 to 10 hours" },
    hoursGt10: { fr: "Plus de 10 heures", en: "More than 10 hours" },
    hoursUnknown: { fr: "Je ne sais pas", en: "I don’t know" },
    email: { fr: "Votre email", en: "Your email" },
    emailPlaceholder: { fr: "vous@entreprise.be", en: "you@company.com" },
    submit: { fr: "Envoyer", en: "Send" },
    successTitle: { fr: "Bien reçu.", en: "Got it." },
    successBody: {
      fr: "Je vous réponds sous 24 h. Un accusé de réception vient de partir dans votre boîte mail.",
      en: "I’ll reply within 24 hours. A confirmation has just been sent to your inbox.",
    },
    errorGeneric: {
      fr: `L’envoi a échoué. Réessayez, ou écrivez directement à ${EMAIL}.`,
      en: `Sending failed. Try again, or write directly to ${EMAIL}.`,
    },
    privacy: {
      fr: "Votre message m’est transmis par email, sans être enregistré sur le site.",
      en: "Your message is sent to me by email; the site doesn’t store it.",
    },
    privacyLink: { fr: "Mentions légales", en: "Privacy" },
  },
  service: {
    home: { fr: "Accueil", en: "Home" },
    offers: { fr: "Les offres concernées", en: "Related offers" },
    step: { fr: "Étape {n}", en: "Step {n}" },
    coverage: { fr: "Où j’interviens", en: "Where I work" },
    coverageSub: {
      fr: "Sur place dans ces communes et leurs environs, à distance partout ailleurs en Belgique.",
      en: "On-site in these towns and around them, remotely anywhere else in Belgium.",
    },
  },
  booking: {
    eyebrow: { fr: "Rendez-vous", en: "Booking" },
    title: { fr: "Réservez\nun créneau.", en: "Book\na slot." },
    subtitle: {
      fr: "Choisissez un créneau, je vous confirme par email. Visio ou appel — comme vous préférez.",
      en: "Pick a slot, I confirm by email. Video or call — your choice.",
    },
    tzNote: {
      fr: "Heures affichées en heure de Bruxelles",
      en: "Times shown in Brussels time",
    },
    pickDay: { fr: "Choisissez un jour", en: "Pick a day" },
    pickSlot: { fr: "Choisissez un horaire", en: "Pick a time" },
    morning: { fr: "Matin", en: "Morning" },
    afternoon: { fr: "Après-midi", en: "Afternoon" },
    noSlots: {
      fr: "Aucun créneau disponible ce jour",
      en: "No slots available that day",
    },
    loadingSlots: {
      fr: "Chargement des disponibilités…",
      en: "Loading availability…",
    },
    slotsError: {
      fr: "Impossible de charger les disponibilités. Réessayez.",
      en: "Couldn’t load availability. Try again.",
    },
    selectedSlot: { fr: "Créneau choisi", en: "Selected slot" },
    change: { fr: "Modifier", en: "Change" },
    formTitle: { fr: "Vos coordonnées", en: "Your details" },
    name: { fr: "Nom", en: "Name" },
    namePlaceholder: { fr: "Votre nom", en: "Your name" },
    email: { fr: "Email", en: "Email" },
    emailPlaceholder: { fr: "vous@exemple.com", en: "you@example.com" },
    phone: { fr: "Téléphone", en: "Phone" },
    phonePlaceholder: { fr: "+32 4xx xx xx xx", en: "+32 4xx xx xx xx" },
    phoneNote: {
      fr: "Votre numéro me sert à vous joindre et à l’ajouter à ma liste de confiance (anti-spam).",
      en: "Your number lets me reach you and add you to my trusted list (anti-spam).",
    },
    mode: { fr: "Format", en: "Format" },
    modeVideo: { fr: "Visio", en: "Video" },
    modeCall: { fr: "Appel", en: "Call" },
    message: { fr: "Message", en: "Message" },
    messagePlaceholder: {
      fr: "En une phrase, votre besoin",
      en: "In one line, your need",
    },
    submit: { fr: "Envoyer la demande", en: "Send request" },
    successTitle: { fr: "Demande envoyée", en: "Request sent" },
    successBody: {
      fr: "Merci ! Je vous confirme le rendez-vous par email très vite.",
      en: "Thanks! I’ll confirm the booking by email shortly.",
    },
    errorGeneric: {
      fr: "Une erreur est survenue. Réessayez.",
      en: "Something went wrong. Try again.",
    },
    errorSlotTaken: {
      fr: "Ce créneau vient d’être pris. Choisissez-en un autre.",
      en: "This slot was just taken. Please pick another.",
    },
  },
  footer: {
    rights: { fr: "Tous droits réservés", en: "All rights reserved" },
    tag: { fr: "Fait en Belgique", en: "Made in Belgium" },
    tagline: {
      fr: "Automatisation, intégrations et logiciels métier pour les PME. Un seul interlocuteur, dans le Hainaut ou à distance.",
      en: "Automation, integrations and custom software for small businesses. One person to talk to, across Hainaut or remotely.",
    },
    servicesTitle: { fr: "Services", en: "Services" },
    contactTitle: { fr: "Contact", en: "Contact" },
    followTitle: { fr: "Suivre", en: "Follow" },
    legal: { fr: "Mentions légales", en: "Legal" },
    country: { fr: "Belgique", en: "Belgium" },
    vatLabel: { fr: "TVA", en: "VAT" },
    seat: {
      fr: "Facturation via",
      en: "Invoiced through",
    },
    whatsapp: { fr: "Écrire sur WhatsApp", en: "Message on WhatsApp" },
  },
} as const;

/** Libellés communs aux deux formulaires, résolus en strings. */
type FormLabels = Record<keyof typeof I18N.form, string>;

/** Libellés de la réservation : ses clés propres, plus celles que les deux formulaires partagent. */
export type BookingLabels = Record<keyof typeof I18N.booking, string> &
  FormLabels;

/** Libellés du formulaire de demande : ses clés propres, plus les clés partagées. */
export type LeadLabels = Record<keyof typeof I18N.lead, string> & FormLabels;

/** Templates des emails de réservation (résolus serveur via t(), placeholders remplacés ensuite). */
export const BOOKING_EMAILS = {
  owner: {
    subject: {
      fr: "Nouvelle demande de RDV — {name}",
      en: "New booking request — {name}",
    },
    heading: {
      fr: "Nouvelle demande de rendez-vous",
      en: "New booking request",
    },
    fields: {
      slot: { fr: "Créneau", en: "Slot" },
      mode: { fr: "Format", en: "Format" },
      name: { fr: "Nom", en: "Name" },
      email: { fr: "Email", en: "Email" },
      phone: { fr: "Téléphone", en: "Phone" },
      message: { fr: "Message", en: "Message" },
    },
    confirm: { fr: "Confirmer le rendez-vous", en: "Confirm booking" },
    refuse: { fr: "Refuser", en: "Decline" },
    hint: {
      fr: "Le créneau est en pièce jointe (.ics, statut provisoire) : ajoute-le à ton agenda pour le tenir, et supprime-le si tu refuses.\nPense à ajouter le numéro à ta liste de confiance avant de confirmer.",
      en: "The slot is attached (.ics, tentative): add it to your calendar to hold it, and delete it if you decline.\nRemember to whitelist the number before confirming.",
    },
  },
  pending: {
    subject: {
      fr: "Votre demande de rendez-vous — Silexio",
      en: "Your booking request — Silexio",
    },
    body: {
      fr: "Bonjour,\n\nVotre demande de rendez-vous le {slot} ({mode}) a bien été reçue.\nJe la confirme par email très vite — vous recevrez alors le lien visio ou les modalités de l’appel.\n\nÀ très vite,\nNicolas — Silexio",
      en: "Hello,\n\nYour booking request for {slot} ({mode}) has been received.\nI’ll confirm it by email shortly — you’ll then get the video link or the call details.\n\nTalk soon,\nNicolas — Silexio",
    },
  },
  confirmed: {
    subject: {
      fr: "Rendez-vous confirmé — {slot}",
      en: "Booking confirmed — {slot}",
    },
    body: {
      fr: "Bonjour {name},\n\nVotre rendez-vous du {slot} est confirmé.\n\n{meetingInfo}\n\n{calendar}\n\nÀ très vite,\nNicolas — Silexio",
      en: "Hi {name},\n\nYour booking on {slot} is confirmed.\n\n{meetingInfo}\n\n{calendar}\n\nTalk soon,\nNicolas — Silexio",
    },
    calendar: {
      fr: "Ajoutez-le à votre agenda :\n{url}\n(Le fichier .ics en pièce jointe fait la même chose dans Apple Calendar, Outlook ou Infomaniak.)",
      en: "Add it to your calendar:\n{url}\n(The attached .ics does the same in Apple Calendar, Outlook or Infomaniak.)",
    },
    calendarLabel: {
      fr: "Ajouter à Google Agenda",
      en: "Add to Google Calendar",
    },
    meetingVideo: {
      fr: "Lien visio : {url}\n(Je rejoins en premier pour ouvrir la salle.)",
      en: "Video link: {url}\n(I’ll join first to open the room.)",
    },
    meetingCall: {
      fr: "Je vous appelle au numéro fourni à l’heure convenue.",
      en: "I’ll call you on the number you provided at the agreed time.",
    },
  },
  refused: {
    subject: {
      fr: "À propos de votre demande de rendez-vous",
      en: "About your booking request",
    },
    body: {
      fr: "Bonjour {name},\n\nJe ne peux malheureusement pas honorer le créneau du {slot}.\nN’hésitez pas à en choisir un autre sur silexio.be ou à me répondre directement.\n\nÀ bientôt,\nNicolas — Silexio",
      en: "Hi {name},\n\nUnfortunately I can’t take the {slot} slot.\nFeel free to pick another one on silexio.be or reply directly.\n\nBest,\nNicolas — Silexio",
    },
  },
  ownerConfirmed: {
    subject: {
      fr: "RDV confirmé — {slot} — {name}",
      en: "Booking confirmed — {slot} — {name}",
    },
    body: {
      fr: "Tu as confirmé le rendez-vous avec {name} ({email} · {phone}) le {slot}.\n\n{meetingInfo}\n\n{calendar}\n\nL’événement est aussi en pièce jointe (.ics).",
      en: "You confirmed the booking with {name} ({email} · {phone}) on {slot}.\n\n{meetingInfo}\n\n{calendar}\n\nThe event is also attached (.ics).",
    },
    meetingCall: {
      fr: "Format : appel. Tu appelles {name} au numéro fourni.",
      en: "Format: call. You call {name} on the provided number.",
    },
  },
  ics: {
    summary: { fr: "Rendez-vous Silexio", en: "Silexio booking" },
    ownerSummaryPending: {
      fr: "RDV {name} — à confirmer",
      en: "Booking {name} — to confirm",
    },
    ownerSummary: { fr: "RDV {name}", en: "Booking {name}" },
    descriptionVideo: {
      fr: "Visio Silexio — lien : {url}",
      en: "Silexio video call — link: {url}",
    },
    descriptionVideoPending: {
      fr: "Visio Silexio — le lien arrive avec la confirmation.",
      en: "Silexio video call — the link comes with the confirmation.",
    },
    descriptionCall: {
      fr: "Appel téléphonique avec Silexio.",
      en: "Phone call with Silexio.",
    },
    locationVideo: { fr: "Visioconférence", en: "Video call" },
    locationCall: { fr: "Appel téléphonique", en: "Phone call" },
  },
} as const;

/** Strings de la page d’action propriétaire (confirmation/refus en deux temps). */
export const BOOKING_ACTION = {
  confirmQuestion: {
    fr: "Confirmer ce rendez-vous ?",
    en: "Confirm this booking?",
  },
  refuseQuestion: {
    fr: "Refuser ce rendez-vous ?",
    en: "Decline this booking?",
  },
  confirmCta: { fr: "Confirmer", en: "Confirm" },
  refuseCta: { fr: "Refuser", en: "Decline" },
  confirmedTitle: { fr: "Rendez-vous confirmé", en: "Booking confirmed" },
  confirmedBody: {
    fr: "Le client a reçu un email avec les modalités.",
    en: "The client received an email with the details.",
  },
  refusedTitle: { fr: "Rendez-vous refusé", en: "Booking declined" },
  refusedBody: {
    fr: "Le créneau est de nouveau disponible. Le client a été prévenu.",
    en: "The slot is available again. The client has been notified.",
  },
  alreadyTitle: { fr: "Déjà traité", en: "Already handled" },
  alreadyBody: {
    fr: "Ce rendez-vous a déjà été traité.",
    en: "This booking has already been handled.",
  },
  expiredTitle: { fr: "Créneau dépassé", en: "Slot in the past" },
  expiredBody: {
    fr: "Ce créneau est déjà passé.",
    en: "This slot is already in the past.",
  },
  invalidTitle: { fr: "Lien invalide", en: "Invalid link" },
  invalidBody: {
    fr: "Ce lien est invalide ou a expiré.",
    en: "This link is invalid or has expired.",
  },
  summaryLabel: { fr: "Demande", en: "Request" },
} as const;

/**
 * Emails du formulaire « Montrez-moi la tâche ». La notification propriétaire est toujours en
 * français et indique la langue du prospect ; l’accusé de réception ne reprend jamais le texte
 * saisi, sinon le formulaire servirait de relais pour envoyer n’importe quoi à n’importe qui.
 */
export const LEAD_EMAILS = {
  owner: {
    subject: "Nouvelle demande ({source}) — {email}",
    heading: "Nouvelle demande depuis le site",
    fields: {
      task: "Tâche",
      hours: "Temps perdu / semaine",
      email: "Email",
      source: "Page",
      locale: "Langue",
    },
    hint: "Réponds directement à cet email : la réponse part chez le prospect.",
  },
  ack: {
    subject: { fr: "Bien reçu — Silexio", en: "Got it — Silexio" },
    body: {
      fr: "Bonjour,\n\nVotre demande est bien arrivée. Je la lis et je vous réponds sous 24 h.\n\nSi vous avez une capture d’écran ou un exemple de fichier, répondez simplement à cet email.\n\nÀ très vite,\nNicolas — Silexio",
      en: "Hello,\n\nYour request has arrived. I’ll read it and reply within 24 hours.\n\nIf you have a screenshot or a sample file, simply reply to this email.\n\nTalk soon,\nNicolas — Silexio",
    },
  },
  sources: {
    home: "Accueil",
    automation: "Automatisation",
    software: "Logiciel métier",
    website: "Site internet",
    support: "Dépannage",
  },
} as const;

export type DomainId = "automate" | "connect" | "build";

/** Les planches disponibles. « repair » n'a pas de panneau sur l'accueil, seulement sa page. */
export type ArtId = DomainId | "repair" | "website";

type Domain = {
  id: DomainId;
  title: Bilingual;
  lead: Bilingual;
  service: ServicePageId;
};

/** Les trois familles de problèmes que Silexio règle, chacune comprise d’un coup d'œil grâce à son illustration. */
export const DOMAINS: Domain[] = [
  {
    id: "automate",
    title: { fr: "Automatiser", en: "Automate" },
    lead: {
      fr: "Les PDF se recopient seuls dans Excel.",
      en: "PDFs copy themselves into your spreadsheets.",
    },
    service: "automation",
  },
  {
    id: "connect",
    title: { fr: "Connecter", en: "Connect" },
    lead: {
      fr: "Vos logiciels se parlent enfin.",
      en: "Your software finally talks to each other.",
    },
    service: "automation",
  },
  {
    id: "build",
    title: { fr: "Construire", en: "Build" },
    lead: {
      fr: "L’outil métier qu’aucun logiciel ne vend.",
      en: "The business tool no vendor sells.",
    },
    service: "software",
  },
];

type PlanningTask = {
  label: Bilingual;
  /** Colonnes occupées dans la semaine, de 1 (lundi) à 6 (fin de vendredi). */
  span: [number, number];
  tone?: "accent" | "todo";
};

type PlanningRow = {
  team: Bilingual;
  tasks: PlanningTask[];
};

const PLANNING_ROWS: PlanningRow[] = [
  {
    team: { fr: "Équipe A", en: "Team A" },
    tasks: [
      {
        label: { fr: "Pose — chantier 12", en: "Install — site 12" },
        span: [1, 3],
      },
      { label: { fr: "Métrés", en: "Measurements" }, span: [4, 6] },
    ],
  },
  {
    team: { fr: "Équipe B", en: "Team B" },
    tasks: [
      {
        label: { fr: "Livraison matériaux", en: "Materials delivery" },
        span: [2, 5],
        tone: "accent",
      },
    ],
  },
  {
    team: { fr: "Équipe C", en: "Team C" },
    tasks: [
      { label: { fr: "Devis", en: "Quote" }, span: [1, 2] },
      {
        label: { fr: "Rénovation — chantier 9", en: "Renovation — site 9" },
        span: [3, 6],
      },
    ],
  },
  {
    team: { fr: "Atelier", en: "Workshop" },
    tasks: [
      {
        label: {
          fr: "Stock : 3 commandes à valider",
          en: "Stock: 3 orders to approve",
        },
        span: [1, 6],
        tone: "todo",
      },
    ],
  },
];

/**
 * Libellés des illustrations. Elles sont décoratives (aria-hidden) mais lues par tous les voyants :
 * elles se traduisent comme le reste. Le planning est un exemple, annoncé comme tel à l’écran.
 */
export const ART = {
  chores: [
    { fr: "ressaisie", en: "re-typing" },
    { fr: "copier-coller", en: "copy-paste" },
    { fr: "relances à la main", en: "manual reminders" },
    { fr: "rapport du lundi", en: "Monday report" },
    { fr: "doubles saisies", en: "double entry" },
    { fr: "Excel partagé", en: "shared spreadsheet" },
    { fr: "e-mails triés un à un", en: "emails sorted one by one" },
    { fr: "factures ressaisies", en: "re-typed invoices" },
  ],
  apps: [
    { fr: "Facturation", en: "Invoicing" },
    { fr: "Comptabilité", en: "Accounting" },
    { fr: "Site web", en: "Website" },
    { fr: "CRM", en: "CRM" },
    { fr: "Peppol", en: "Peppol" },
  ],
  site: {
    cta: { fr: "Demander un devis", en: "Request a quote" },
    inbox: { fr: "Vos demandes", en: "Your enquiries" },
    entries: [
      { fr: "Binche — toiture", en: "Binche — roofing" },
      { fr: "Jumet — devis", en: "Jumet — quote" },
      { fr: "Morlanwelz — rappel", en: "Morlanwelz — call back" },
    ],
  },
  planning: {
    title: { fr: "Planning — semaine 38", en: "Schedule — week 38" },
    sample: { fr: "Exemple", en: "Sample" },
    days: [
      { fr: "Lun", en: "Mon" },
      { fr: "Mar", en: "Tue" },
      { fr: "Mer", en: "Wed" },
      { fr: "Jeu", en: "Thu" },
      { fr: "Ven", en: "Fri" },
    ],
    rows: PLANNING_ROWS,
    today: { fr: "Aujourd’hui", en: "Today" },
    checklist: [
      { fr: "Pose — chantier 12", en: "Install — site 12" },
      { fr: "Photos avant travaux", en: "Before-work photos" },
      { fr: "Signature du client", en: "Client signature" },
    ],
  },
};

export type OfferId =
  "intro" | "diagnostic" | "site" | "automation" | "software" | "care";

type Offer = {
  id: OfferId;
  name: Bilingual;
  price: Price;
  /** Ce que le client obtient, en une ligne : c’est aussi la description de l’offre dans le JSON-LD. */
  summary: Bilingual;
};

/**
 * L’échelle d’offres, dans l’ordre où un client la gravit. **Montants hors TVA** : c’est la base
 * de calcul commerciale, celle du JSON-LD et celle de l’affichage — ces tarifs s’adressent à des
 * professionnels. Le total TVA comprise accompagne chaque montant pour le particulier
 * (`lib/price.ts`). Les planchers viennent du catalogue « Offres & tarifs » du Notion, réconcilié
 * avec le Business Plan quand les deux se recoupent — c’est le seul endroit où ils vivent.
 */
export const OFFERS: Offer[] = [
  {
    id: "intro",
    name: { fr: "Premier échange", en: "First conversation" },
    price: { amount: 0, from: false, monthly: false },
    summary: {
      fr: "Un avis franc sous 24 h",
      en: "An honest opinion within 24 hours",
    },
  },
  {
    id: "diagnostic",
    name: { fr: "Diagnostic", en: "Diagnostic" },
    price: { amount: 600, from: true, monthly: false },
    summary: {
      fr: "Ce qui coince, chiffré",
      en: "What is broken, costed",
    },
  },
  {
    id: "site",
    name: { fr: "Site internet", en: "Website" },
    price: { amount: 900, from: true, monthly: false },
    summary: {
      fr: "Une vitrine qui travaille",
      en: "A site that does its job",
    },
  },
  {
    id: "automation",
    name: { fr: "Automatisation", en: "Automation" },
    price: { amount: 900, from: true, monthly: false },
    summary: {
      fr: "Une tâche supprimée",
      en: "One task gone for good",
    },
  },
  {
    id: "software",
    name: { fr: "Logiciel métier", en: "Business software" },
    price: { amount: 5000, from: true, monthly: false },
    summary: {
      fr: "Votre outil sur mesure",
      en: "Your custom tool",
    },
  },
  {
    id: "care",
    name: { fr: "Suivi", en: "Care plan" },
    price: { amount: 99, from: true, monthly: true },
    summary: {
      fr: "Hébergé, surveillé, entretenu",
      en: "Hosted, monitored, maintained",
    },
  },
];

export type FaqEntry = {
  q: Bilingual;
  a: Bilingual;
};

/** Partagée entre l’accueil et la page automatisation : une seule formulation de l’obligation. */
export const PEPPOL_FAQ: FaqEntry = {
  q: {
    fr: "La facture électronique Peppol est obligatoire : pouvez-vous m’aider ?",
    en: "Peppol e-invoicing is now mandatory — can you help?",
  },
  a: {
    fr: "Depuis le 1er janvier 2026, les entreprises belges assujetties à la TVA s’échangent leurs factures sous forme électronique structurée, via le réseau Peppol. Je ne remplace pas votre comptable : je branche votre facturation sur le reste de vos outils, pour que les factures entrantes et sortantes ne soient plus retraitées à la main.",
    en: "Since 1 January 2026, VAT-registered Belgian businesses exchange invoices in a structured electronic format over the Peppol network. I don’t replace your accountant: I connect your invoicing to the rest of your tools, so incoming and outgoing invoices are no longer re-handled by hand.",
  },
};

export const FAQ: FaqEntry[] = [
  {
    q: { fr: "Combien ça coûte ?", en: "How much does it cost?" },
    a: {
      fr: "Le premier échange est gratuit. Les étapes suivantes ont un prix affiché, du diagnostic au logiciel métier : voyez les tarifs plus haut. Le montant exact est fixé par écrit avant de commencer — jamais de facture surprise en cours de route.",
      en: "The first conversation is free. Each following step has a published price, from the diagnostic to the business software: see pricing above. The exact amount is set in writing before we start — never a surprise invoice along the way.",
    },
  },
  {
    q: {
      fr: "Que comprend le suivi mensuel ?",
      en: "What does the monthly care plan include?",
    },
    a: {
      fr: "Surveillance, sauvegardes, mises à jour contrôlées, petites corrections, vérification du domaine et du certificat, et un rapport synthétique. Le support y est non urgent. Ce forfait ne couvre pas une refonte, une nouvelle fonctionnalité importante ni une astreinte 24 h/24 : ces besoins font l’objet d’un devis à part. Le périmètre exact est écrit dans le contrat.",
      en: "Monitoring, backups, controlled updates, small fixes, domain and certificate checks, and a short report. Support is non-urgent. The plan does not cover a redesign, a major new feature or round-the-clock standby: those are quoted separately. The exact scope is written into the contract.",
    },
  },
  {
    q: {
      fr: "Comment savoir si ma tâche peut être automatisée ?",
      en: "How do I know if my task can be automated?",
    },
    a: {
      fr: "Si elle se répète, suit des règles et passe par un ordinateur, il y a de bonnes chances. Décrivez-la en quelques lignes dans le formulaire : je vous réponds franchement, y compris quand la réponse est non, ou quand un simple réglage de votre logiciel actuel suffit.",
      en: "If it repeats, follows rules and goes through a computer, odds are good. Describe it in a few lines in the form: I’ll answer honestly — including when the answer is no, or when a simple setting in your current software is enough.",
    },
  },
  {
    q: {
      fr: "Je n’y connais rien en informatique, est-ce un problème ?",
      en: "I know nothing about IT — is that a problem?",
    },
    a: {
      fr: "C’est même la situation la plus courante. Vous m’expliquez votre problème avec vos mots, je traduis en solution. Je ne vous ferai jamais un devis bourré de termes techniques que vous devriez aller chercher sur Google pour comprendre ce que vous payez.",
      en: "That is in fact the most common situation. You explain your problem in your own words, I translate it into a solution. You’ll never get a quote stuffed with technical terms you’d have to google to understand what you’re paying for.",
    },
  },
  {
    q: {
      fr: "Faut-il changer de logiciels ?",
      en: "Do I have to change software?",
    },
    a: {
      fr: "Rarement. J’automatise d’abord autour de ce que vous utilisez déjà — Excel, votre logiciel de facturation, votre boîte mail. Changer d’outil n’est proposé que s’il vous coûte plus qu’il ne vous rapporte.",
      en: "Rarely. I automate around what you already use first — spreadsheets, your invoicing software, your mailbox. Switching tools is only suggested when one costs you more than it gives back.",
    },
  },
  {
    q: {
      fr: "Qu’est-ce que l’intelligence artificielle peut m’apporter concrètement ?",
      en: "What can artificial intelligence actually do for me?",
    },
    a: {
      fr: "Du temps, pas de la magie. Trier automatiquement les demandes qui arrivent par mail, extraire les informations d’un PDF au lieu de les recopier, rédiger un premier jet de réponse, résumer des documents longs. Je ne vous vendrai jamais de l’IA là où un simple script fait le travail pour bien moins cher.",
      en: "Time, not magic. Automatically sorting incoming email requests, pulling data out of a PDF instead of re-typing it, drafting a first reply, summarising long documents. I’ll never sell you AI where a plain script does the job for far less.",
    },
  },
  PEPPOL_FAQ,
  {
    q: {
      fr: "En combien de temps est-ce prêt ?",
      en: "How long until it’s ready?",
    },
    a: {
      fr: "Une automatisation ciblée se met en place en quelques semaines. Un logiciel métier, comptez de un à trois mois selon l’ampleur. Dans tous les cas vous voyez une première version qui fonctionne très tôt, pas seulement à la fin.",
      en: "A targeted automation is in place within a few weeks. Custom business software runs one to three months depending on scope. In every case you see a working first version early, not only at the end.",
    },
  },
  {
    q: {
      fr: "Comment se passe le paiement ?",
      en: "How does payment work?",
    },
    a: {
      fr: "Vous ne payez rien à la commande. Le devis fixe le montant par écrit avant qu’on commence, et la facture part après la prestation. Une mission longue se découpe en étapes, chacune avec son devis et sa facture, pour que vous puissiez vous arrêter après n’importe laquelle.",
      en: "You pay nothing up front. The quote sets the amount in writing before we start, and the invoice goes out after the work is done. A longer engagement is split into steps, each with its own quote and invoice, so you can stop after any of them.",
    },
  },
  {
    q: {
      fr: "Est-ce que je reste propriétaire de l’outil et de mes données ?",
      en: "Do I stay the owner of the tool and my data?",
    },
    a: {
      fr: "Toujours. Le code source vous est livré, vos données restent les vôtres, et je vous explique comment tout récupérer si un jour vous partez ailleurs. Vous n’êtes captif de personne, moi compris.",
      en: "Always. The source code is delivered to you, your data stays yours, and I show you how to take everything with you if you ever move on. You’re locked into no one — including me.",
    },
  },
  {
    q: {
      fr: "J’ai déjà un logiciel ou un prestataire, pouvez-vous reprendre ?",
      en: "I already have software or a provider — can you take over?",
    },
    a: {
      fr: "Oui. Je reprends l’existant, je vous dis honnêtement ce qui vaut la peine d’être gardé et ce qui doit être refait, et je m’occupe de la transition. Vous n’avez pas à la gérer vous-même.",
      en: "Yes. I take over what exists, tell you honestly what’s worth keeping and what needs rebuilding, and handle the transition. You don’t have to manage it yourself.",
    },
  },
];

type CoverageArea = {
  label: Bilingual;
  cities: string[];
};

/** Communes servies : alimente l’areaServed du JSON-LD et la zone d’intervention de la page dépannage. */
export const COVERAGE: CoverageArea[] = [
  {
    label: {
      fr: "Autour de Chapelle-lez-Herlaimont",
      en: "Around Chapelle-lez-Herlaimont",
    },
    cities: [
      "Chapelle-lez-Herlaimont",
      "Godarville",
      "Piéton",
      "Manage",
      "Seneffe",
      "Morlanwelz",
    ],
  },
  {
    label: { fr: "Région de Charleroi", en: "Charleroi area" },
    cities: [
      "Charleroi",
      "Courcelles",
      "Fontaine-l’Évêque",
      "Anderlues",
      "Montigny-le-Tilleul",
      "Gosselies",
    ],
  },
  {
    label: { fr: "Le Centre", en: "La Louvière area" },
    cities: [
      "La Louvière",
      "Binche",
      "Le Rœulx",
      "Soignies",
      "Braine-le-Comte",
      "Écaussinnes",
    ],
  },
  {
    label: { fr: "Mons & Borinage", en: "Mons & Borinage" },
    cities: [
      "Mons",
      "Jurbise",
      "Quaregnon",
      "Boussu",
      "Frameries",
      "Saint-Ghislain",
    ],
  },
  {
    label: { fr: "Brabant wallon", en: "Walloon Brabant" },
    cities: ["Nivelles", "Genappe", "Waterloo", "Ottignies", "Wavre", "Tubize"],
  },
  {
    label: { fr: "Sambre & Namurois", en: "Sambre & Namur area" },
    cities: [
      "Namur",
      "Fleurus",
      "Sambreville",
      "Châtelet",
      "Gembloux",
      "Thuin",
    ],
  },
];

/**
 * Section « Qui je suis ». `photo` vide masque le portrait sans casser la mise en page —
 * ne jamais y mettre une image d’illustration générique : un faux visage détruit la confiance
 * qu’un vrai visage installe. Le texte n’affirme que des faits vérifiables : toute ligne ajoutée
 * ici doit pouvoir être prouvée.
 */
/**
 * Le parcours en trois temps, chacun titré : un pavé de prose à côté d'un portrait ne se lit pas.
 * Chaque phrase doit tenir devant quelqu'un qui vérifie — pas de diplôme qui n'existe pas, pas
 * d'ancienneté arrondie, pas de compliment rapporté. `icon` est typé par le jeu de glyphes, donc
 * un nom inexistant casse la compilation au lieu de rendre une case vide.
 */
type StoryStep = { icon: IconName; title: Bilingual; body: Bilingual };

const STORY: StoryStep[] = [
    {
      icon: "wrench",
      title: {
        fr: "Un parcours orienté solutions",
        en: "A path aimed at solutions",
      },
      body: {
        fr: "J’ai commencé à démonter des ordinateurs vers dix ans. Je voulais comprendre comment ils fonctionnaient, réparer ceux de la maison et découvrir ce qu’il y avait derrière l’écran. Cette curiosité m’a suivi : des réseaux et systèmes au développement, en passant par le support informatique.",
        en: "I started taking computers apart when I was about ten. I wanted to understand how they worked, fix the ones at home, and find out what was behind the screen. That curiosity stayed with me — from networks and systems to software development, by way of the IT support desk.",
      },
    },
    {
      icon: "code",
      title: {
        fr: "De la pratique au produit",
        en: "From hands-on to product",
      },
      body: {
        fr: "C’est dans le support que j’ai compris ce qui me plaisait le plus : ne pas seulement résoudre un problème, mais faire en sorte qu’il ne se répète plus. J’ai créé des outils pour supprimer des tâches que mon équipe refaisait chaque jour à la main. Plus tard, en agence, j’ai développé des sites et des applications avec Django, React et Docker.",
        en: "It was on the support desk that I understood what I enjoyed most: not just solving a problem, but making sure it would not come back. I built tools that removed what my team was redoing by hand every day. Later, at an agency, I developed websites and applications with Django, React and Docker.",
      },
    },
    {
      icon: "spark",
      title: { fr: "Une approche terrain", en: "A ground-level approach" },
      body: {
        fr: "Avec Silexio, je poursuis la même idée : rendre l’informatique réellement utile. Pas ajouter un outil de plus pour le plaisir, ni tout remplacer systématiquement, mais comprendre votre quotidien et construire ce qui vous simplifie vraiment le travail.",
        en: "With Silexio I am following the same idea: making technology genuinely useful. Not adding one more tool for its own sake, nor replacing everything on principle, but understanding your day-to-day and building what actually makes the work simpler.",
      },
    },
];

type Proof = { id: SocialId; label: Bilingual; url: string };

const PROOFS: Proof[] = [
  {
    id: "github",
    label: { fr: "Mon code sur GitHub", en: "My code on GitHub" },
    url: URLS.githubPersonal,
  },
  {
    id: "linkedin",
    label: { fr: "Profil LinkedIn", en: "LinkedIn profile" },
    url: URLS.linkedinPersonal,
  },
];

export const ABOUT = {
  eyebrow: { fr: "Qui je suis", en: "Who I am" },
  title: {
    fr: "Une personne, pas un standard",
    en: "A person, not a switchboard",
  },
  lead: {
    fr: "Nicolas Wieckiewicz, développeur full-stack à Chapelle-lez-Herlaimont. De la première idée au code livré, vous échangez directement avec la personne qui développe votre solution.",
    en: "Nicolas Wieckiewicz, a full-stack developer in Chapelle-lez-Herlaimont. From the initial idea to the final code, you’ll work directly with the person developing your solution.",
  },
  story: STORY,
  /**
   * Profils publics où un inconnu vérifie le parcours sans avoir à me croire. Liste vide =
   * la rangée disparaît. Ne jamais y mettre une promesse maison : seul compte ce qui se
   * contrôle chez un tiers.
   */
  proofs: PROOFS,
  photo: "/nicolas.webp",
  photoWidth: 860,
  photoHeight: 894,
  photoAlt: {
    fr: "Portrait de Nicolas Wieckiewicz, fondateur de Silexio",
    en: "Portrait of Nicolas Wieckiewicz, founder of Silexio",
  },
} satisfies Record<string, unknown>;

type Review = {
  id: string;
  platform: string;
  url: string;
  rating: number;
  count: number;
  /** Date du relevé manuel (ISO). Affichée telle quelle : une note non datée finit par mentir. */
  checkedOn: string;
};

/**
 * Avis publics agrégés. Une URL vide ou un compteur à zéro masque la carte : ne jamais inventer
 * une note ni un nombre d’avis. Ces valeurs restent hors du JSON-LD — Google refuse le markup
 * aggregateRating construit sur des avis collectés ailleurs, et un rich snippet refusé coûte
 * plus qu’il ne rapporte.
 *
 * Les chiffres de Google vivent dans `lib/reviews.json`, écrit par `scripts/refresh-reviews.mjs`
 * et jamais à la main : un relevé est une mesure, pas du contenu. Trustpilot reste manuel, la
 * plateforme répondant 403 à tout script.
 */
export const REVIEWS: Review[] = [
  {
    id: "google",
    platform: "Google",
    url: "https://g.page/r/CQS4cLlmMzj6ECE",
    ...MEASURED.google,
  },
  {
    id: "trustpilot",
    platform: "Trustpilot",
    url: "https://fr-be.trustpilot.com/review/silexio.be",
    rating: 0,
    count: 0,
    checkedOn: "2026-08-24",
  },
];

/** En dessous de ce nombre d’avis, la plateforme reste masquée : « 1 avis » dessert plus qu’il ne prouve. */
export const MIN_REVIEWS = 3;

type ProjectStatus = "production" | "shipped" | "wip";

type ProjectShot = {
  src: string;
  alt: Bilingual;
  width: number;
  height: number;
};

type ProjectKind = "client" | "personal";

type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  kind: ProjectKind;
  site: string;
  repo: string;
  /** Lien de téléchargement ou d’installation. Vide = bouton masqué. */
  install: string;
  stack: string[];
  summary: Bilingual;
  /** Capture de la diapositive. Absente = couverture typographique au nom du projet. */
  shot?: ProjectShot;
  /** Temps rendu au client, affiché seulement une fois ses trois chiffres fournis (cf. lib/roi.ts). */
  roi?: Roi;
};

/**
 * Projets livrés, dans l’ordre du diaporama. `site` ou `repo` vide masque le lien correspondant —
 * ne jamais publier l’URL d’un outil livré chez un client sans son accord.
 */
export const PROJECTS: Project[] = [
  {
    id: "scaleneo",
    name: "SCALENEO",
    status: "production",
    kind: "client",
    site: "https://scaleneo.silexio.be",
    repo: "https://github.com/Silexio/SCALENEO",
    install: "",
    stack: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
    summary: {
      fr: "Un bilan de lombalgie déposé, les scores et l’hypothèse clinique en sortent calculés — sans que le fichier quitte le navigateur.",
      en: "Drop in a low-back-pain assessment, get the scores and the clinical hypothesis back — without the file ever leaving the browser.",
    },
    shot: {
      src: "/work/scaleneo.webp",
      width: 1440,
      height: 810,
      alt: {
        fr: "Écran de résultats de SCALENEO : bandeau « pas de drapeau rouge », cartes de scores cliniques, puis hypothèse clinique synthétisée.",
        en: "SCALENEO results screen: a « no red flag » banner, clinical score cards, then a synthesised clinical hypothesis.",
      },
    },
    roi: { minutesBefore: null, minutesAfter: null, reportsPerWeek: null },
  },
  {
    id: "reelmark",
    name: "Reelmark",
    status: "production",
    kind: "personal",
    site: "https://reelmark.silexio.be",
    repo: "https://github.com/TheSawkit/reelmark",
    install: "",
    stack: ["Next.js", "TypeScript", "TMDB"],
    summary: {
      fr: "Suivre et organiser tous les films et séries que vous avez vus.",
      en: "Track and organise every film and show you have watched.",
    },
    shot: {
      src: "/work/reelmark-dark.webp",
      width: 1440,
      height: 810,
      alt: {
        fr: "Tableau de bord de Reelmark : une série mise en avant, puis la rangée des épisodes à reprendre.",
        en: "Reelmark dashboard: a featured show, then the row of episodes left to finish.",
      },
    },
  },
  {
    id: "bridgemark",
    name: "BridgeMark",
    status: "shipped",
    kind: "personal",
    site: "",
    repo: "https://github.com/TheSawkit/BridgeMark",
    install: "https://github.com/TheSawkit/BridgeMark/releases/latest",
    stack: ["Swift", "SwiftUI", "macOS 13+"],
    summary: {
      fr: "Transférer ses favoris Safari vers Chrome, Brave ou Edge en un clic.",
      en: "Move your Safari bookmarks to Chrome, Brave or Edge in one click.",
    },
  },
  {
    id: "multiboot",
    name: "macOS Multiboot Creator",
    status: "shipped",
    kind: "personal",
    site: "",
    repo: "https://github.com/TheSawkit/macos_multiboot_creator",
    install: "https://github.com/TheSawkit/macos_multiboot_creator/releases",
    stack: ["Python", "macOS", "CLI"],
    summary: {
      fr: "Une clé USB capable d’installer plusieurs versions de macOS.",
      en: "A USB drive that can install several versions of macOS.",
    },
  },
];
