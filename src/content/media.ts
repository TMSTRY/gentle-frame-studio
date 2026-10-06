/**
 * Large media (the sample film per case) lives on Cloudflare R2 behind
 * the studio's own domain, not in the repo: a 23 MB film in public/
 * would travel with every deployment. The free r2.dev address is
 * rate-limited, so the bucket sits behind a custom domain. Set
 * NEXT_PUBLIC_MEDIA_URL in Vercel once the bucket exists.
 */
export const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_URL ?? "https://media.gentleframestudio.com";

/** "work/ruimteschool.mp4" -> the full URL on the media domain. */
export const media = (path: string) => `${MEDIA_BASE}/${path.replace(/^\/+/, "")}`;
