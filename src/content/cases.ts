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
    id: "strafwetboek",
    standfirst: "Belgium’s new Criminal Code, in force since 1 September 2026, as a living dataset: 741 articles you can search, compare with the 1867 code and question, with every amendment kept as a readable diff.",
    facts: [
      { label: "What", value: "Public legal reference site, in Dutch" },
      { label: "Made", value: "Data pipeline, parser, old-to-new mapping, search, interface, Claude layer" },
      { label: "Stack", value: "Python, GitHub Actions, Supabase, Next.js, Claude" },
      { label: "Status", value: "Live at strafwetboek.vercel.app; shared by the Ghent Bar with its members" },
    ],
    sections: [
      {
        title: "Why it exists",
        paragraphs: [
          "On 1 September 2026 Belgium replaced its Criminal Code of 1867. The official database, Justel, only ever shows the current text; what changed between two versions is left to whoever has the patience to lay printouts side by side. We wanted the opposite: every article as one record with a stable number, regenerated at every amendment, so that the history of Belgian criminal law becomes something you can read.",
        ],
      },
      {
        title: "What it does",
        paragraphs: [
          "Browse all 741 articles of Book I, Book II and the law on the security measure, search them by word or number, and see every offence sorted into the eight new penalty levels in one atlas. Compare the old 1867 articles with the ones that replaced them: for each of the 884 old articles the mapping names its successor with an honest certainty score, and anything below the threshold is marked as still to be checked. Ask a question and get an answer with the exact articles beside it, or practise with cases.",
          "Nothing runs on a laptop. A push to the repository parses the source, validates it, commits the JSON and reloads the database; the site reads from there.",
        ],
      },
      {
        title: "Trust, earned slowly",
        paragraphs: [
          "This is a tool, not the law, and the site says so on every page. Its text was compared article by article with Justel on 17 September 2026 and all 741 matched; a reporting form lets a reader flag anything that looks off. When a repair law turned out to be missing from the source, the site said so in a notice instead of quietly fixing it. Lawyers noticed: the Ghent Bar shared the site with its members and is adding it to its website.",
        ],
      },
    ],
    closing: "The diff of Belgian criminal law, finally readable.",
    visitLabel: "Visit Strafwetboek 2026",
    nl: {
      standfirst: "Het nieuwe Belgische Strafwetboek, in werking sinds 1 september 2026, als levende dataset: 741 artikelen die je doorzoekt, vergelijkt met het wetboek van 1867 en bevraagt, met elke wetswijziging bewaard als leesbare diff.",
      facts: [
        { label: "Wat", value: "Publieke juridische referentiesite, in het Nederlands" },
        { label: "Gemaakt", value: "Datapijplijn, parser, mapping oud naar nieuw, zoekfunctie, interface, Claude-laag" },
        { label: "Stack", value: "Python, GitHub Actions, Supabase, Next.js, Claude" },
        { label: "Status", value: "Live op strafwetboek.vercel.app; door de Balie Gent gedeeld met haar leden" },
      ],
      sections: [
        {
          title: "Waarom het bestaat",
          paragraphs: [
            "Op 1 september 2026 verving België zijn Strafwetboek van 1867. De officiële databank, Justel, toont altijd alleen de huidige tekst; wat er tussen twee versies veranderde, is voor wie het geduld heeft om afdrukken naast elkaar te leggen. Wij wilden het omgekeerde: elk artikel als één record met een vast nummer, opnieuw gegenereerd bij elke wijziging, zodat de geschiedenis van het Belgische strafrecht iets wordt dat je kunt lezen.",
          ],
        },
        {
          title: "Wat het doet",
          paragraphs: [
            "Blader door alle 741 artikelen van boek I, boek II en de wet op de beveiligingsmaatregel, zoek op woord of artikelnummer, en zie elk misdrijf ingedeeld in de acht nieuwe strafniveaus in één atlas. Vergelijk de oude artikelen van 1867 met hun opvolgers: voor elk van de 884 oude artikelen noemt de mapping de nieuwe tegenhanger met een eerlijke zekerheidsscore, en alles onder de drempel staat gemarkeerd als nog te controleren. Stel een vraag en krijg een antwoord met de exacte artikelen ernaast, of oefen met casussen.",
            "Er draait niets op een laptop. Een push naar de repository leest de bron, valideert ze, commit de JSON en herlaadt de databank; de site leest daaruit.",
          ],
        },
        {
          title: "Vertrouwen, traag verdiend",
          paragraphs: [
            "Dit is een hulpmiddel, niet de wet, en de site zegt dat op elke pagina. De tekst werd op 17 september 2026 artikel per artikel vergeleken met Justel en alle 741 kwamen overeen; via een meldingsformulier kan een lezer signaleren wat niet klopt. Toen bleek dat een reparatiewet in de bron ontbrak, zei de site dat in een melding in plaats van het stil te herstellen. Advocaten merkten het op: de Balie Gent deelde de site met haar leden en zet ze op haar website.",
          ],
        },
      ],
      closing: "De diff van het Belgische strafrecht, eindelijk leesbaar.",
      visitLabel: "Bezoek Strafwetboek 2026",
    },
  },
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
    nl: {
      standfirst: "Een leeruniversum voor kinderen: rekenen en Frans, geoefend tussen de planeten, met een badge voor elke kleine overwinning.",
      facts: [
        { label: "Wat", value: "Leerplatform voor kinderen van de lagere school" },
        { label: "Gemaakt", value: "Concept, ontwerp, illustratieregie, ontwikkeling" },
        { label: "Stack", value: "Next.js, Supabase, generatieve illustratie" },
        { label: "Status", value: "Live op ruimteschool.com" }
      ],
      sections: [
        {
          title: "De opdracht die we onszelf gaven",
          paragraphs: [
            "Oefenapps voor kinderen zien er vaak uit als werkbladen met een mascotte erop geplakt. Wij wilden het omgekeerde: een wereld waar een kind naar wil terugkeren, waar de oefeningen de reis zijn en niet de tol. Twee vakken om mee te starten (rekenen en Franse woordenschat), want daar voelen Belgische ouders de druk het eerst."
          ]
        },
        {
          title: "Hoe het werkt",
          paragraphs: [
            "Elk kind krijgt een pilootnaam, een niveau en een XP-balk. Een sessie is een korte ronde op een planeet: de Rekenplaneet voor getallen, de Franse Maan voor woorden. Foute antwoorden worden nooit afgestraft; ze voeden een ronde “oefen je zwakke plekken” die zich aanpast aan wat het kind moeilijk vindt. Badges markeren mijlpalen (eerste juiste antwoord, tien sommen, een foutloze ronde) en een klein stickeralbum houdt het verzamelinstinct bezig.",
            "Kinderen kunnen spelen als gast, met alles opgeslagen op het toestel, of met een account dat ouders een rustig dashboard geeft: wat er geoefend werd, waar het goed ging en waar niet."
          ]
        },
        {
          title: "Het vakmanschap",
          paragraphs: [
            "De visuele wereld werd gebouwd met generatieve beeldtools onder strakke art direction: één palet, één licht, één cast van personages, zodat een raket op het startscherm en een raket op een badge zichtbaar familie zijn. De interface zelf is bewust rustig te midden van al die kleur: grote knoppen, weinig woorden, geen timers die een zevenjarige nerveus maken."
          ]
        }
      ],
      closing: "Het mooiste compliment tot nu toe kwam van een negenjarige: “Mag ik nog één planeet doen?”",
      visitLabel: "Bezoek Ruimteschool"
    },
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
    nl: {
      standfirst: "Een metgezel in je broekzak die een gewone wandeling omzet in een bewegende meditatie: trage en stevige intervallen, zachte trilsignalen, eigen Japans geïnspireerde klanklandschappen.",
      facts: [
        { label: "Wat", value: "iPhone- en Apple Watch-app, met een landingssite" },
        { label: "Gemaakt", value: "Concept, sounddesign, interface, ontwikkeling" },
        { label: "Status", value: "Komt naar de App Store; site live op quietwalk.app" }
      ],
      sections: [
        {
          title: "Waarom",
          paragraphs: [
            "De meeste wandelapps tellen. Stappen, kilometers, calorieën. QuietWalk telt niets waarmee je kunt uitpakken. Het vraagt je om drie minuten traag te wandelen en dan iets sneller, en het verschil op te merken. Het idee kwam uit nachtdiensten en de wandelingen erna: het lichaam moet tot rust komen, en een scherm vol cijfers helpt daar niet bij."
          ]
        },
        {
          title: "Wat het doet",
          paragraphs: [
            "Je kiest een klanklandschap (“Echoes of Kyoto”, “Dreams of Nara”, “Beyond the Torii Gate”), drukt op Begin en steekt je telefoon weg. Het horloge tikt je aan wanneer het tempo verandert. De muziek is in huis gecomponeerd: lange, onhaastige stukken die niet hoorbaar herhalen en geen aandacht opeisen.",
            "Er is geen feed, geen reeksenteller, geen deelknop. Een wandeling eindigt met één zin en een zachte klank."
          ]
        },
        {
          title: "De look",
          paragraphs: [
            "Warm papierwit, één vermiljoenrode cirkel, schreefletters. De landingssite leent dezelfde terughoudendheid: één zin, één telefoon, één knop. Alles wat decoratie kon zijn, werd weggehaald tot enkel de wandeling overbleef."
          ]
        }
      ],
      closing: "Wandel jezelf stil.",
      visitLabel: "Bezoek quietwalk.app"
    },
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
    nl: {
      standfirst: "Personeelsplanning voor een Belgische gevangenis: meer dan tweehonderd beambten in tien teams, gebouwd door iemand die die diensten zelf draait.",
      facts: [
        { label: "Wat", value: "Interne personeelstool, dagelijks gebruikt door tien teams en hun teamleiders" },
        { label: "Gemaakt", value: "Concept, ontwerp, ontwikkeling, uitrol" },
        { label: "Stack", value: "Next.js, Supabase, toegang per rol" },
        { label: "Status", value: "Dagelijks in gebruik; een gesloten omgeving" }
      ],
      sections: [
        {
          title: "Het probleem",
          paragraphs: [
            "Een gevangenis bemannen is een puzzel van posten, mensen, verlof, ziekte en regels die in het hoofd van een paar ervaren beambten leven. Het begon met één nachtteam; vandaag dekt het de hele personeelsbezetting, meer dan tweehonderd beambten in tien teams, elk met een eigen ritme. Papier en rekenbladen deden het werk, nét, en elke wijziging betekende telefoontjes. De tool moest in een bestaand ritme passen, niet een nieuw ritme opleggen."
          ]
        },
        {
          title: "Wat we bouwden",
          paragraphs: [
            "Eén scherm per dienst: wie staat op welke post, wie is afwezig en waarom, en een vastgepinde nota voor wat vandaag telt. De komende dagen liggen eronder als een strook, met onderbezetting gemarkeerd vóór het een probleem wordt. Teamleiders plannen hun eigen team; beambten zien hun eigen diensten en kunnen wissels aanvragen; een coördinator ziet alle tien de teams tegelijk; alles wordt gelogd.",
            "Omdat de tool binnen de muren leeft en de klok rond gebruikt wordt, is de interface evengoed ontworpen voor vermoeide ogen om vier uur ’s nachts als voor een druk bureau om twaalf uur ’s middags: hoog contrast, grote letters, niets dat een handleiding nodig heeft."
          ]
        },
        {
          title: "Waarom het telt voor de studio",
          paragraphs: [
            "Hier zijn onze softwaregewoonten gevormd: bouwen voor echte mensen onder echte beperkingen, testen tijdens de dienst zelf, en nooit iets uitbrengen dat stil faalt. Namen en roosters in deze case zijn vervaagd; de omgeving is gesloten en de mensen erin verdienen hun privacy."
          ]
        }
      ],
      closing: "Een team is als een fiets: als iemand niet trapt, voelt iedereen het."
    },
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
    nl: {
      standfirst: "Eerbetoon in licht. Korte films uit foto’s, stemmen en fragmenten van een leven, zodat een familie een plek heeft om naar terug te keren.",
      facts: [
        { label: "Wat", value: "Herinneringsfilms, van 30 seconden tot ongeveer drie minuten" },
        { label: "Gemaakt", value: "Gesprek, restauratie, montage, geluid, aflevering voor de plechtigheid" },
        { label: "Status", value: "Doorlopend; films blijven privé tenzij een familie anders kiest" }
      ],
      sections: [
        {
          title: "Rudy",
          paragraphs: [
            "Een echtgenoot, een vader, een man die zijn eigen muren schilderde en zijn eigen Harley poetste. Zijn familie vroeg iets dat ze op de dienst konden afspelen en daarna konden bewaren. We werkten vanuit een handvol clips en foto’s, herstelden wat hersteld moest worden, en lieten het gouden avondlicht het meeste vertellen. De familie gaf haar zegen om deze ene film te delen, zodat andere families kunnen zien wat een herinneringsfilm is vóór ze ons schrijven."
          ]
        },
        {
          title: "Hoe we werken",
          paragraphs: [
            "Het begint met een gesprek, nooit met een formulier. Dan deelt de familie wat ze heeft: afdrukken, filmpjes van de telefoon, spraakberichten, een lievelingslied. We bouwen de film traag op en tonen vroeg een eerste versie. Niets wordt verzonnen: de nieuwe tools dienen om te herstellen, te stabiliseren, een foto zachtjes tot leven te brengen, nooit om iemand woorden in de mond te leggen.",
            "De aflevering is een privélink en een bestand om te bewaren, plus een versie klaargemaakt voor het scherm op de plechtigheid als die er is. En we blijven nadien bereikbaar."
          ]
        }
      ],
      closing: "Een plek om naar terug te keren, zolang je het nodig hebt.",
      visitLabel: "Lees over herinneringsfilms"
    },
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
    nl: {
      standfirst: "Cinematografische werelden voor originele muziek, in huis geschreven, geproduceerd en in beeld gebracht.",
      facts: [
        { label: "Wat", value: "Muziekvideo’s en visualisers voor de eigen releases van de studio en voor artiesten" },
        { label: "Gemaakt", value: "Creatieve regie, generatieve beelden, montage, kleurcorrectie" },
        { label: "Status", value: "Doorlopend" }
      ],
      sections: [
        {
          title: "Calibrated Smile",
          paragraphs: [
            "Een nummer over je gezicht in de plooi houden terwijl alles eronder verschuift. De video neemt dat letterlijk: een portret dat een puzzel is, stukken die opwippen en zich weer neerleggen, versplinterd glas dat nooit helemaal valt. Opgebouwd als een reeks gegenereerde sequenties onder één visuele regel (koud licht, witte kledij, één rood accent) en gemonteerd op de ademhaling van het nummer."
          ]
        },
        {
          title: "Hoe we een nummer aanpakken",
          paragraphs: [
            "We luisteren eerst, vele keren, vóór er één beeld gemaakt wordt. De vraag is nooit “wat zou er cool uitzien” maar “hoe ziet dit nummer er nu al uit”. Daaruit volgt een visuele identiteit: palet, kledij, één terugkerend motief. Dan de productie: gegenereerd beeld waar het het idee dient, echt beeld waar het het gevoel dient, en een montage die de muziek volgt in plaats van omgekeerd.",
            "Omdat we zelf muziek uitbrengen, weten we waar een artiest bang voor is: dat de video het nummer versiert in plaats van het te verlengen."
          ]
        }
      ],
      closing: "Klank, in beeld gevat.",
      visitLabel: "Bekijk op YouTube"
    },
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
    nl: {
      standfirst: "EXCAVARA: een muziekmijnwereld waarin je een verloren opname uit de grond graaft, stem per stem, tot de volledige mix speelt in de kern.",
      facts: [
        { label: "Wat", value: "Webplatform, pixelart-game, on-chain collectibles op Base" },
        { label: "Gemaakt", value: "Concept, wereldopbouw, game-engine, smart contracts, platform" },
        { label: "Status", value: "Live op excavara.com; meer dan twintig drops van zeven artiesten" }
      ],
      sections: [
        {
          title: "Het idee",
          paragraphs: [
            "Een opname ligt 650 meter diep begraven. Aan de oppervlakte hoor je een gedempt signaal. Elke laag die je doorgraaft ontgrendelt een nieuwe stem (drums, bas, keys, gitaar, zang) tot de hele mix speelt op de bodem. Luisteren wordt iets wat je met je handen doet. Elke drop is één nummer, één wereld, één beperkte oplage verzamelbare artefacten voor de eerste gravers."
          ]
        },
        {
          title: "Wat er gebouwd werd",
          paragraphs: [
            "Een dropspagina waar artiesten releases publiceren; een pixelart-graafengine van nul geschreven (een run gaat alleen maar naar beneden, terugklimmen bestaat niet); stems die infaden terwijl je afdaalt; en NFT-claims op Base voor verzamelaars. Artwork, sprites en stem splitting gebeuren in huis, zodat elke drop hetzelfde handschrift houdt.",
            "Het platform host intussen drops van zeven artiesten, met een intake voor nieuwe, en groeit één zorgvuldig voorbereide release per keer."
          ]
        }
      ],
      closing: "Graaf het nummer uit de grond.",
      visitLabel: "Bezoek EXCAVARA"
    },
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
    nl: {
      standfirst: "Human // signal // AI. De artiestensite van TMSTRY, gebouwd als een levende uitzending in plaats van een perspagina.",
      facts: [
        { label: "Wat", value: "Artiestenwebsite met een globale audiospeler, video en een verborgen Signal Room" },
        { label: "Gemaakt", value: "Identiteit, ontwerp, geluidsintegratie, ontwikkeling" },
        { label: "Stack", value: "Next.js, Sanity" },
        { label: "Status", value: "Live op tmstry.com" }
      ],
      sections: [
        {
          title: "Een site die zich gedraagt als de muziek",
          paragraphs: [
            "TMSTRY maakt muziek over de naad tussen mens en machine, dus moest de site ook op die naad leven. Een hero die ademt, een transmissiefeed die tikt, een speler die blijft spelen terwijl je door de pagina’s beweegt. Golfvormen en een portret in hetzelfde kader: de mens en het signaal."
          ]
        },
        {
          title: "De Signal Room",
          paragraphs: [
            "Achter het oppervlak zit een kamer met CCTV-kanalen, zelfgefilmde clips en kleine vreemde uitzendingen. Ze beloont de bezoeker die blijft hangen. Ze leerde ons ook iets wat we nu meenemen naar klantenwerk: een site mag een achterkamer hebben, en mensen vinden het heerlijk om die te ontdekken."
          ]
        }
      ],
      closing: "Verbinding is de missie.",
      visitLabel: "Bezoek tmstry.com"
    },
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
