# Gentle Frame Studio

**Memories. Reimagined. Forever.**

The official website of [Gentle Frame Studio](https://gentleframestudio.com) — a Belgian
creative studio crafting memorial films, luxury product films, music videos, AI visual
production and quiet software.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com) + ScrollTrigger for the motion system
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling

## Architecture

```
src/
  app/          Route, layout, global styles, SEO (sitemap, robots, OG)
  components/
    brand/      FrameMark (vector logo), Wordmark
    fx/         Motion primitives: SmoothScroll, Cursor, Reveal, ScrubWords,
                Parallax, Magnetic, Timecode
    layout/     Preloader, Header, Footer
    sections/   Hero, Manifesto, Services, Work, About, Process,
                Testimonials, ContactCta
  content/      All copy & data — edit here, the design adapts
  lib/          gsap registration, lenis handle, motion helpers
```

### Adding a project

Append an entry to `src/content/projects.ts`. The archive numbering,
cover art and layout adapt automatically.

### Accessibility & motion

Every animation honors `prefers-reduced-motion`; content remains
visible without JavaScript via `noscript` overrides.

## Development

```bash
npm install
npm run dev
```

Deployed on Vercel — pushes to `main` go live automatically.
