# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static, single-page marketing consultancy website. No build tooling, no package manager, no framework — just three files at the repo root:

- `index.html` — all markup (nav, hero, testimonials, contact form, footer)
- `styles.css` — all styling, mobile-first with breakpoints via `@media (min-width: ...)`
- `script.js` — smooth-scroll nav and the enquiry form's client-side validation + Formspree submission

## Running / testing

There is no build step. Open `index.html` directly in a browser, or serve the directory with any static file server, to view changes.

## Architecture notes

- **Form submission**: `script.js` submits the contact form via `fetch()` as JSON to a Formspree endpoint defined in `FORMSPREE_ENDPOINT` (`script.js:2`). That constant currently holds a placeholder (`YOUR_FORM_ID`) — submissions will correctly hit the inline error path until it's replaced with a real Formspree form ID.
- **Validation** happens client-side only in `script.js` (required fields + a basic email regex) before the network call is made; there is no server-side validation.
- **Styling** is centralized through CSS custom properties in `:root` (`styles.css`) for colors, spacing, and font — prefer adjusting those variables over hardcoding new values when changing the look.
- Smooth scrolling is handled twice redundantly (CSS `scroll-behavior: smooth` and a JS `scrollIntoView` handler on all `a[href^="#"]` links) — keep both in sync if changing anchor/section IDs.
