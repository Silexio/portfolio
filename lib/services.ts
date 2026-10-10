import { PEPPOL_FAQ } from "@/lib/data";
import type { ArtId, FaqEntry, OfferId, ServicePageId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t, type Bilingual } from "@/lib/i18n/utils";

type Step = {
  title: Bilingual;
  body: Bilingual;
};

export type ServiceContact = {
  title: Bilingual;
  sub: Bilingual;
  task: Bilingual;
  taskPlaceholder: Bilingual;
};

export type ServicePage = {
  id: ServicePageId;
  slug: Bilingual;
  name: Bilingual;
  meta: { title: Bilingual; description: Bilingual };
  title: Bilingual;
  lead: Bilingual;
  cta: Bilingual;
  /** Illustration du hero, partagée avec le panneau de l’accueil. Absente = hero sur une colonne. */
  art?: ArtId;
  situationsTitle: Bilingual;
  situations: Bilingual[];
  stepsTitle: Bilingual;
  steps: Step[];
  /** Offres affichées sur la page. Vide = la zone d’intervention prend leur place. */
  offers: OfferId[];
  faq: FaqEntry[];
  /** Surcharge du bloc de contact. Absente = celui de l’accueil. */
  contact?: ServiceContact;
  /** Le temps perdu par semaine n’a de sens que pour une tâche à automatiser, pas pour une panne. */
  askHours: boolean;
};

const SITUATIONS_TITLE: Bilingual = {
  fr: "Vous vous reconnaissez ?",
  en: "Sound familiar?",
};

/**
 * Contenu des pages dédiées. Vit hors de lib/data.ts pour la même raison que lib/legal.ts : ne
 * pas noyer la landing sous trois pages de texte. Chaque page porte sa propre FAQ, émise en
 * JSON-LD par cette page seulement — jamais par une autre.
 */
export const SERVICE_PAGES: ServicePage[] = [
  {
    id: "automation",
    slug: { fr: "automatisation", en: "automation" },
    name: {
      fr: "Automatisation et intégrations",
      en: "Automation & integrations",
    },
    meta: {
      title: {
        fr: "Automatisation pour PME dans le Hainaut | Silexio",
        en: "Business automation for SMEs in Belgium | Silexio",
      },
      description: {
        fr: "Ressaisie, PDF, Excel, e-mails, facturation Peppol : j’automatise les tâches répétitives des PME du Hainaut et je connecte vos logiciels entre eux.",
        en: "Re-typing, PDFs, spreadsheets, email, Peppol invoicing: I automate small businesses' repetitive work in Belgium and connect your software together.",
      },
    },
    title: {
      fr: "Automatiser les tâches répétitives de votre PME",
      en: "Automate your business’s repetitive work",
    },
    lead: {
      fr: "Ressaisie, PDF, Excel, e-mails, rapports, logiciels qui ne se parlent pas : quand une tâche se répète et suit des règles, elle peut souvent être confiée à une machine. Votre équipe récupère ses heures, et vous gardez la main.",
      en: "Re-typing, PDFs, spreadsheets, email, reports, software that won’t talk: when a task repeats and follows rules, a machine can often take it over. Your team gets its hours back, and you stay in control.",
    },
    cta: { fr: "Montrez-moi la tâche", en: "Show me the task" },
    art: "automate",
    situationsTitle: SITUATIONS_TITLE,
    situations: [
      {
        fr: "Des PDF — bons de commande, factures, rapports — recopiés à la main dans Excel",
        en: "PDFs — orders, invoices, reports — re-typed by hand into spreadsheets",
      },
      {
        fr: "Le même rapport reconstruit chaque mois à partir de plusieurs fichiers",
        en: "The same report rebuilt every month from several files",
      },
      {
        fr: "Des e-mails lus, triés et transformés un par un en tâches",
        en: "Emails read, sorted and turned into tasks one by one",
      },
      {
        fr: "Des relances de factures impayées faites à la main",
        en: "Unpaid-invoice reminders sent by hand",
      },
      {
        fr: "Une facturation et une comptabilité qui ne s’échangent rien",
        en: "Invoicing and accounting that exchange nothing",
      },
      {
        fr: "La facture électronique Peppol à brancher sur vos outils",
        en: "Peppol e-invoicing to plug into your tools",
      },
      {
        fr: "Un site, un CRM et un fichier clients à tenir à jour en parallèle",
        en: "A website, a CRM and a client list to keep up to date side by side",
      },
      {
        fr: "Des copier-coller d’un logiciel à l’autre, avec les erreurs qui vont avec",
        en: "Copy-pasting from one program to another, with the errors that come with it",
      },
    ],
    stepsTitle: { fr: "Comment je m’y prends", en: "How I go about it" },
    steps: [
      {
        title: {
          fr: "Je regarde la tâche telle qu’elle se fait",
          en: "I look at the task as it’s actually done",
        },
        body: {
          fr: "Avec la personne qui la fait, sur ses vrais fichiers. Pas sur un schéma idéal.",
          en: "With the person who does it, on their real files. Not on an idealised diagram.",
        },
      },
      {
        title: {
          fr: "Je chiffre ce qu’elle coûte",
          en: "I put a figure on what it costs",
        },
        body: {
          fr: "En temps, en erreurs, en retards. Si le gain ne couvre pas le prix, je vous le dis.",
          en: "In time, errors and delays. If the gain doesn’t cover the price, I tell you.",
        },
      },
      {
        title: {
          fr: "J’automatise ce qui vaut la peine",
          en: "I automate what’s worth it",
        },
        body: {
          fr: "Autour de vos outils actuels quand c’est possible, avec de l’intelligence artificielle seulement là où un simple script ne suffit pas.",
          en: "Around your current tools whenever possible, with AI only where a plain script won’t do.",
        },
      },
      {
        title: {
          fr: "Je forme votre équipe et je reste joignable",
          en: "I train your team and stay reachable",
        },
        body: {
          fr: "Chacun sait ce qui tourne et comment. Avec le suivi, je suis prévenu si quelque chose échoue.",
          en: "Everyone knows what runs and how. With a care plan, I’m alerted if anything fails.",
        },
      },
    ],
    offers: ["intro", "diagnostic", "sprint", "care"],
    faq: [
      {
        q: {
          fr: "Faut-il de l’intelligence artificielle ?",
          en: "Does it take artificial intelligence?",
        },
        a: {
          fr: "Pas forcément. Beaucoup de tâches se règlent avec un simple script, moins cher et plus fiable. L’IA sert quand il faut lire un texte libre — un e-mail, un PDF mal structuré — et en extraire l’essentiel.",
          en: "Not necessarily. Many tasks are solved by a plain script, cheaper and more reliable. AI helps when free text has to be read — an email, a messy PDF — and the essentials pulled out of it.",
        },
      },
      {
        q: {
          fr: "Et si mon logiciel ne permet pas de se connecter à autre chose ?",
          en: "What if my software can’t connect to anything else?",
        },
        a: {
          fr: "Il existe presque toujours un chemin : un export de fichier, une boîte mail, un dossier partagé, une base de données. Le diagnostic dit précisément ce qui est faisable proprement, avant d’engager quoi que ce soit.",
          en: "There is almost always a way in: a file export, a mailbox, a shared folder, a database. The diagnostic says exactly what can be done cleanly, before anything is committed.",
        },
      },
      PEPPOL_FAQ,
      {
        q: {
          fr: "Que se passe-t-il si l’automatisation tombe en panne ?",
          en: "What happens if the automation breaks?",
        },
        a: {
          fr: "Elle est conçue pour échouer proprement : rien n’est perdu, et la tâche peut toujours se faire à la main. Avec le suivi, je suis prévenu et je corrige.",
          en: "It’s built to fail cleanly: nothing is lost, and the task can still be done by hand. With a care plan, I’m alerted and I fix it.",
        },
      },
    ],
    askHours: true,
  },
  {
    id: "software",
    slug: { fr: "logiciel-metier", en: "custom-software" },
    name: {
      fr: "Logiciel métier sur mesure",
      en: "Custom business software",
    },
    meta: {
      title: {
        fr: "Logiciel métier sur mesure pour PME | Silexio",
        en: "Custom business software for SMEs | Silexio",
      },
      description: {
        fr: "Planning, devis, stocks, tableau de bord : quand aucun logiciel du commerce ne colle à votre métier, je construis l’outil qui manque. Code livré. Hainaut.",
        en: "Scheduling, quotes, stock, dashboards: when no off-the-shelf software fits your trade, I build the tool you’re missing. Code delivered. Based in Belgium.",
      },
    },
    title: {
      fr: "Un logiciel métier taillé pour votre entreprise",
      en: "Business software cut for your company",
    },
    lead: {
      fr: "Quand aucun logiciel du commerce ne correspond à votre façon de travailler, tout finit dans un Excel partagé que personne n’ose toucher. Je construis l’outil qui manque : utilisable depuis un ordinateur ou un téléphone, sans rien installer, et qui vous appartient.",
      en: "When no off-the-shelf software fits the way you work, everything ends up in a shared spreadsheet nobody dares touch. I build the missing tool: usable from a computer or a phone, nothing to install, and yours to keep.",
    },
    cta: { fr: "Décrire mon besoin", en: "Describe what I need" },
    art: "build",
    situationsTitle: SITUATIONS_TITLE,
    situations: [
      {
        fr: "Un planning d’équipe coincé dans un tableur partagé",
        en: "A team schedule stuck in a shared spreadsheet",
      },
      {
        fr: "Des devis préparés à la main, en partant d’anciens devis",
        en: "Quotes put together by hand, starting from old ones",
      },
      {
        fr: "Des stocks suivis sur papier ou dans trois fichiers différents",
        en: "Stock tracked on paper or across three different files",
      },
      {
        fr: "Des fiches clients dispersées entre boîtes mail et classeurs",
        en: "Client records scattered across mailboxes and binders",
      },
      {
        fr: "Aucune vue d’ensemble sur l’activité sans une demi-journée de calculs",
        en: "No overview of the business without half a day of sums",
      },
      {
        fr: "Un logiciel du commerce qui oblige à contourner la moitié de ses écrans",
        en: "Off-the-shelf software that forces you to work around half its screens",
      },
    ],
    stepsTitle: { fr: "Comment ça se construit", en: "How it gets built" },
    steps: [
      {
        title: {
          fr: "On part de votre métier",
          en: "We start from your trade",
        },
        body: {
          fr: "Vous m’expliquez comment vous travaillez, avec vos mots. Je reformule jusqu’à ce qu’on parle de la même chose.",
          en: "You explain how you work, in your own words. I rephrase until we’re talking about the same thing.",
        },
      },
      {
        title: {
          fr: "Vous voyez du concret, vite",
          en: "You see something real, fast",
        },
        body: {
          fr: "Avant de s’engager sur l’outil complet, une première version tourne sur vos vrais cas. On valide sur du réel, pas sur des maquettes.",
          en: "Before committing to the full tool, a first version runs on your real cases. We validate on something real, not on mock-ups.",
        },
      },
      {
        title: { fr: "On construit par étapes", en: "We build in steps" },
        body: {
          fr: "Je développe, vous testez, on ajuste. La même personne du premier appel à la mise en ligne.",
          en: "I build, you test, we adjust. The same person from the first call to going live.",
        },
      },
      {
        title: { fr: "L’outil est à vous", en: "The tool is yours" },
        body: {
          fr: "Code source livré, documentation comprise, données chez vous quand c’est possible. Vous n’êtes captif de personne, moi compris.",
          en: "Source code delivered, documentation included, data kept on your side when possible. You’re locked into no one — including me.",
        },
      },
    ],
    offers: ["intro", "diagnostic", "tool", "care"],
    faq: [
      {
        q: {
          fr: "Combien coûte un logiciel sur mesure ?",
          en: "How much does custom software cost?",
        },
        a: {
          fr: "Ça dépend de ce qu’il doit faire. Le prix de départ est affiché plus haut ; le montant exact est fixé par écrit après le diagnostic, avant la moindre ligne de code.",
          en: "It depends on what it has to do. The starting price is shown above; the exact amount is set in writing after the diagnostic, before a single line of code.",
        },
      },
      {
        q: { fr: "Combien de temps faut-il ?", en: "How long does it take?" },
        a: {
          fr: "Comptez de un à trois mois selon l’ampleur, avec une première version utilisable bien avant la fin.",
          en: "Count one to three months depending on scope, with a usable first version well before the end.",
        },
      },
      {
        q: {
          fr: "Est-ce que je suis propriétaire du code ?",
          en: "Do I own the code?",
        },
        a: {
          fr: "Oui. Le code source et la documentation vous sont livrés : un autre développeur peut reprendre l’outil sans repartir de zéro.",
          en: "Yes. The source code and documentation are delivered to you: another developer can take the tool over without starting from scratch.",
        },
      },
      {
        q: {
          fr: "Mes données sont-elles en sécurité ?",
          en: "Is my data safe?",
        },
        a: {
          fr: "Elles restent chez vous chaque fois que c’est possible : l’outil livré à un cabinet de kinésithérapie ne transmet aucune donnée patient. Sinon, elles sont hébergées, sauvegardées et surveillées, et vous savez toujours où elles se trouvent.",
          en: "It stays on your side whenever possible: the tool delivered to a physiotherapy practice sends no patient data anywhere. Otherwise it’s hosted, backed up and monitored, and you always know where it lives.",
        },
      },
    ],
    askHours: true,
  },
  {
    id: "support",
    art: "repair",
    slug: { fr: "depannage", en: "it-support" },
    name: { fr: "Dépannage informatique", en: "IT support" },
    meta: {
      title: {
        fr: "Dépannage informatique dans le Hainaut | Silexio",
        en: "IT support in Hainaut, Belgium | Silexio",
      },
      description: {
        fr: "Ordinateur lent, virus, imprimante, wifi, sauvegardes, nouveau PC : dépannage informatique sur place dans le Hainaut, ou à distance partout en Belgique.",
        en: "Slow computer, viruses, printers, wifi, backups, new PC setup: IT support on-site across Hainaut, or remotely anywhere in Belgium.",
      },
    },
    title: {
      fr: "Dépannage informatique dans le Hainaut",
      en: "IT support in Hainaut",
    },
    lead: {
      fr: "Ordinateur qui rame, imprimante capricieuse, wifi qui coupe, boîte mail bloquée, sauvegarde à mettre en place : je passe chez vous dans le Hainaut ou je prends la main à distance. Particuliers comme petites entreprises, sans jargon et sans condescendance.",
      en: "Slow computer, stubborn printer, dropping wifi, locked mailbox, backups to set up: I come to you in Hainaut or take over remotely. Private individuals and small businesses alike, no jargon and no condescension.",
    },
    cta: { fr: "Décrire la panne", en: "Describe the problem" },
    situationsTitle: { fr: "Ce que je règle", en: "What I fix" },
    situations: [
      {
        fr: "Un ordinateur lent, qui plante ou affiche un écran bleu",
        en: "A computer that’s slow, crashes or shows a blue screen",
      },
      {
        fr: "Un virus, une fenêtre publicitaire qui revient sans cesse",
        en: "A virus, a pop-up that keeps coming back",
      },
      {
        fr: "Une imprimante qui refuse d’imprimer",
        en: "A printer that refuses to print",
      },
      {
        fr: "Un wifi qui coupe ou ne couvre pas toute la maison",
        en: "Wifi that drops or doesn’t reach the whole house",
      },
      {
        fr: "Une boîte mail bloquée ou des messages disparus",
        en: "A locked mailbox or messages gone missing",
      },
      {
        fr: "Des photos ou des documents à récupérer",
        en: "Photos or documents to recover",
      },
      {
        fr: "Un nouvel ordinateur à configurer et à remplir avec vos anciennes données",
        en: "A new computer to set up and fill with your old data",
      },
      {
        fr: "Des sauvegardes à mettre en place avant qu’il ne soit trop tard",
        en: "Backups to put in place before it’s too late",
      },
      {
        fr: "Les postes et le réseau d’une petite entreprise à remettre d’aplomb",
        en: "A small business’s workstations and network to put back in order",
      },
    ],
    stepsTitle: { fr: "Comment ça se passe", en: "How it works" },
    steps: [
      {
        title: {
          fr: "Vous m’expliquez la panne",
          en: "You tell me what’s wrong",
        },
        body: {
          fr: "Par le formulaire ci-dessous ou sur WhatsApp, avec vos mots. Pas besoin de connaître le nom du problème.",
          en: "Through the form below or on WhatsApp, in your own words. No need to know what the problem is called.",
        },
      },
      {
        title: {
          fr: "À distance quand c’est possible",
          en: "Remotely when possible",
        },
        body: {
          fr: "Beaucoup de pannes se règlent en prenant la main à distance : vous voyez tout ce que je fais à l’écran, et rien ne reste ouvert après l’intervention.",
          en: "Many problems are fixed by taking over remotely: you see everything I do on screen, and nothing stays open afterwards.",
        },
      },
      {
        title: {
          fr: "Sur place quand c’est nécessaire",
          en: "On-site when needed",
        },
        body: {
          fr: "Je me déplace chez vous ou dans vos locaux, dans le Hainaut et le Brabant wallon.",
          en: "I come to your home or premises, across Hainaut and Walloon Brabant.",
        },
      },
      {
        title: {
          fr: "Je vous explique ce qui s’est passé",
          en: "I explain what happened",
        },
        body: {
          fr: "Pour que ça ne se reproduise pas — sans vous facturer le temps passé à expliquer.",
          en: "So it doesn’t happen again — without charging you for the time spent explaining.",
        },
      },
    ],
    offers: [],
    faq: [
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
          fr: "En combien de temps est-ce réglé ?",
          en: "How quickly is it fixed?",
        },
        a: {
          fr: "Un dépannage se règle souvent dans la journée. Quand une pièce doit être commandée ou des données récupérées, je vous dis tout de suite combien de temps prévoir.",
          en: "A repair is often sorted the same day. When a part has to be ordered or data recovered, I tell you straight away how long to expect.",
        },
      },
      {
        q: {
          fr: "Comment se passe une intervention à distance ?",
          en: "How does a remote session work?",
        },
        a: {
          fr: "Je vous indique un logiciel de prise en main à distance, vous me communiquez le code qu’il affiche, et vous voyez à l’écran tout ce que je fais. La connexion se coupe à la fin de l’intervention.",
          en: "I point you to a remote-access program, you give me the code it shows, and you watch everything I do on screen. The connection ends when the session does.",
        },
      },
    ],
    contact: {
      title: { fr: "Décrivez\nla panne.", en: "Describe\nthe problem." },
      sub: {
        fr: "Quelques lignes suffisent : ce qui se passe, depuis quand, sur quel appareil. Je vous réponds sous 24 h avec la marche à suivre.",
        en: "A few lines are enough: what happens, since when, on which device. I reply within 24 hours with what to do next.",
      },
      task: { fr: "La panne", en: "The problem" },
      taskPlaceholder: {
        fr: "Ex. : mon ordinateur portable s’allume mais reste bloqué sur un écran noir depuis hier.",
        en: "E.g. my laptop turns on but has been stuck on a black screen since yesterday.",
      },
    },
    askHours: false,
  },
];

/** Page dédiée par identifiant. */
export function servicePage(id: ServicePageId): ServicePage {
  const page = SERVICE_PAGES.find((entry) => entry.id === id);
  if (!page) throw new RangeError(`Unknown service page: ${id}`);
  return page;
}

/** Page dédiée correspondant à un slug dans une langue donnée. */
export function findServicePage(
  lang: Locale,
  slug: string,
): ServicePage | undefined {
  return SERVICE_PAGES.find((page) => t(page.slug, lang) === slug);
}

/** Chemin absolu d’une page dédiée, préfixe de langue compris. */
export function servicePath(page: ServicePage, lang: Locale): string {
  return `/${lang}/${t(page.slug, lang)}`;
}

/** Slugs des pages dédiées dans une langue : alimente generateStaticParams. */
export function serviceSlugs(lang: Locale): string[] {
  return SERVICE_PAGES.map((page) => t(page.slug, lang));
}
