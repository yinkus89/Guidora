// src/components/data.ts

export type CategoryType = "emergency" | "resources";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface Country {
  code: string;
  name: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

// Countries for the header dropdown
export const COUNTRIES: Country[] = [
  { code: "DE", name: "Germany" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "IT", name: "Italy" },
  { code: "BE", name: "Belgium" },
  { code: "GLB", name: "Global" },
];

// Categories with the new "type" (drives ResultsView logic)
export const CATEGORIES: Category[] = [
  { id: "health",      name: "Physical & Health",          type: "emergency" },
  { id: "emotional",   name: "Emotional & Psychological",  type: "emergency" },
  { id: "social",      name: "Social & Relationship",      type: "emergency" },
  { id: "financial",   name: "Financial & Economic",       type: "resources" },
  { id: "education",   name: "Educational & Career",       type: "resources" },
  { id: "environment", name: "Environmental & Living",     type: "resources" },
  { id: "moral",       name: "Moral & Spiritual",          type: "resources" },
];

// General, non-urgent tips per category
export const CATEGORY_TIPS: Record<string, string[]> = {
  financial: [
    "List monthly fixed costs and due dates; set reminders.",
    "Bucket money: Needs / Wants / Goals.",
    "Call one creditor to ask about hardship options.",
  ],
  education: [
    "Write the smallest next task; set a 25-minute timer.",
    "Draft a 6-month learning goal in 3 bullet points.",
    "Ask one mentor/peer for feedback this week.",
  ],
  environment: [
    "Note safe exits/contacts; photograph important documents.",
    "Pack a small go-bag (ID, meds, charger, cash).",
    "Pick a family check-in contact & meeting point.",
  ],
  health: [
    "List current meds/treatments and set reminders.",
    "Book a GP/clinic check-in (telehealth if easier).",
    "Track one metric this week (sleep/steps/pain).",
  ],
  emotional: [
    "Try 4-7-8 breathing (2 minutes) daily.",
    "Text one trusted person today.",
    "Plan one small kindness for yourself.",
  ],
  social: [
    "Use an 'I-statement' for a tough convo.",
    "Schedule a cool-off and a follow-up check-in.",
    "Join one recurring activity or group.",
  ],
  moral: [
    "Write top 5 values; pick one small aligned act today.",
    "List options for a dilemma; choose least-harm next step.",
    "Spend 5 minutes in quiet reflection.",
  ],
};

// Resource links by CATEGORY -> COUNTRY
export const RESOURCE_LINKS: Record<string, Record<string, LinkItem[]>> = {
  financial: {
    DE: [
      { label: "Bundesagentur für Arbeit – Bürgergeld & Hilfen", url: "https://www.arbeitsagentur.de" },
      { label: "Jobcenter digital", url: "https://www.jobcenter.digital" },
      { label: "Verbraucherzentrale – Schulden & Finanzen", url: "https://www.verbraucherzentrale.de" },
    ],
    US: [
      { label: "Benefits.gov – Federal Benefits Finder", url: "https://www.benefits.gov" },
      { label: "CFPB – Money & Debt Guides", url: "https://www.consumerfinance.gov/" },
    ],
    UK: [
      { label: "Citizens Advice – Debt & Money", url: "https://www.citizensadvice.org.uk/debt-and-money/" },
      { label: "GOV.UK – Benefits", url: "https://www.gov.uk/browse/benefits" },
    ],
    IT: [
      { label: "INPS – Prestazioni e Sostegni", url: "https://www.inps.it" },
      { label: "Agenzia Entrate – Agevolazioni", url: "https://www.agenziaentrate.gov.it" },
    ],
    BE: [
      { label: "CPAS/OCMW – Aiuti sociali", url: "https://www.mi-is.be/en/ocmw-cpas" },
      { label: "SPF Finances – Aides & info", url: "https://finance.belgium.be" },
    ],
    GLB: [{ label: "OECD – Financial Education", url: "https://www.oecd.org/financial/education/" }],
  },

  education: {
    DE: [
      { label: "BAföG – Förderung für Ausbildung/Studium", url: "https://www.bafög.de" },
      { label: "Bundesagentur für Arbeit – Karriere & Bildung", url: "https://www.arbeitsagentur.de/bildung" },
    ],
    US: [
      { label: "CareerOneStop – Training & Jobs", url: "https://www.careeronestop.org" },
      { label: "Federal Student Aid", url: "https://studentaid.gov" },
    ],
    UK: [
      { label: "National Careers Service", url: "https://nationalcareers.service.gov.uk" },
      { label: "Student Finance England", url: "https://www.gov.uk/student-finance" },
    ],
    IT: [{ label: "ANPAL – Lavoro & Formazione", url: "https://www.anpal.gov.it" }],
    BE: [{ label: "VDAB / Le Forem – Jobs & Training", url: "https://www.vdab.be" }],
    GLB: [{ label: "UNESCO – Lifelong Learning", url: "https://www.unesco.org/en/education" }],
  },

  environment: {
    DE: [
      { label: "Hilfetelefon – Gewalt gegen Frauen (Info)", url: "https://www.hilfetelefon.de" },
      { label: "Katastrophenschutz Infos (BBK)", url: "https://www.bbk.bund.de" },
    ],
    US: [
      { label: "Ready.gov – Emergency Preparedness", url: "https://www.ready.gov" },
      { label: "The Hotline – Safety Planning", url: "https://www.thehotline.org" },
    ],
    UK: [
      { label: "GOV.UK – Prepare for Emergencies", url: "https://www.gov.uk/government/collections/preparation-and-planning-for-emergencies" },
      { label: "National Domestic Abuse Helpline", url: "https://www.nationaldahelpline.org.uk" },
    ],
    IT: [
      { label: "Protezione Civile – Emergenze", url: "https://www.protezionecivile.gov.it" },
      { label: "1522 – Antiviolenza", url: "https://www.1522.it" },
    ],
    BE: [
      { label: "Belgium.be – Urgence & Sécurité", url: "https://www.belgium.be" },
      { label: "Écoute Violences Conjugales", url: "https://www.ecouteviolencesconjugales.be" },
    ],
    GLB: [{ label: "UNHCR Help – Refugee Support", url: "https://help.unhcr.org" }],
  },

  // Fallback resources for emergency-leaning categories
  health: {
    GLB: [{ label: "WHO – Health Topics", url: "https://www.who.int/health-topics" }],
  },
  emotional: {
    GLB: [{ label: "IFRC – Psychosocial Resources", url: "https://pscentre.org/resources" }],
  },
  social: {
    GLB: [{ label: "Mental Health Innovation Network", url: "https://www.mhinnovation.net" }],
  },

  moral: {
    GLB: [{ label: "Gratefulness – Practices", url: "https://gratefulness.org/practice" }],
  },
};

// Emergency hotlines (used only when the category type is "emergency")
export const EMERGENCY_LINKS: Record<string, LinkItem[]> = {
  DE: [
    { label: "112 – Notruf (EU)", url: "tel:112" },
    { label: "TelefonSeelsorge 24/7", url: "https://www.telefonseelsorge.de" },
  ],
  US: [
    { label: "911 – Emergency", url: "tel:911" },
    { label: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org" },
  ],
  UK: [
    { label: "999 – Emergency", url: "tel:999" },
    { label: "Samaritans", url: "https://www.samaritans.org" },
  ],
  IT: [
    { label: "112 – Emergenza", url: "tel:112" },
    { label: "Telefono Amico", url: "https://www.telefonoamico.it" },
  ],
  BE: [
    { label: "112 – Urgence", url: "tel:112" },
    { label: "Tele-Onthaal / Télé-Accueil", url: "https://www.tele-onthaal.be" },
  ],
  GLB: [{ label: "Find local emergency numbers", url: "https://www.wikihow.com/Call-Emergency-Services" }],
};
