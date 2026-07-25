# Momentum Marketing Consultancy

A static, single-page marketing website for a B2B marketing consultancy: hero, proof-point ticker, approach, a gated lead magnet, testimonials, FAQ, and a contact/enquiry form. No build tooling, no package manager, no framework.

![Screenshot of the Momentum Marketing Consultancy website](assets/screenshot.png)

## Structure

- `index.html` — all markup for the main page (nav, hero, ticker, stats, approach, lead magnet, testimonials, FAQ, contact form, footer), plus SEO meta tags and JSON-LD structured data
- `styles.css` — all styling, mobile-first with breakpoints via `@media (min-width: ...)`
- `script.js` — smooth-scroll nav, animated stat counters, the lead-magnet form, and the enquiry form's client-side validation + FormSubmit.co submission
- `playbook.html` — the standalone lead-magnet content page (the "12-Point Growth Audit Playbook"), unlocked after email capture on the main page
- `robots.txt` / `sitemap.xml` — crawlability files for GitHub Pages deployment

## Running locally

There's no build step. Either open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```bash
npx serve .
```

## Contact form setup

Both the enquiry form and the lead-magnet form submit via `fetch()` as JSON to [FormSubmit.co](https://formsubmit.co/), no signup required. The endpoint in [script.js](script.js) points at the destination email:

```js
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/your-address@example.com';
```

FormSubmit.co sends a one-time confirmation email to that address on first submission — it must be clicked to activate the form.

Validation (required fields + a basic email regex) happens client-side only, in `script.js`, before the network call — there is no server-side validation.

## WhatsApp widget

A floating WhatsApp button (bottom-right, markup at the end of `index.html`) opens a small panel of suggested queries; each links to `https://wa.me/<number>?text=...` with a pre-filled message. The number is hardcoded in the `href` attributes in `index.html` — update all four `wa.me/...` links there if the contact number changes. Panel open/close behavior lives in `script.js`.

## Styling

Colors, spacing, and font are centralized as CSS custom properties in `:root` in `styles.css` — a dark, tournament-inspired palette (violet/blue/green/gold/magenta gradient accents on a near-black background). Prefer adjusting those variables over hardcoding new values when changing the look.

## SEO

`index.html` includes a canonical tag, Open Graph/Twitter meta tags, and `ProfessionalService` + `FAQPage` JSON-LD. `robots.txt` and `sitemap.xml` point at the deployed GitHub Pages URL — update both if the site ever moves to a custom domain. `playbook.html` is marked `noindex` since it's meant to be reached via the on-page email capture rather than search.

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
