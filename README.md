# Sapience

Independent technology advisory website for Sapience — helping organisations across the lending ecosystem make significant technology decisions.

**Live site:** [sapiencehq.vercel.app](https://sapiencehq.vercel.app)

## Pages

- `index.html` — Home
- `why-sapience-exists.html` — Essay on the firm's founding thinking
- `how-we-help.html` — The nine advisory services
- `how-we-work.html` — The Sapience Decision Framework
- `founder.html` — Founder profile
- `connect.html` — Discovery call request form + contact details
- `404.html` — Custom not-found page

## Stack

Plain HTML/CSS/JS — no framework, no build step.

- **Design system**: `assets/css/style.css` — editorial minimalist palette (sage background, navy accent), Newsreader (serif) + Outfit (sans), self-hosted as variable-font woff2 files in `assets/fonts/`
- **Motion**: GSAP + ScrollTrigger (`assets/js/vendor/`), driving scroll reveals, the hero text stagger, and the animated mobile nav — self-hosted, no CDN dependency
- **Interactivity**: `assets/js/main.js` — header/scroll state, mobile nav, reveal animations, discovery-form validation and mailto handoff
- **SEO/sharing**: Organization + Person JSON-LD, a branded OG image (`assets/og/og-image.png`), per-page meta tags

## Local development

```bash
python3 devserver.py 8743
```

Serves the site at `http://localhost:8743` with caching disabled, so edits show up on a normal refresh.

## Deployment

Hosted on Vercel, connected to this repo — every push to `main` deploys automatically to production.

```bash
npx vercel deploy --prod   # manual deploy, if ever needed
```

## `.agents/` and `.claude/`

A library of Claude Code skills used while building this site (design, animation, and copy-review references). Not part of the shipped website.
