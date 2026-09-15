import type { Project } from "@/content/projects";
import { projects } from "@/content/projects";

/**
 * The story behind each portfolio card, rendered at /work/[slug].
 * Keyed by project id. A project without a case here still works
 * as a card; the archive only links through when a case exists.
 * Add a case by adding an entry; nothing else needs to change.
 */

export interface CaseSection {
  title: string;
  paragraphs: string[];
}

export interface CaseStudy {
  id: Project["id"];
  /** One line under the title: what this was, in human terms */
  standfirst: string;
  /** Short facts in the sidebar */
  facts: { label: string; value: string }[];
  sections: CaseSection[];
  /** Closing line, set in italic serif */
  closing: string;
  /** Label for the outbound button; the URL comes from the project */
  visitLabel?: string;
  /** Dutch version of the story; falls back to English when absent */
  nl?: { standfirst: string; facts: { label: string; value: string }[]; sections: CaseSection[]; closing: string; visitLabel?: string };
}

export const cases: CaseStudy[] = [
  {
    id: "ruimteschool",
    standfirst: "A learning universe for children: maths and French, practised between planets, with a badge for every small victory.",
    facts: [
      { label: "What", value: "Learning platform for primary-school children" },
      { label: "Made", value: "Concept, design, illustration direction, development" },
      { label: "Stack", value: "Next.js, Supabase, generative illustration" },
      { label: "Status", value: "Live at ruimteschool.com" },
    ],
    sections: [
      {
        title: "The brief we gave ourselves",
        paragraphs: [
          "Practice apps for children tend to look like worksheets with a mascot glued on. We wanted the opposite: a world a child wants to return to, where the exercises are the journey rather than the toll. Two subjects to start (arithmetic and French vocabulary), because that is where Belgian parents feel the pressure first.",
        ],
      },
      {
        title: "How it works",
        paragraphs: [
          "Every child gets a pilot name, a level and an XP bar. A session is a short round on a planet: the Rekenplaneet for numbers, the Franse Maan for words. Wrong answers are never punished; they feed a “practise your weak spots” round that adapts to what the child finds hard. Badges mark milestones (first correct answer, ten sums, a perfect round) and a small sticker album keeps the collecting instinct busy.",
          "Children can play as a guest with everything stored on the device, or with an account that gives parents a quiet dashboard: what was practised, where it went well, where it didn’t.",
        ],
      },
      {
        title: "The craft",
        paragraphs: [
          "The visual world was built with generative image tools under tight art direction: one palette, one light, one cast of characters, so that a rocket on the start screen and a rocket on a badge are visibly cousins. The interface itself is deliberately calm around all that colour: big targets, few words, no timers that make a seven-year-old anxious.",
        ],
      },
    ],
    closing: "The best compliment so far came from a nine-year-old: “Can I do one more planet?”",
    visitLabel: "Visit Ruimteschool",
  },
  {
    id: "quietwalk",
    standfirst: "A pocket companion that turns an ordinary walk into a moving meditation: slow and brisk intervals, gentle haptics, original Japanese-inspired soundscapes.",
    facts: [
      { label: "What", value: "iPhone and Apple Watch app, with a landing site" },
      { label: "Made", value: "Concept, sound design, interface, development" },
      { label: "Status", value: "Coming to the App Store; site live at quietwalk.app" },
    ],
    sections: [
      {
        title: "Why",
        paragraphs: [
          "Most walking apps count. Steps, kilometres, calories. QuietWalk does not count anything you can brag about. It asks you to walk slowly for three minutes and then a little faster, and to notice the difference. The idea came from night shifts and the walks that followed them: the body needs to come down, and a screen full of numbers does not help.",
        ],
      },
      {
        title: "What it does",
        paragraphs: [
          "You choose a soundscape (“Echoes of Kyoto”, “Dreams of Nara”, “Beyond the Torii Gate”), press Begin, and put the phone away. The watch taps you when the pace changes. The sound is composed in-house: long, unhurried pieces that do not loop audibly and do not ask for attention.",
          "There is no feed, no streak counter, no sharing. A walk ends with one line and a soft chime.",
        ],
      },
      {
        title: "The look",
        paragraphs: [
          "Warm paper white, a single vermilion circle, serif type. The landing site borrows the same restraint: one sentence, one phone, one button. Everything that could be decoration was removed until only the walk remained.",
        ],
      },
    ],
    closing: "Walk yourself quiet.",
    visitLabel: "Visit quietwalk.app",
  },
  {
    id: "shift-planning",
    standfirst: "Staffing and scheduling software for a Belgian prison: more than two hundred officers across ten teams, built by someone who works those shifts.",
    facts: [
      { label: "What", value: "Internal staffing tool, used daily by ten teams and their team leaders" },
      { label: "Made", value: "Concept, design, development, rollout" },
      { label: "Stack", value: "Next.js, Supabase, role-based access" },
      { label: "Status", value: "In daily use; a closed environment" },
    ],
    sections: [
      {
        title: "The problem",
        paragraphs: [
          "Staffing a prison is a puzzle of posts, people, leave, illness and rules that live in the heads of a few experienced officers. It started with one night team; it now covers the whole workforce, more than two hundred officers in ten teams, each with its own rhythm. Paper and spreadsheets did the job, barely, and every change meant phone calls. The tool had to fit an existing rhythm, not impose a new one.",
        ],
      },
      {
        title: "What we built",
        paragraphs: [
          "One screen per shift: who is on which post, who is absent and why, and a pinned note for the things that matter today. The coming days sit underneath as a strip, with understaffing flagged before it becomes a problem. Team leaders plan their own team; officers see their own shifts and can request swaps; a coordinator sees all ten teams at once; everything is logged.",
          "Because the tool lives inside the walls and is used around the clock, the interface was designed for tired eyes at four in the morning as much as for a busy office at noon: high contrast, large type, nothing that needs a manual.",
        ],
      },
      {
        title: "Why it matters to the studio",
        paragraphs: [
          "This is where our software habits were formed: build for real people under real constraints, test on the shift itself, and never ship anything that fails silently. Names and rosters in this case study are blurred; the environment is closed and the people in it deserve their privacy.",
        ],
      },
    ],
    closing: "Een team is als een fiets: als iemand niet trapt, voelt iedereen het.",
  },
  {
    id: "memorial-films",
    standfirst: "Tributes in light. Short films made from photographs, voices and fragments of a life, so a family has a place to return to.",
    facts: [
      { label: "What", value: "Memorial films, 30 seconds to about three minutes" },
      { label: "Made", value: "Conversation, restoration, editing, sound, delivery for the ceremony" },
      { label: "Status", value: "Ongoing; films are private unless a family chooses otherwise" },
    ],
    sections: [
      {
        title: "Rudy",
        paragraphs: [
          "A husband, a father, a man who painted his own walls and polished his own Harley. His family asked for something they could play at the service and keep afterwards. We worked from a handful of clips and photographs, restored what needed restoring, and let the golden evening light do most of the talking. The family gave their blessing to share this one film, so that other families can see what a memorial film is before they write to us.",
        ],
      },
      {
        title: "How we work",
        paragraphs: [
          "It starts with a conversation, never a form. Then the family shares what they have: prints, phone videos, voice messages, a favourite song. We build the film slowly and show a first cut early. Nothing is invented: the new tools are used to restore, to steady, to bring a still gently to life, never to put words in someone’s mouth.",
          "Delivery is a private link and a file to keep, plus a version prepared for the screen at the ceremony when there is one. And we stay reachable afterwards.",
        ],
      },
    ],
    closing: "A place to return to, for as long as you need.",
    visitLabel: "Read about memorial films",
  },
  {
    id: "music-videos",
    standfirst: "Cinematic worlds for original music, written, produced and framed in-house.",
    facts: [
      { label: "What", value: "Music videos and visualisers for the studio’s own releases and for artists" },
      { label: "Made", value: "Creative direction, generative visuals, edit, grade" },
      { label: "Status", value: "Ongoing" },
    ],
    sections: [
      {
        title: "Calibrated Smile",
        paragraphs: [
          "A song about keeping your face together while everything underneath it shifts. The video takes that literally: a portrait that is a puzzle, pieces lifting and settling, shattered glass that never quite falls. Shot as a series of generated sequences under one visual rule (cold light, white wardrobe, a single red accent) and cut to the track’s breathing.",
        ],
      },
      {
        title: "How we approach a track",
        paragraphs: [
          "We listen first, many times, before any image is made. The question is never “what would look cool” but “what does this song already look like”. From there a visual identity follows: palette, wardrobe, one recurring motif. Then production: generated footage where it serves the idea, real footage where it serves the feeling, and an edit that follows the music rather than the other way round.",
          "Because we release music ourselves, we know what an artist is nervous about: that the video will decorate the song instead of extending it.",
        ],
      },
    ],
    closing: "Sound, framed.",
    visitLabel: "Watch on YouTube",
  },
  {
    id: "nft-collections",
    standfirst: "EXCAVARA: a music-mining world where you dig a lost recording out of the earth, stem by stem, until the full mix plays at the core.",
    facts: [
      { label: "What", value: "Web platform, pixel-art game, on-chain collectibles on Base" },
      { label: "Made", value: "Concept, world-building, game engine, smart contracts, platform" },
      { label: "Status", value: "Live at excavara.com; twenty-plus drops from seven artists" },
    ],
    sections: [
      {
        title: "The idea",
        paragraphs: [
          "A recording is buried 650 metres down. At the surface you hear a muffled signal. Every layer you dig through unlocks another stem (drums, bass, keys, guitar, vocals) until the whole mix plays at the bottom. Listening becomes something you do with your hands. Each drop is one track, one world, one limited run of collectible artifacts for the first diggers.",
        ],
      },
      {
        title: "What was built",
        paragraphs: [
          "A drops page where artists publish releases; a pixel-art dig engine written from scratch (a run only ever goes down, there is no climbing back out); stems that fade in as you descend; and NFT claims on Base for collectors. Artwork, sprites and stem splitting are done in-house so that every drop keeps the same handwriting.",
          "The platform now hosts drops from seven artists, with an intake for new ones, and grows one carefully staged release at a time.",
        ],
      },
    ],
    closing: "Dig the track out of the earth.",
    visitLabel: "Visit EXCAVARA",
  },
  {
    id: "tmstry",
    standfirst: "Human // signal // AI. The artist site for TMSTRY, built as a living transmission rather than a press page.",
    facts: [
      { label: "What", value: "Artist website with a global audio player, video and a hidden Signal Room" },
      { label: "Made", value: "Identity, design, sound integration, development" },
      { label: "Stack", value: "Next.js, Sanity" },
      { label: "Status", value: "Live at tmstry.com" },
    ],
    sections: [
      {
        title: "A site that behaves like the music",
        paragraphs: [
          "TMSTRY makes music about the seam between human and machine, so the site had to live on that seam too. A hero that breathes, a transmission feed that ticks, a player that keeps playing while you move through the pages. Waveforms and a portrait in the same frame: the man and the signal.",
        ],
      },
      {
        title: "The Signal Room",
        paragraphs: [
          "Hidden behind the surface is a room of CCTV channels with self-shot clips and small strange broadcasts. It rewards the visitor who lingers. It also taught us something we now bring to client work: a site can have a back room, and people love finding it.",
        ],
      },
    ],
    closing: "Connection is the mission.",
    visitLabel: "Visit tmstry.com",
  },
];

export const caseIndex = new Map(cases.map((c) => [c.id, c]));

/** Project plus its case (in the requested language), or null when either is missing. */
export function getCase(slug: string, locale: "en" | "nl" = "en"): { project: Project; study: CaseStudy } | null {
  const project = projects.find((p) => p.id === slug);
  const base = caseIndex.get(slug);
  if (!project || !base) return null;
  const study = locale === "nl" && base.nl ? { ...base, ...base.nl } : base;
  return { project, study };
}

/** Neighbouring cases for prev/next navigation, in archive order. */
export function neighbours(slug: string): { prev: Project | null; next: Project | null } {
  const withCase = projects.filter((p) => caseIndex.has(p.id));
  const i = withCase.findIndex((p) => p.id === slug);
  return { prev: i > 0 ? withCase[i - 1] : null, next: i >= 0 && i < withCase.length - 1 ? withCase[i + 1] : null };
}
