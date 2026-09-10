/**
 * How the studio works - five phases, rendered as frames
 * on a filmstrip that exposes as you scroll.
 */

export interface ProcessPhase {
  index: string;
  title: string;
  line: string;
}

export const processPhases: ProcessPhase[] = [
  {
    index: "I",
    title: "Discovery",
    line: "We listen first. To the story, the goal, the feeling underneath it.",
  },
  {
    index: "II",
    title: "Creative Direction",
    line: "We shape a visual language (tone, rhythm, moodframes) until it fits.",
  },
  {
    index: "III",
    title: "Production",
    line: "We craft. Generations, code, edits, layer by layer, until it breathes.",
  },
  {
    index: "IV",
    title: "Refinement",
    line: "We polish gently. Detail by detail, frame by frame.",
  },
  {
    index: "V",
    title: "Delivery",
    line: "We hand over something finished, and stay close after.",
  },
];
