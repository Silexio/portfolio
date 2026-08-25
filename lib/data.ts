import type { Bilingual } from "@/lib/i18n/utils";

export const META = {
  title: {
    fr: "Développeur full-stack, IA & dépannage IT en Belgique",
    en: "Full-stack developer, AI & IT support in Belgium",
  },
  description: {
    fr: "Développeur full-stack et informaticien dans le Hainaut : sites web, applications, API, IA, automatisation, infrastructure et dépannage IT. Toute la Belgique.",
    en: "Full-stack developer and IT engineer in Hainaut: websites, web apps, APIs, AI, automation, infrastructure and IT support. Serving all of Belgium.",
  },
} satisfies Record<string, Bilingual>;

export const EMAIL = "contact@silexio.be";

/** Ancrage géographique du profil service-area : commune de rattachement, pas d'adresse de rue. */
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
 * `whatsappUrl` est un lien d'invitation : il ouvre la conversation sans publier le numéro,
 * qui n'a rien à faire dans ce dépôt public. Champs vides = affichage masqué.
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
  facebook: "https://www.facebook.com/silexio",
  instagram: "https://www.instagram.com/silexio.be",
} as const;

/** Règles d'ouverture du calendrier de rendez-vous (jours/heures en heure de Bruxelles). */
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

export const I18N = {
  nav: {
    services: { fr: "Services", en: "Services" },
    work: { fr: "Réalisations", en: "Work" },
    faq: { fr: "Questions", en: "FAQ" },
    contact: { fr: "Contact", en: "Contact" },
  },
  a11y: {
    skip: { fr: "Aller au contenu", en: "Skip to content" },
    menu: { fr: "Ouvrir le menu", en: "Open menu" },
    close: { fr: "Fermer", en: "Close" },
    toggleLang: { fr: "Passer en anglais", en: "Switch to French" },
    toggleTheme: { fr: "Basculer le thème", en: "Toggle theme" },
    home: { fr: "Silexio — retour en haut", en: "Silexio — back to top" },
    chapters: { fr: "Chapitres", en: "Chapters" },
    detail: { fr: "Voir le détail", en: "Show detail" },
    faqToggle: { fr: "Afficher la réponse", en: "Show the answer" },
    newTab: { fr: "ouvre un nouvel onglet", en: "opens in a new tab" },
    remove: { fr: "Retirer de la sélection", en: "Remove from selection" },
    socials: { fr: "Réseaux sociaux", en: "Social media" },
    selected: { fr: "dans votre sélection", en: "in your selection" },
  },
  hero: {
    eyebrow: {
      fr: "Chapelle-lez-Herlaimont · Hainaut",
      en: "Chapelle-lez-Herlaimont · Belgium",
    },
    status: { fr: "Disponible", en: "Available" },
    titlePre: {
      fr: "Développeur full-stack — sites, logiciels, automatisation.",
      en: "Full-stack developer — sites, software, automation.",
    },
    titleA: { fr: "Un informaticien", en: "An engineer" },
    titleB: { fr: "qui parle", en: "who speaks" },
    titleC: { fr: "votre langue.", en: "your language." },
    pitch: {
      fr: "Je crée des sites internet et des logiciels taillés pour votre métier, j'automatise les tâches qui vous font perdre du temps, et je dépanne votre matériel. Un seul interlocuteur, chez vous dans le Hainaut ou à distance partout en Belgique.",
      en: "I build websites and software cut for your trade, automate the tasks that eat your time, and fix your hardware. One point of contact — on-site in Hainaut, remote anywhere in Belgium.",
    },
    cta1: { fr: "Demander un devis gratuit", en: "Get a free quote" },
    cta2: { fr: "Voir mes réalisations", en: "See my work" },
    metaBaseLabel: { fr: "ZONE", en: "AREA" },
    metaBaseValue: { fr: "Hainaut · Wallonie", en: "Hainaut · Belgium" },
    metaBaseSub: { fr: "Sur place · À distance", en: "On-site · Remote" },
    metaStatusLabel: { fr: "RÉPONSE", en: "REPLY" },
    metaStatusValue: { fr: "Sous 24h", en: "Within 24h" },
  },
  services: {
    eyebrow: { fr: "Services", en: "Services" },
    title: { fr: "Comment\nje vous aide.", en: "How I\nhelp you." },
    subtitle: {
      fr: "Cochez ce qui vous parle — j'arrive préparé à notre premier échange, sans jargon.",
      en: "Tick what speaks to you — I'll come prepared to our first call, no jargon.",
    },
    add: { fr: "Ajouter", en: "Add" },
    added: { fr: "Sélectionné", en: "Selected" },
  },
  work: {
    eyebrow: { fr: "Réalisations", en: "Work" },
    title: { fr: "Ce qui tourne\ndéjà.", en: "What already\nruns." },
    subtitle: {
      fr: "Des projets livrés à de vrais clients. Vous voyez à quoi ça ressemble avant de me confier le vôtre.",
      en: "Projects delivered to real clients. You see what it looks like before trusting me with yours.",
    },
    site: { fr: "Voir le site", en: "Visit the site" },
    code: { fr: "Voir le code", en: "View the code" },
    install: { fr: "Installer", en: "Install" },
    client: { fr: "Projet client", en: "Client project" },
    personal: { fr: "Projet personnel", en: "Personal project" },
    github: { fr: "Voir mon GitHub", en: "View my GitHub" },
    prev: { fr: "Projet précédent", en: "Previous project" },
    next: { fr: "Projet suivant", en: "Next project" },
    goTo: { fr: "Aller au projet {name}", en: "Go to project {name}" },
    position: {
      fr: "{name} — projet {n} sur {total}",
      en: "{name} — project {n} of {total}",
    },
    status: {
      production: { fr: "En production", en: "In production" },
      shipped: { fr: "Livré", en: "Shipped" },
      wip: { fr: "En cours", en: "In progress" },
    },
  },
  stack: {
    eyebrow: { fr: "Sous le capot", en: "Under the hood" },
    title: { fr: "Pour les\ncurieux.", en: "For the\ncurious." },
    subtitle: {
      fr: "Cette section est le bonus technique — si ces noms ne vous disent rien, c'est parfaitement normal et ça ne change rien pour vous.",
      en: "This is the technical bonus — if these names mean nothing to you, that's perfectly fine and changes nothing for you.",
    },
  },
  faq: {
    eyebrow: { fr: "Questions fréquentes", en: "FAQ" },
    title: {
      fr: "Ce qu'on me\ndemande le plus.",
      en: "What I get\nasked most.",
    },
    subtitle: {
      fr: "Les réponses aux questions que vous vous posez avant même de décrocher votre téléphone.",
      en: "Answers to the questions you have before you even pick up the phone.",
    },
  },
  proof: {
    reviewsTitle: { fr: "Ce que disent les clients", en: "What clients say" },
    reviewsCta: { fr: "Lire les avis", en: "Read the reviews" },
    reviewsChecked: { fr: "relevé le", en: "checked on" },
    review: { fr: "avis", en: "review" },
    reviews: { fr: "avis", en: "reviews" },
  },
  contact: {
    eyebrow: { fr: "Contact", en: "Contact" },
    titleA: { fr: "On en", en: "Let's" },
    titleB: { fr: "parle ?", en: "talk." },
    sub: {
      fr: "Un site à créer, un logiciel à imaginer, un ordinateur qui rame. Expliquez-moi avec vos mots — je réponds sous 24h, et le devis est gratuit.",
      en: "A site to build, software to imagine, a computer that crawls. Tell me in your own words — I reply within 24h, and the quote is free.",
    },
    cal: { fr: "Réserver un appel", en: "Book a call" },
    quote: { fr: "Demander un devis", en: "Request a quote" },
    interests: { fr: "Ce qui vous intéresse", en: "What caught your eye" },
    subject: { fr: "DEMANDE DE DEVIS", en: "QUOTE REQUEST" },
    servicesEmpty: { fr: "(à préciser)", en: "(to specify)" },
    emailBody: {
      fr: "Bonjour Silexio,\n\nJe suis intéressé par vos services suivants : {services}\n\nMon projet : (décrivez en quelques mots ce que vous souhaitez réaliser)\nCe que j'ai déjà : (site existant, maquettes, contenu, nom de domaine, assets…)\nDélai souhaité : \nBudget indicatif : \n\nAu plaisir d'échanger,",
      en: "Hi Silexio,\n\nI'm interested in the following services: {services}\n\nMy project: (briefly describe what you'd like to build)\nWhat I already have: (existing site, mockups, content, domain name, assets…)\nDesired timeline: \nRough budget: \n\nLooking forward to talking,",
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
      en: "Couldn't load availability. Try again.",
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
      fr: "Votre numéro me sert à vous joindre et à l'ajouter à ma liste de confiance (anti-spam).",
      en: "Your number lets me reach you and add you to my trusted list (anti-spam).",
    },
    mode: { fr: "Format", en: "Format" },
    modeVideo: { fr: "Visio", en: "Video" },
    modeCall: { fr: "Appel", en: "Call" },
    message: { fr: "Message", en: "Message" },
    messagePlaceholder: {
      fr: "En une phrase, votre besoin (optionnel)",
      en: "In one line, your need (optional)",
    },
    optional: { fr: "optionnel", en: "optional" },
    interests: { fr: "Ce qui vous intéresse", en: "What caught your eye" },
    submit: { fr: "Envoyer la demande", en: "Send request" },
    submitting: { fr: "Envoi…", en: "Sending…" },
    successTitle: { fr: "Demande envoyée", en: "Request sent" },
    successBody: {
      fr: "Merci ! Je vous confirme le rendez-vous par email très vite.",
      en: "Thanks! I'll confirm the booking by email shortly.",
    },
    errorGeneric: {
      fr: "Une erreur est survenue. Réessayez.",
      en: "Something went wrong. Try again.",
    },
    errorSlotTaken: {
      fr: "Ce créneau vient d'être pris. Choisissez-en un autre.",
      en: "This slot was just taken. Please pick another.",
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
    captchaLabel: {
      fr: "Vérification anti-robot",
      en: "Anti-bot verification",
    },
  },
  footer: {
    rights: { fr: "Tous droits réservés", en: "All rights reserved" },
    tag: { fr: "Fait en Belgique", en: "Made in Belgium" },
    tagline: {
      fr: "Sites internet, logiciels sur mesure et dépannage informatique. Un seul interlocuteur, dans le Hainaut ou à distance.",
      en: "Websites, custom software and IT support. One person to talk to, across Hainaut or remotely.",
    },
    navTitle: { fr: "Navigation", en: "Navigation" },
    contactTitle: { fr: "Contact", en: "Contact" },
    followTitle: { fr: "Suivre", en: "Follow" },
    legal: { fr: "Mentions légales", en: "Legal" },
    country: { fr: "Belgique", en: "Belgium" },
    vatLabel: { fr: "TVA", en: "VAT" },
    seat: {
      fr: "Facturation via la coopérative",
      en: "Invoiced through the cooperative",
    },
    whatsapp: { fr: "Écrire sur WhatsApp", en: "Message on WhatsApp" },
  },
} as const;

/** Libellés de la section réservation résolus en strings (un par clé de I18N.booking). */
export type BookingLabels = Record<keyof typeof I18N.booking, string>;

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
      packages: { fr: "Intérêts", en: "Interests" },
    },
    confirm: { fr: "Confirmer le rendez-vous", en: "Confirm booking" },
    refuse: { fr: "Refuser", en: "Decline" },
    hint: {
      fr: "Pense à ajouter le numéro à ta liste de confiance avant de confirmer.",
      en: "Remember to whitelist the number before confirming.",
    },
  },
  pending: {
    subject: {
      fr: "Votre demande de rendez-vous — Silexio",
      en: "Your booking request — Silexio",
    },
    body: {
      fr: "Bonjour {name},\n\nVotre demande de rendez-vous le {slot} ({mode}) a bien été reçue.\nJe la confirme par email très vite — vous recevrez alors le lien visio ou les modalités de l'appel.\n\nÀ très vite,\nNicolas — Silexio",
      en: "Hi {name},\n\nYour booking request for {slot} ({mode}) has been received.\nI'll confirm it by email shortly — you'll then get the video link or the call details.\n\nTalk soon,\nNicolas — Silexio",
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
      fr: "Ajoutez-le à votre agenda : {url}\n(Le fichier .ics en pièce jointe fait la même chose dans Apple Calendar, Outlook ou Infomaniak.)",
      en: "Add it to your calendar: {url}\n(The attached .ics does the same in Apple Calendar, Outlook or Infomaniak.)",
    },
    calendarLabel: {
      fr: "Ajouter à Google Agenda",
      en: "Add to Google Calendar",
    },
    meetingVideo: {
      fr: "Lien visio : {url}\n(Je rejoins en premier pour ouvrir la salle.)",
      en: "Video link: {url}\n(I'll join first to open the room.)",
    },
    meetingCall: {
      fr: "Je vous appelle au numéro fourni à l'heure convenue.",
      en: "I'll call you on the number you provided at the agreed time.",
    },
  },
  refused: {
    subject: {
      fr: "À propos de votre demande de rendez-vous",
      en: "About your booking request",
    },
    body: {
      fr: "Bonjour {name},\n\nJe ne peux malheureusement pas honorer le créneau du {slot}.\nN'hésitez pas à en choisir un autre sur silexio.be ou à me répondre directement.\n\nÀ bientôt,\nNicolas — Silexio",
      en: "Hi {name},\n\nUnfortunately I can't take the {slot} slot.\nFeel free to pick another one on silexio.be or reply directly.\n\nBest,\nNicolas — Silexio",
    },
  },
  ownerConfirmed: {
    subject: {
      fr: "RDV confirmé — {slot} — {name}",
      en: "Booking confirmed — {slot} — {name}",
    },
    body: {
      fr: "Tu as confirmé le rendez-vous avec {name} ({email} · {phone}) le {slot}.\n\n{meetingInfo}\n\n{calendar}\n\nL'événement est aussi en pièce jointe (.ics).",
      en: "You confirmed the booking with {name} ({email} · {phone}) on {slot}.\n\n{meetingInfo}\n\n{calendar}\n\nThe event is also attached (.ics).",
    },
    meetingCall: {
      fr: "Format : appel. Tu appelles {name} au numéro fourni.",
      en: "Format: call. You call {name} on the provided number.",
    },
  },
  ics: {
    summary: { fr: "Rendez-vous Silexio", en: "Silexio booking" },
    descriptionVideo: {
      fr: "Visio Silexio — lien : {url}",
      en: "Silexio video call — link: {url}",
    },
    descriptionCall: {
      fr: "Appel téléphonique avec Silexio.",
      en: "Phone call with Silexio.",
    },
    locationCall: { fr: "Appel téléphonique", en: "Phone call" },
  },
} as const;

/** Strings de la page d'action propriétaire (confirmation/refus en deux temps). */
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

export type PackageId =
  "site" | "webapp" | "api" | "infra" | "automation" | "it";

type Package = {
  id: PackageId;
  num: string;
  title: Bilingual;
  body: Bilingual;
  tags: string[];
};

export const PACKAGES: Package[] = [
  {
    id: "site",
    num: "01",
    title: { fr: "Site internet", en: "Website" },
    body: {
      fr: "Un site qui vous ramène des clients au lieu de dormir sur Google. Rapide, impeccable sur téléphone, trouvable par les gens qui cherchent ce que vous faites. De la page unique au site complet avec prise de rendez-vous en ligne.",
      en: "A site that brings you clients instead of sleeping on Google. Fast, flawless on mobile, findable by the people looking for what you do. From a single page to a full site with online booking.",
    },
    tags: ["Next.js", "SEO", "Mobile"],
  },
  {
    id: "webapp",
    num: "02",
    title: { fr: "Logiciel sur mesure", en: "Custom software" },
    body: {
      fr: "L'outil qui n'existe nulle part dans le commerce, taillé pour votre métier. Devis, plannings, stocks, fiches clients, tableaux de bord — accessible depuis n'importe quel ordinateur ou téléphone, sans rien installer.",
      en: "The tool no off-the-shelf product covers, cut for your trade. Quotes, schedules, stock, client records, dashboards — from any computer or phone, nothing to install.",
    },
    tags: ["TypeScript", "PostgreSQL", "Paiements"],
  },
  {
    id: "api",
    num: "03",
    title: { fr: "Vos outils connectés", en: "Connected tools" },
    body: {
      fr: "Votre site, votre caisse, votre comptabilité et votre fichier clients qui se parlent enfin. Fini les copier-coller d'un logiciel à l'autre et les erreurs de recopie qui coûtent cher.",
      en: "Your website, till, accounting and client list finally talking to each other. No more copy-pasting between tools, no more costly typos.",
    },
    tags: ["API", "Webhooks", "FastAPI"],
  },
  {
    id: "infra",
    num: "04",
    title: { fr: "Hébergement & serveurs", en: "Hosting & servers" },
    body: {
      fr: "Votre site et vos données hébergés, sauvegardés et surveillés en continu. S'il tombe à trois heures du matin, je le sais avant vous — et c'est déjà réparé quand vous ouvrez les yeux.",
      en: "Your site and data hosted, backed up and monitored around the clock. If it goes down at 3am, I know before you do — and it's fixed by the time you wake up.",
    },
    tags: ["Docker", "Linux", "Cloudflare"],
  },
  {
    id: "automation",
    num: "05",
    title: { fr: "Automatisation & IA", en: "Automation & AI" },
    body: {
      fr: "Les tâches répétitives qui vous mangent vos soirées : recopier des données, relancer les factures impayées, trier des mails, produire le même rapport chaque mois. On les confie à une machine, vous récupérez votre temps.",
      en: "The repetitive work eating your evenings: re-typing data, chasing unpaid invoices, sorting mail, producing the same report every month. Hand it to a machine, get your time back.",
    },
    tags: ["Python", "IA", "Automatisation"],
  },
  {
    id: "it",
    num: "06",
    title: { fr: "Dépannage informatique", en: "IT support" },
    body: {
      fr: "Ordinateur qui rame, imprimante capricieuse, wifi qui coupe, boîte mail bloquée, sauvegarde à mettre en place. Je passe chez vous dans le Hainaut ou je prends la main à distance, particuliers comme entreprises.",
      en: "Slow computer, stubborn printer, dropping wifi, locked mailbox, backups to set up. I come to you in Hainaut or take over remotely — private individuals and businesses alike.",
    },
    tags: ["macOS", "Windows", "Réseau"],
  },
];

type FaqEntry = {
  q: Bilingual;
  a: Bilingual;
};

export const FAQ: FaqEntry[] = [
  {
    q: {
      fr: "Combien coûte un site internet ?",
      en: "How much does a website cost?",
    },
    a: {
      fr: "Cela dépend de ce qu'il doit faire. Une page unique bien faite démarre autour de quelques centaines d'euros ; un site complet avec réservation en ligne ou espace client, c'est un autre budget. Je vous donne un prix ferme et écrit avant de commencer — jamais de facture surprise en cours de route.",
      en: "It depends on what it has to do. A well-built single page starts around a few hundred euros; a full site with online booking or a client area is a different budget. You get a firm written price before we start — never a surprise invoice along the way.",
    },
  },
  {
    q: {
      fr: "Je n'y connais rien en informatique, est-ce un problème ?",
      en: "I know nothing about IT — is that a problem?",
    },
    a: {
      fr: "C'est même le cas de la plupart de mes clients. Vous m'expliquez votre problème avec vos mots, je traduis en solution. Je ne vous ferai jamais un devis bourré de termes techniques que vous devriez aller chercher sur Google pour comprendre ce que vous payez.",
      en: "That's true of most of my clients. You explain your problem in your own words, I translate it into a solution. You'll never get a quote stuffed with technical terms you'd have to google to understand what you're paying for.",
    },
  },
  {
    q: {
      fr: "Dans quelles communes vous déplacez-vous ?",
      en: "Which areas do you travel to?",
    },
    a: {
      fr: "Je suis basé à Chapelle-lez-Herlaimont et je me déplace dans tout le Hainaut : Charleroi, La Louvière, Manage, Seneffe, Morlanwelz, Courcelles, Binche, Anderlues, Fontaine-l'Évêque, Mons, Soignies, Thuin, ainsi que le Brabant wallon. Partout ailleurs en Belgique, on travaille à distance.",
      en: "I'm based in Chapelle-lez-Herlaimont and travel across Hainaut: Charleroi, La Louvière, Manage, Seneffe, Morlanwelz, Courcelles, Binche, Anderlues, Fontaine-l'Évêque, Mons, Soignies, Thuin, plus Walloon Brabant. Anywhere else in Belgium, we work remotely.",
    },
  },
  {
    q: {
      fr: "Vous dépannez aussi les particuliers ?",
      en: "Do you help private individuals too?",
    },
    a: {
      fr: "Oui. Ordinateur lent, virus, écran bleu, imprimante qui refuse de fonctionner, wifi capricieux, photos à récupérer, nouveau PC à configurer : je traite les particuliers exactement comme les entreprises, sans condescendance et sans facturer le temps passé à vous expliquer.",
      en: "Yes. Slow computer, viruses, blue screens, a printer that refuses to work, flaky wifi, photos to recover, a new PC to set up: I treat private individuals exactly like businesses — no condescension, and no charging for the time spent explaining.",
    },
  },
  {
    q: {
      fr: "En combien de temps mon projet sera-t-il prêt ?",
      en: "How long until my project is ready?",
    },
    a: {
      fr: "Un dépannage se règle souvent dans la journée. Un site vitrine prend généralement deux à quatre semaines. Un logiciel métier, comptez de un à trois mois selon l'ampleur. Dans tous les cas vous voyez une première version fonctionnelle très tôt, pas seulement à la fin.",
      en: "A repair is often sorted the same day. A showcase site usually takes two to four weeks. Custom business software runs one to three months depending on scope. In every case you see a working first version early, not only at the end.",
    },
  },
  {
    q: {
      fr: "Qu'est-ce que l'intelligence artificielle peut m'apporter concrètement ?",
      en: "What can artificial intelligence actually do for me?",
    },
    a: {
      fr: "Du temps, pas de la magie. Trier automatiquement les demandes qui arrivent par mail, extraire les informations d'un PDF au lieu de les recopier, rédiger un premier jet de réponse, résumer des documents longs. Je ne vous vendrai jamais de l'IA là où un simple script fait le travail pour bien moins cher.",
      en: "Time, not magic. Automatically sorting incoming email requests, pulling data out of a PDF instead of re-typing it, drafting a first reply, summarising long documents. I'll never sell you AI where a plain script does the job for far less.",
    },
  },
  {
    q: {
      fr: "J'ai déjà un site ou un prestataire, pouvez-vous reprendre ?",
      en: "I already have a site or provider — can you take over?",
    },
    a: {
      fr: "Oui, c'est une demande courante. Je récupère l'existant, je vous dis honnêtement ce qui vaut la peine d'être gardé et ce qui doit être refait, et je m'occupe du transfert du nom de domaine et de l'hébergement. Vous n'avez pas à gérer la transition vous-même.",
      en: "Yes, that's a common request. I take over what exists, tell you honestly what's worth keeping and what needs rebuilding, and handle the domain and hosting transfer. You don't have to manage the migration yourself.",
    },
  },
  {
    q: {
      fr: "Est-ce que je reste propriétaire de mon site et de mes données ?",
      en: "Do I stay the owner of my site and data?",
    },
    a: {
      fr: "Toujours. Le nom de domaine est à votre nom, le code source vous est livré, vos données restent les vôtres et je vous explique comment tout récupérer si un jour vous partez ailleurs. Vous n'êtes captif de personne, moi compris.",
      en: "Always. The domain is in your name, the source code is delivered to you, your data stays yours, and I show you how to take everything with you if you ever move on. You're locked into no one — including me.",
    },
  },
];

type CoverageArea = {
  label: Bilingual;
  cities: string[];
};

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
      "Fontaine-l'Évêque",
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
 * ne jamais y mettre une image d'illustration générique : un faux visage détruit la confiance
 * qu'un vrai visage installe. Le texte n'affirme que des faits vérifiables (pas d'ancienneté
 * inventée) : toute ligne ajoutée ici doit pouvoir être prouvée.
 */
export const ABOUT = {
  eyebrow: { fr: "Qui je suis", en: "Who I am" },
  title: {
    fr: "Une personne,\npas un standard.",
    en: "A person,\nnot a switchboard.",
  },
  name: "Nicolas Wieckiewicz",
  role: { fr: "Fondateur de Silexio", en: "Founder of Silexio" },
  photo: "",
  photoAlt: {
    fr: "Portrait de Nicolas Wieckiewicz",
    en: "Portrait of Nicolas Wieckiewicz",
  },
  body: [
    {
      fr: "Je suis développeur full-stack et informaticien indépendant, installé à Chapelle-lez-Herlaimont. J'accompagne des PME, des fiduciaires, des indépendants et des particuliers du Hainaut : un site à créer, un logiciel métier à imaginer, un parc informatique à remettre d'aplomb. Le même interlocuteur gère le développement et l'IT au quotidien : installation de postes, réseau, sauvegardes, maintenance, sécurité, et les scripts qui suppriment une corvée récurrente.",
      en: "I'm an independent full-stack developer and IT engineer based in Chapelle-lez-Herlaimont. I work with small businesses, accounting firms, freelancers and private individuals across Hainaut: a site to build, custom software to design, a computer setup to put back in order. The same person handles the development and the day-to-day IT: workstation setup, network, backups, maintenance, security, and the scripts that remove a recurring chore.",
    },
    {
      fr: "Full-stack veut dire que je prends un projet de bout en bout, sans sous-traiter : l'interface que vous voyez et utilisez (le frontend), le moteur qui la fait tourner et les API qui la relient au reste (le backend), la base de données, l'hébergement et l'infrastructure qui fait tenir le tout debout. L'automatisation et l'intelligence artificielle viennent en plus, quand elles font gagner du temps pour de vrai.",
      en: "Full-stack means I take a project end to end, with nothing subcontracted: the interface you see and use (the frontend), the engine behind it and the APIs that connect it to everything else (the backend), the database, the hosting and the infrastructure that keeps it all standing. Automation and artificial intelligence come on top, when they genuinely save time.",
    },
    {
      fr: "Il n'y a pas d'équipe derrière moi, et c'est le principe : la personne qui prend votre appel est celle qui écrit le code et celle qui répondra dans six mois quand vous aurez une question. Vous ne serez jamais transféré à quelqu'un qui découvre votre dossier.",
      en: "There is no team behind me, and that's the point: the person who takes your call is the one who writes the code, and the one who will answer six months from now when you have a question. You will never be handed to someone discovering your file.",
    },
    {
      fr: "Le code que j'écris ne reste pas dans un coffre : une de mes contributions est intégrée à openrazer, le pilote libre du matériel Razer sous Linux, et le code de vos projets vous est livré.",
      en: "The code I write doesn't stay locked away: one of my contributions is merged into openrazer, the open-source driver for Razer hardware on Linux, and the code for your projects is delivered to you.",
    },
  ],
} satisfies Record<string, unknown>;

type Testimonial = {
  quote: Bilingual;
  author: string;
  role: Bilingual;
};

/** Témoignages clients réels et autorisés. Vides = section masquée : ne jamais inventer de citation. */
export const TESTIMONIALS: Testimonial[] = [];

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
 * Avis publics agrégés, relevés à la main sur chaque plateforme. Une URL vide ou un compteur à
 * zéro masque la carte : ne jamais inventer une note ni un nombre d'avis. Ces valeurs restent
 * hors du JSON-LD — Google refuse le markup aggregateRating construit sur des avis collectés
 * ailleurs, et un rich snippet refusé coûte plus qu'il ne rapporte.
 */
export const REVIEWS: Review[] = [
  {
    id: "google",
    platform: "Google",
    url: "https://g.page/r/CQS4cLlmMzj6ECE",
    rating: 5,
    count: 4,
    checkedOn: "2026-08-24",
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

/** En dessous de ce nombre d'avis, la plateforme reste masquée : « 1 avis » dessert plus qu'il ne prouve. */
export const MIN_REVIEWS = 3;

type ProjectStatus = "production" | "shipped" | "wip";

type ProjectShot = {
  src: string;
  /** Variante servie sous [data-theme="dark"], quand le projet capturé a lui-même un thème sombre. */
  srcDark?: string;
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
  year: number;
  site: string;
  repo: string;
  /** Lien de téléchargement ou d'installation. Vide = bouton masqué. */
  install: string;
  stack: string[];
  summary: Bilingual;
  detail: Bilingual;
  shots: ProjectShot[];
};

/**
 * Projets livrés, montrés par leurs captures plutôt que par un lien de dépôt : un prospect
 * non technique ne clique jamais sur GitHub. `site` ou `repo` vide masque le bouton
 * correspondant — ne jamais publier l'URL d'un outil livré chez un client sans son accord.
 */
export const PROJECTS: Project[] = [
  {
    id: "scaleneo",
    name: "SCALENEO",
    status: "production",
    kind: "client",
    year: 2026,
    site: "https://scaleneo.silexio.be",
    repo: "https://github.com/Silexio/SCALENEO",
    install: "",
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Recharts", "shadcn"],
    summary: {
      fr: "Outil livré à un cabinet de kinésithérapie belge : les rapports patients se remplissent tout seuls, l'évolution se lit en un coup d'œil, et rien ne quitte l'ordinateur du cabinet.",
      en: "Tool delivered to a Belgian physiotherapy practice: patient reports fill themselves in, progress reads at a glance, and nothing ever leaves the practice's computer.",
    },
    detail: {
      fr: "Livrée pour un cabinet de kinésithérapie belge (10+ thérapeutes). Extraction automatique de 18 sections depuis des rapports texte brut, suivi longitudinal ODI/CSI/NRS avec seuils MCID, détection de drapeaux rouges. Dashboard analytique Recharts, export CSV/XLSX. 100% client-side et localStorage — aucune donnée transmise, RGPD native.",
      en: "Delivered for a Belgian physiotherapy practice (10+ therapists). Automatic extraction of 18 sections from raw text reports, longitudinal ODI/CSI/NRS tracking with MCID thresholds, red-flag detection. Recharts dashboard, CSV/XLSX export. 100% client-side with localStorage — no data transmitted, GDPR-native.",
    },
    shots: [
      {
        src: "/work/scaleneo.webp",
        width: 1440,
        height: 810,
        alt: {
          fr: "Écran de résultats de SCALENEO : alerte drapeau rouge en rouge, puis hypothèse clinique découpée en dix cartes.",
          en: "SCALENEO results screen: a red-flag alert in red, then a clinical hypothesis split across ten cards.",
        },
      },
    ],
  },
  {
    id: "reelmark",
    name: "Reelmark",
    status: "production",
    kind: "personal",
    year: 2026,
    site: "https://reelmark.silexio.be",
    repo: "https://github.com/TheSawkit/reelmark",
    install: "",
    stack: ["Next.js", "TypeScript", "TMDB API"],
    summary: {
      fr: "Un service en ligne pour suivre et organiser tous les films et séries que vous avez vus.",
      en: "An online service to track and organise every film and show you have watched.",
    },
    detail: {
      fr: "Projet personnel en production, ouvert à tous : catalogue alimenté par l'API TMDB, recherche instantanée, comptes utilisateurs et synchronisation entre appareils. Développé de la base de données à l'interface.",
      en: "Personal project in production, open to everyone: catalogue powered by the TMDB API, instant search, user accounts and cross-device sync. Built from the database up to the interface.",
    },
    shots: [
      {
        src: "/work/reelmark-dark.webp",
        width: 1440,
        height: 810,
        alt: {
          fr: "Page d'accueil de Reelmark : le nom du service en grand sur un mur sombre d'affiches de films et de séries.",
          en: "Reelmark home page: the service name in large type over a dark wall of film and show posters.",
        },
      },
    ],
  },
  {
    id: "bridgemark",
    name: "BridgeMark",
    status: "shipped",
    kind: "personal",
    year: 2026,
    site: "",
    repo: "https://github.com/TheSawkit/BridgeMark",
    install: "https://github.com/TheSawkit/BridgeMark/releases/latest",
    stack: ["Swift", "SwiftUI", "macOS 13+"],
    summary: {
      fr: "Une application Mac qui transfère toute votre barre de favoris Safari vers Chrome, Brave ou Edge en un clic.",
      en: "A Mac app that moves your whole Safari bookmarks bar to Chrome, Brave or Edge in one click.",
    },
    detail: {
      fr: "Application macOS native écrite en Swift et SwiftUI. Elle lit les favoris de Safari, reconstitue l'arborescence complète — dossiers compris — et l'exporte au format que lisent tous les navigateurs Chromium. Téléchargement libre, code source ouvert sous licence MIT.",
      en: "Native macOS app written in Swift and SwiftUI. It reads Safari's bookmarks, rebuilds the full tree — folders included — and exports it in the format every Chromium browser reads. Free download, open source under the MIT licence.",
    },
    shots: [],
  },
  {
    id: "multiboot",
    name: "macOS Multiboot Creator",
    status: "shipped",
    kind: "personal",
    year: 2026,
    site: "",
    repo: "https://github.com/TheSawkit/macos_multiboot_creator",
    install: "https://github.com/TheSawkit/macos_multiboot_creator/releases",
    stack: ["Python", "macOS", "Ligne de commande"],
    summary: {
      fr: "Un outil qui prépare une clé USB capable d'installer plusieurs versions de macOS depuis un seul disque.",
      en: "A tool that builds a USB drive able to install several macOS versions from a single disk.",
    },
    detail: {
      fr: "Outil en ligne de commande destiné aux techniciens : il détecte les installeurs présents sur la machine, découpe le disque externe en une partition par version de macOS et rend chacune démarrable. Ce qui demande une heure de manipulations se règle en une commande. Licence MIT.",
      en: "Command-line tool for technicians: it detects the installers present on the machine, splits the external disk into one partition per macOS version and makes each of them bootable. What takes an hour by hand runs as a single command. MIT licence.",
    },
    shots: [],
  },
];

type StackGroup = {
  label: Bilingual;
  items: string[];
};

export const STACK_GROUPS: StackGroup[] = [
  {
    label: { fr: "Langages", en: "Languages" },
    items: ["TypeScript", "Python", "JavaScript", "SQL", "Bash"],
  },
  {
    label: { fr: "Frontend", en: "Frontend" },
    items: ["Next.js", "React", "Tailwind", "shadcn/ui"],
  },
  {
    label: { fr: "Backend", en: "Backend" },
    items: ["Django", "FastAPI", "Node", "Supabase"],
  },
  {
    label: { fr: "Data", en: "Data" },
    items: ["PostgreSQL", "MongoDB", "Redis", "SQLite"],
  },
  {
    label: { fr: "Infrastructure", en: "Infrastructure" },
    items: ["Docker", "Linux", "AWS", "Cloudflare"],
  },
  {
    label: { fr: "Outils", en: "Tools" },
    items: ["Git", "GitHub Actions", "Figma", "Claude"],
  },
];

type ProcessScene = {
  step: Bilingual;
  h: Bilingual;
  p: Bilingual;
};

export const PROCESS = {
  eyebrow: { fr: "Méthode", en: "How I work" },
  title: { fr: "Un problème.\nUne personne.", en: "One problem.\nOne person." },
  titleEm: { fr: "Une solution.", en: "One solution." },
  sub: {
    fr: "J'écoute, je prototype, on construit ensemble — et ton problème est réglé. La même personne du premier appel à la mise en production, plus disponible qu'une agence.",
    en: "I listen, I prototype, we build together — and your problem is solved. The same person from first call to production, more available than an agency.",
  },
  promises: [
    { fr: "Réponse < 24h", en: "Reply < 24h" },
    { fr: "Un seul interlocuteur", en: "One point of contact" },
    { fr: "Code + doc livrés", en: "Code + docs delivered" },
    { fr: "RGPD-first", en: "GDPR-first" },
  ],
  scenes: [
    {
      step: { fr: "01 · Écoute", en: "01 · Listening" },
      h: {
        fr: "On part de ton métier, pas de la techno.",
        en: "We start from your work, not the tech.",
      },
      p: {
        fr: "Tu m'expliques ton problème avec tes mots. Je pose des questions, je reformule — et je te dis honnêtement si je suis la bonne personne pour le régler.",
        en: "You explain your problem in your own words. I ask questions, I rephrase — and I tell you honestly whether I'm the right person to solve it.",
      },
    },
    {
      step: { fr: "02 · Prototype", en: "02 · Prototype" },
      h: {
        fr: "Tu vois du concret, vite.",
        en: "You see something real, fast.",
      },
      p: {
        fr: "Avant de s'engager sur le produit complet, je prototype ton besoin. On valide sur du réel — pas sur des slides ni des promesses.",
        en: "Before committing to the full product, I prototype your need. We validate on something real — not slides, not promises.",
      },
    },
    {
      step: { fr: "03 · Construction", en: "03 · Build" },
      h: {
        fr: "On construit ensemble, en itérations.",
        en: "We build together, in iterations.",
      },
      p: {
        fr: "Je développe, tu testes, on ajuste. Le même interlocuteur de A à Z, qui connaît ton projet par cœur — et qui répond sous 24h.",
        en: "I build, you test, we adjust. The same person from A to Z, who knows your project by heart — and replies within 24h.",
      },
    },
    {
      step: { fr: "04 · Résolu", en: "04 · Solved" },
      h: {
        fr: "Ton problème est réglé. Et tu restes libre.",
        en: "Your problem is solved. And you stay free.",
      },
      p: {
        fr: "Code source livré, documentation incluse, données en local quand c'est possible. Tu n'es captif de personne — pas même de moi.",
        en: "Source code delivered, documentation included, data kept local when possible. You're locked into nothing — not even me.",
      },
    },
  ] satisfies ProcessScene[],
  cta: { fr: "Démarrer un projet", en: "Start a project" },
} as const;

type ChatMessage = {
  me: boolean;
  text: Bilingual;
  file?: Bilingual;
  meta?: Bilingual;
};

export const CHAT: ChatMessage[][] = [
  [
    {
      me: false,
      text: {
        fr: "Bonjour — je perds des heures à ressaisir mes rapports à la main chaque semaine…",
        en: "Hi — I lose hours every week re-typing my reports by hand…",
      },
    },
    {
      me: true,
      text: {
        fr: "On regarde ça ensemble ? Envoie-moi un rapport type, je te dis ce qui est automatisable.",
        en: "Let's look at it together — send me a sample report, I'll tell you what can be automated.",
      },
      meta: { fr: "Réponse · 2h", en: "Reply · 2h" },
    },
  ],
  [
    {
      me: true,
      text: {
        fr: "Premier prototype. Teste-le avec tes vrais rapports et dis-moi tout.",
        en: "First prototype. Try it with your real reports and tell me everything.",
      },
      file: {
        fr: "prototype-v1 · démo en ligne",
        en: "prototype-v1 · live demo",
      },
    },
    {
      me: false,
      text: {
        fr: "C'est exactement ce qu'il me fallait.",
        en: "This is exactly what I needed.",
      },
    },
  ],
  [
    {
      me: false,
      text: {
        fr: "On peut ajouter un export Excel pour la compta ?",
        en: "Could we add an Excel export for accounting?",
      },
    },
    {
      me: true,
      text: {
        fr: "Déployé. Autre chose à ajuster ?",
        en: "Deployed. Anything else to adjust?",
      },
      meta: { fr: "v0.4 · en ligne", en: "v0.4 · live" },
    },
  ],
  [
    {
      me: true,
      text: {
        fr: "Tout est à toi. Je reste joignable si besoin.",
        en: "It's all yours. I'm still around if you need me.",
      },
      file: {
        fr: "livraison — code source + documentation",
        en: "delivery — source code + docs",
      },
    },
    {
      me: false,
      text: { fr: "Problème réglé. Merci !", en: "Problem solved. Thanks!" },
    },
  ],
];

export const CHAT_UI = {
  online: { fr: "en ligne", en: "online" },
} as const;

type Chapter = {
  id: string;
  label: Bilingual;
};

export const CHAPTERS: Chapter[] = [
  { id: "top", label: { fr: "Accueil", en: "Home" } },
  { id: "services", label: { fr: "Services", en: "Services" } },
  { id: "process", label: { fr: "Méthode", en: "Method" } },
  { id: "work", label: { fr: "Réalisations", en: "Work" } },
  { id: "faq", label: { fr: "Questions", en: "FAQ" } },
  { id: "stack", label: { fr: "Stack", en: "Stack" } },
  { id: "contact", label: { fr: "Contact", en: "Contact" } },
];
