# Momentum Marketing Consultancy

A static, single-page marketing website: hero section, testimonials, and a contact/enquiry form. No build tooling, no package manager, no framework.

![Screenshot of the Momentum Marketing Consultancy website](assets/screenshot.png)

## Structure

- `index.html` — all markup (nav, hero, testimonials, contact form, footer)
- `styles.css` — all styling, mobile-first with breakpoints via `@media (min-width: ...)`
- `script.js` — smooth-scroll nav and the enquiry form's client-side validation + Formspree submission

## Running locally

There's no build step. Either open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```bash
npx serve .
```

## Contact form setup

The enquiry form submits via `fetch()` as JSON to [Formspree](https://formspree.io/). Before the form will work, replace the placeholder endpoint in [script.js](script.js) with your real Formspree form ID:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

Until that's set, submissions will hit the inline error path.

Validation (required fields + a basic email regex) happens client-side only, in `script.js`, before the network call — there is no server-side validation.

## Styling

Colors, spacing, and font are centralized as CSS custom properties in `:root` in `styles.css`. Prefer adjusting those variables over hardcoding new values when changing the look.

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
