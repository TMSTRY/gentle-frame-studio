/**
 * Copy for the contact form - the studio variant on the home page
 * and the gentler memorial intake (English and Dutch).
 */

export type ContactVariant = "studio" | "memorial";
export type ContactLang = "en" | "nl";

export interface ContactFormCopy {
  name: string;
  email: string;
  topic?: string;
  topicOptions?: string[];
  message: string;
  messagePlaceholder: string;
  date?: string;
  datePlaceholder?: string;
  submit: string;
  sending: string;
  success: { title: string; body: string };
  error: string;
  orWrite: string;
  privacy: string;
  privacyHref: string;
}

export const contactCopy: Record<`${ContactVariant}-${ContactLang}`, ContactFormCopy> = {
  "studio-en": {
    name: "Your name",
    email: "Your email",
    topic: "What is it about?",
    topicOptions: [
      "A memorial film",
      "A product film",
      "A music video",
      "AI visuals",
      "An app or platform",
      "Creative consulting",
      "Something else",
    ],
    message: "Tell us a little",
    messagePlaceholder: "A memory, a product, a song, an idea…",
    submit: "Send",
    sending: "Sending…",
    success: {
      title: "Thank you.",
      body: "Your message has arrived. We answer within two working days. Gently, and by a human.",
    },
    error: "Something went wrong on our side. Please try again, or write to us directly.",
    orWrite: "or write to",
    privacy: "We only use this to answer you. Privacy notice",
    privacyHref: "/privacy",
  },
  "studio-nl": {
    name: "Je naam",
    email: "Je e-mailadres",
    topic: "Waarover gaat het?",
    topicOptions: [
      "Een herinneringsfilm",
      "Een productfilm",
      "Een muziekvideo",
      "AI-beelden",
      "Een app of platform",
      "Creatief advies",
      "Iets anders",
    ],
    message: "Vertel ons kort",
    messagePlaceholder: "Een herinnering, een product, een lied, een idee…",
    submit: "Versturen",
    sending: "Versturen…",
    success: {
      title: "Dank je.",
      body: "Je bericht is aangekomen. We antwoorden binnen twee werkdagen. Zacht, en door een mens.",
    },
    error: "Er ging iets mis aan onze kant. Probeer het opnieuw, of schrijf ons rechtstreeks.",
    orWrite: "of schrijf naar",
    privacy: "We gebruiken dit alleen om je te antwoorden. Privacyverklaring",
    privacyHref: "/nl/privacy",
  },
  "memorial-en": {
    name: "Your name",
    email: "Your email",
    message: "Tell us about them",
    messagePlaceholder: "A few lines, or just a name. We’ll ask the rest in conversation.",
    date: "Is there a date we should know about?",
    datePlaceholder: "A ceremony, an anniversary… (optional)",
    submit: "Send",
    sending: "Sending…",
    success: {
      title: "Thank you for writing.",
      body: "Your message has arrived. We answer within two working days, and we take our time reading.",
    },
    error: "Something went wrong on our side. Please try again, or write to us directly.",
    orWrite: "or write to",
    privacy: "We only use this to answer you. Privacy notice",
    privacyHref: "/privacy",
  },
  "memorial-nl": {
    name: "Je naam",
    email: "Je e-mailadres",
    message: "Vertel ons over hen",
    messagePlaceholder: "Een paar regels, of gewoon een naam. De rest vragen we in een gesprek.",
    date: "Is er een datum die we moeten kennen?",
    datePlaceholder: "Een uitvaart, een herdenking… (optioneel)",
    submit: "Versturen",
    sending: "Versturen…",
    success: {
      title: "Dank je om te schrijven.",
      body: "Je bericht is aangekomen. We antwoorden binnen twee werkdagen, en we nemen de tijd om te lezen.",
    },
    error: "Er ging iets mis aan onze kant. Probeer het opnieuw, of schrijf ons rechtstreeks.",
    orWrite: "of schrijf naar",
    privacy: "We gebruiken dit alleen om je te antwoorden. Privacyverklaring",
    privacyHref: "/nl/privacy",
  },
};
