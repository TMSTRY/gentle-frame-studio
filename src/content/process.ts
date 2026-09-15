/**
 * How the studio works - five phases, rendered as frames
 * on a filmstrip that exposes as you scroll.
 */

export interface ProcessPhase {
  index: string;
  title: string;
  line: string;
  nl: { title: string; line: string };
}

export const processPhases: ProcessPhase[] = [
  {
    index: "I",
    title: "Discovery",
    line: "We listen first. To the story, the goal, the feeling underneath it.",
    nl: { title: "Verkenning", line: "We luisteren eerst. Naar het verhaal, het doel, het gevoel eronder." },
  },
  {
    index: "II",
    title: "Creative Direction",
    line: "We shape a visual language (tone, rhythm, moodframes) until it fits.",
    nl: { title: "Creatieve richting", line: "We vormen een beeldtaal (toon, ritme, moodframes) tot ze past." },
  },
  {
    index: "III",
    title: "Production",
    line: "We craft. Generations, code, edits, layer by layer, until it breathes.",
    nl: { title: "Productie", line: "We maken. Generaties, code, montages, laag per laag, tot het ademt." },
  },
  {
    index: "IV",
    title: "Refinement",
    line: "We polish gently. Detail by detail, frame by frame.",
    nl: { title: "Verfijning", line: "We polijsten zacht. Detail per detail, beeld per beeld." },
  },
  {
    index: "V",
    title: "Delivery",
    line: "We hand over something finished, and stay close after.",
    nl: { title: "Oplevering", line: "We geven iets afgewerkts uit handen, en blijven dichtbij daarna." },
  },
];
