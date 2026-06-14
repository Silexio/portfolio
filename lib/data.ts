import type { Bilingual } from "@/lib/i18n/utils";

export const META = {
  title: {
    fr: "Silexio — Développement full-stack & IT · Belgique",
    en: "Silexio — Full-stack development & IT · Belgium",
  },
  description: {
    fr: "Studio indépendant basé en Belgique. Développement full-stack, backend, infrastructure et support IT. Un seul interlocuteur, de l'idée jusqu'au serveur en production.",
    en: "Independent studio based in Belgium. Full-stack development, backend, infrastructure and IT support. One point of contact, from idea to production.",
  },
} satisfies Record<string, Bilingual>;

export const EMAIL = "contact@silexio.be";

export const URLS = {
  cal: "https://silexio.cal.eu/nicolas.jzw",
  email: `mailto:${EMAIL}`,
  linkedin: "https://www.linkedin.com/company/silexio-be",
  github: "https://github.com/Silexio",
  facebook: "https://www.facebook.com/silexio",
  instagram: "https://www.instagram.com/silexio.be",
  threads: "https://www.threads.net/@silexio.be",
} as const;

export type SocialId = "linkedin" | "github" | "facebook" | "instagram" | "threads";

export const SOCIALS: { id: SocialId; label: string; url: string }[] = [
  { id: "linkedin", label: "LinkedIn", url: URLS.linkedin },
  { id: "github", label: "GitHub", url: URLS.github },
  { id: "facebook", label: "Facebook", url: URLS.facebook },
  { id: "instagram", label: "Instagram", url: URLS.instagram },
  { id: "threads", label: "Threads", url: URLS.threads },
];

export const I18N = {
  nav: {
    services: { fr: "Services", en: "Services" },
    work: { fr: "Projets", en: "Work" },
    stack: { fr: "Stack", en: "Stack" },
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
    newTab: { fr: "ouvre un nouvel onglet", en: "opens in a new tab" },
    remove: { fr: "Retirer de la sélection", en: "Remove from selection" },
    socials: { fr: "Réseaux sociaux", en: "Social media" },
    selected: { fr: "dans votre sélection", en: "in your selection" },
  },
  hero: {
    eyebrow: { fr: "Studio indépendant · Belgique", en: "Independent studio · Belgium" },
    status: { fr: "Disponible", en: "Available" },
    titlePre: { fr: "Une seule personne.", en: "One engineer." },
    titleA: { fr: "Un produit", en: "A product" },
    titleB: { fr: "fait", en: "made" },
    titleC: { fr: "pour durer.", en: "to last." },
    pitch: {
      fr: "Je conçois et déploie des applications web, des APIs, et l'infra qui les fait tourner. De l'idée jusqu'au serveur en production — un seul interlocuteur.",
      en: "I design and ship web apps, APIs, and the infrastructure that runs them. From idea to production — one point of contact.",
    },
    cta1: { fr: "Démarrer un projet", en: "Start a project" },
    cta2: { fr: "Voir les projets", en: "See the work" },
    metaBaseLabel: { fr: "BASE", en: "BASE" },
    metaBaseValue: { fr: "Belgique · UTC+1", en: "Belgium · UTC+1" },
    metaBaseSub: { fr: "Remote · Sur place", en: "Remote · On-site" },
    metaStatusLabel: { fr: "DISPO", en: "STATUS" },
    metaStatusValue: { fr: "Ouvert aux projets 2026", en: "Open for 2026 projects" },
  },
  services: {
    eyebrow: { fr: "Services", en: "Services" },
    title: { fr: "De quoi avez-vous\nbesoin ?", en: "What do you\nneed?" },
    subtitle: {
      fr: "Sélectionnez ce qui vous intéresse — j'arrive préparé à notre premier échange.",
      en: "Pick what you need — I'll come prepared to our first call.",
    },
    add: { fr: "Ajouter", en: "Add" },
    added: { fr: "Sélectionné", en: "Selected" },
  },
  work: {
    eyebrow: { fr: "Projets", en: "Work" },
    title: { fr: "Ce qui a été\nlivré.", en: "What has\nshipped." },
    subtitle: {
      fr: "L'essentiel, livré et vérifiable. Le reste est en accès libre sur GitHub.",
      en: "The essentials, shipped and verifiable. The rest is open on GitHub.",
    },
    view: { fr: "Voir sur GitHub", en: "View on GitHub" },
    allGithub: { fr: "Tout le code est sur GitHub", en: "All the code is on GitHub" },
    status: {
      production: { fr: "En production", en: "In production" },
      shipped: { fr: "Livré", en: "Shipped" },
      wip: { fr: "En cours", en: "In progress" },
    },
  },
  stack: {
    eyebrow: { fr: "Stack", en: "Stack" },
    title: { fr: "La stack\nau quotidien.", en: "The daily\nstack." },
    subtitle: {
      fr: "Choisis pour la fiabilité, pas pour la mode.",
      en: "Picked for reliability, not for hype.",
    },
  },
  contact: {
    eyebrow: { fr: "Contact", en: "Contact" },
    titleA: { fr: "On en", en: "Let's" },
    titleB: { fr: "parle ?", en: "talk." },
    sub: {
      fr: "Un projet, une idée, un serveur à configurer. Réponse sous 24h.",
      en: "A project, an idea, a server to configure. Reply within 24h.",
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
  footer: {
    rights: { fr: "Tous droits réservés", en: "All rights reserved" },
    tag: { fr: "Fait en Belgique", en: "Made in Belgium" },
  },
} as const;

export type PackageId = "site" | "webapp" | "api" | "infra" | "automation" | "it";

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
    title: { fr: "Site vitrine", en: "Showcase site" },
    body: {
      fr: "Présence en ligne rapide et soignée, optimisée pour le référencement. De la landing page au site multi-pages.",
      en: "A fast, polished online presence, built for SEO. From a landing page to a multi-page site.",
    },
    tags: ["Next.js", "Tailwind", "SEO"],
  },
  {
    id: "webapp",
    num: "02",
    title: { fr: "Application web", en: "Web app" },
    body: {
      fr: "Application sur mesure ou SaaS, typée de bout en bout. Comptes, tableaux de bord, paiements.",
      en: "Custom web app or SaaS, typed end to end. Accounts, dashboards, payments.",
    },
    tags: ["Next.js", "TypeScript", "Postgres"],
  },
  {
    id: "api",
    num: "03",
    title: { fr: "API & Backend", en: "API & Backend" },
    body: {
      fr: "APIs robustes, authentification, intégrations tierces, migration de plateformes legacy.",
      en: "Robust APIs, authentication, third-party integrations, legacy migration.",
    },
    tags: ["Django", "FastAPI", "REST"],
  },
  {
    id: "infra",
    num: "04",
    title: { fr: "Infrastructure & DevOps", en: "Infrastructure & DevOps" },
    body: {
      fr: "Déploiement, conteneurs, serveurs Linux, CI/CD, monitoring. Votre produit tourne sans que vous y pensiez.",
      en: "Deployment, containers, Linux servers, CI/CD, monitoring. Your product just runs.",
    },
    tags: ["Docker", "Linux", "Cloudflare"],
  },
  {
    id: "automation",
    num: "05",
    title: { fr: "Automatisation", en: "Automation" },
    body: {
      fr: "Scripts, bots, synchronisations, intégrations. Les tâches répétitives disparaissent.",
      en: "Scripts, bots, syncs, integrations. Repetitive tasks disappear.",
    },
    tags: ["Python", "Node", "Cron"],
  },
  {
    id: "it",
    num: "06",
    title: { fr: "Support IT", en: "IT support" },
    body: {
      fr: "Installation, dépannage, configuration postes et réseau. Sur place en Belgique ou à distance.",
      en: "Setup, troubleshooting, workstations and network. On-site in Belgium or remote.",
    },
    tags: ["macOS", "Windows", "Réseau"],
  },
];

type ProjectStatus = "production" | "shipped" | "wip";

type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  year: number;
  url: string;
  stack: string[];
  summary: Bilingual;
  detail: Bilingual;
};

export const PROJECTS: Project[] = [
  {
    id: "scaleneo",
    name: "SCALENEO",
    status: "wip",
    year: 2026,
    url: "https://github.com/Silexio/SCALENEO",
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Recharts", "shadcn"],
    summary: {
      fr: "Plateforme clinique pour kinésithérapeutes. Extraction de rapports lombalgie, suivi longitudinal ODI/CSI/NRS, drapeaux rouges.",
      en: "Clinical platform for physiotherapists. Low-back-pain report extraction, longitudinal ODI/CSI/NRS tracking, red flags.",
    },
    detail: {
      fr: "Livrée pour un cabinet de kinésithérapie belge (10+ thérapeutes). Extraction automatique de 18 sections depuis des rapports texte brut, suivi longitudinal ODI/CSI/NRS avec seuils MCID, détection de drapeaux rouges. Dashboard analytique Recharts, export CSV/XLSX. 100% client-side et localStorage — aucune donnée transmise, RGPD native.",
      en: "Delivered for a Belgian physiotherapy practice (10+ therapists). Automatic extraction of 18 sections from raw text reports, longitudinal ODI/CSI/NRS tracking with MCID thresholds, red-flag detection. Recharts dashboard, CSV/XLSX export. 100% client-side with localStorage — no data transmitted, GDPR-native.",
    },
  },
  {
    id: "reelmark",
    name: "Reelmark",
    status: "production",
    year: 2026,
    url: "https://github.com/TheSawkit/reelmark",
    stack: ["Next.js", "TypeScript", "TMDB API"],
    summary: {
      fr: "Un outil pour suivre films et séries, en construction.",
      en: "A tool to track films and shows, currently in development.",
    },
    detail: {
      fr: "Projet personnel en cours — interface soignée, recherche rapide, sync multi-appareils.",
      en: "Personal project in progress — polished UI, fast search, cross-device sync.",
    },
  },
  {
    id: "macos-multiboot",
    name: "macOS Multiboot Creator",
    status: "shipped",
    year: 2025,
    url: "https://github.com/TheSawkit/macos_multiboot_creator",
    stack: ["Swift (soon)", "Shell", "macOS"],
    summary: {
      fr: "Création de clés USB multi-boot pour macOS, en une commande.",
      en: "Multi-boot USB keys for macOS, in a single command.",
    },
    detail: {
      fr: "Outil système livré, utilisable aujourd'hui. Prochaine itération : application Swift native avec GUI.",
      en: "Shipped system tool, usable today. Next: a native Swift app with a GUI.",
    },
  },
  {
    id: "bridgemark",
    name: "BridgeMark",
    status: "shipped",
    year: 2025,
    url: "https://github.com/TheSawkit/BridgeMark",
    stack: ["Swift", "Shell", "macOS"],
    summary: {
      fr: "Synchronisation bidirectionnelle des favoris entre Brave et Safari.",
      en: "Two-way bookmark sync between Brave and Safari.",
    },
    detail: {
      fr: "Outil livré pour garder ses favoris cohérents entre les deux navigateurs. Prochaine étape : app Swift native pour macOS.",
      en: "Shipped tool to keep bookmarks consistent. Next: a native Swift macOS app.",
    },
  },
  {
    id: "openrazer",
    name: "openrazer",
    status: "shipped",
    year: 2024,
    url: "https://github.com/openrazer/openrazer/pull/2491",
    stack: ["C", "Linux", "Open source"],
    summary: {
      fr: "Contribution open source au driver Linux Razer (4 300+ étoiles). PR mergée en upstream.",
      en: "Open-source contribution to the Razer Linux driver (4,300+ stars). PR merged upstream.",
    },
    detail: {
      fr: "Patch contribué et accepté sur openrazer, le driver open source du matériel Razer pour GNU/Linux. PR #2491.",
      en: "Patch contributed and merged into openrazer, the open-source driver for Razer hardware on GNU/Linux. PR #2491.",
    },
  },
];

type StackGroup = {
  label: Bilingual;
  items: string[];
};

export const STACK_GROUPS: StackGroup[] = [
  { label: { fr: "Langages", en: "Languages" }, items: ["TypeScript", "Python", "JavaScript", "SQL", "Bash"] },
  { label: { fr: "Frontend", en: "Frontend" }, items: ["Next.js", "React", "Tailwind", "shadcn/ui"] },
  { label: { fr: "Backend", en: "Backend" }, items: ["Django", "FastAPI", "Node", "Supabase"] },
  { label: { fr: "Data", en: "Data" }, items: ["PostgreSQL", "MongoDB", "Redis", "SQLite"] },
  { label: { fr: "Infra", en: "Infra" }, items: ["Docker", "Linux", "AWS", "Cloudflare"] },
  { label: { fr: "Outils", en: "Tools" }, items: ["Git", "GitHub Actions", "Figma", "Claude"] },
];

export const MARQUEE = [
  "TYPESCRIPT", "NEXT.JS", "PYTHON", "DJANGO", "FASTAPI",
  "POSTGRES", "DOCKER", "LINUX", "CLOUDFLARE", "MONGODB",
  "SUPABASE", "TAILWIND", "REACT", "AWS", "RASPBERRY PI",
] as const;

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
      h: { fr: "On part de ton métier, pas de la techno.", en: "We start from your work, not the tech." },
      p: {
        fr: "Tu m'expliques ton problème avec tes mots. Je pose des questions, je reformule — et je te dis honnêtement si je suis la bonne personne pour le régler.",
        en: "You explain your problem in your own words. I ask questions, I rephrase — and I tell you honestly whether I'm the right person to solve it.",
      },
    },
    {
      step: { fr: "02 · Prototype", en: "02 · Prototype" },
      h: { fr: "Tu vois du concret, vite.", en: "You see something real, fast." },
      p: {
        fr: "Avant de s'engager sur le produit complet, je prototype ton besoin. On valide sur du réel — pas sur des slides ni des promesses.",
        en: "Before committing to the full product, I prototype your need. We validate on something real — not slides, not promises.",
      },
    },
    {
      step: { fr: "03 · Construction", en: "03 · Build" },
      h: { fr: "On construit ensemble, en itérations.", en: "We build together, in iterations." },
      p: {
        fr: "Je développe, tu testes, on ajuste. Le même interlocuteur de A à Z, qui connaît ton projet par cœur — et qui répond sous 24h.",
        en: "I build, you test, we adjust. The same person from A to Z, who knows your project by heart — and replies within 24h.",
      },
    },
    {
      step: { fr: "04 · Résolu", en: "04 · Solved" },
      h: { fr: "Ton problème est réglé. Et tu restes libre.", en: "Your problem is solved. And you stay free." },
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
      file: { fr: "prototype-v1 · démo en ligne", en: "prototype-v1 · live demo" },
    },
    {
      me: false,
      text: { fr: "C'est exactement ce qu'il me fallait.", en: "This is exactly what I needed." },
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
      text: { fr: "Déployé. Autre chose à ajuster ?", en: "Deployed. Anything else to adjust?" },
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
      file: { fr: "livraison — code source + documentation", en: "delivery — source code + docs" },
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
  { id: "work", label: { fr: "Projets", en: "Work" } },
  { id: "stack", label: { fr: "Stack", en: "Stack" } },
  { id: "contact", label: { fr: "Contact", en: "Contact" } },
];
