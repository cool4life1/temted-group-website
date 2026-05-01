# TemTed Group — Website

Marketing website for **TemTed Group**, a multidisciplinary studio building software products, an academy, and a consulting practice. This repo is a fully static, hand-rolled HTML / CSS / vanilla-JS site — no build step, no framework.

---

## Stack

- **HTML5** — semantic, accessible
- **CSS** — vanilla, modular, custom properties driven
- **JavaScript** — vanilla ES6 IIFE, no dependencies
- **Fonts** — Inter (400/500/600/700) + JetBrains Mono (500/700) via Google Fonts
- **Hosting target** — any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, GitHub Pages)

No package manager. No bundler. Open `index.html` in a browser, or serve with any static file server.

---

## Local development

```bash
cd temted-site

# Option 1 — Python
python3 -m http.server 8080

# Option 2 — Node (npx)
npx serve .

# Option 3 — VS Code Live Server extension
```

Open <http://localhost:8080>.

> A static server is required (not `file://`) because the site uses `fetch()` to inject the header / footer / announcement partials.

---

## Project structure

```
temted-site/
├── index.html                   Home
├── products.html                Products & Apps hub
├── product-chorebuddies.html    Product single (template)
├── academy.html                 TemTed Academy
├── services.html                Solutions & Services
├── about.html                   About / team / careers / press
├── contact.html                 Contact + FAQ
├── insights.html                Blog index
│
├── partials/
│   ├── announce.html            Top announcement bar
│   ├── header.html              Site header + mega menus
│   └── footer.html              Site footer
│
├── src/
│   ├── styles/
│   │   ├── app.css              Single entry — @imports the rest
│   │   ├── tokens.css           Design tokens (color, spacing, type, radius, shadow)
│   │   ├── base.css             Resets, typography, body, focus
│   │   ├── components.css       Buttons, pills, chips, eyebrow, crumbs, forms
│   │   ├── layout.css           Header, footer, mega menu, mobile nav, container
│   │   ├── pages.css            Home + Products hub
│   │   ├── product-page.css     Product single template
│   │   └── secondary-pages.css  Academy / Services / About / Contact / Insights
│   │
│   └── scripts/
│       └── app.js               All interactions
│
├── public/                      Static assets (images, favicons)
├── content/                     Source copy / drafts (not served)
├── design-system/               Reference docs
└── docs/                        Project docs
```

---

## Pages

| Page                       | Path                          | Purpose                                                  |
| -------------------------- | ----------------------------- | -------------------------------------------------------- |
| Home                       | `index.html`                  | Brand intro, three practices, featured product, CTAs     |
| Products & Apps Hub        | `products.html`               | Filterable grid of every product / app                   |
| Product single (example)   | `product-chorebuddies.html`   | Reusable product detail template                         |
| TemTed Academy             | `academy.html`                | Cohort programs, courses catalog, employer partnerships  |
| Solutions & Services       | `services.html`               | Consulting, Engineering, Training, Advisory              |
| About                      | `about.html`                  | Mission, values, team, timeline, careers, press          |
| Contact                    | `contact.html`                | Contact info, lead form, FAQ                             |
| Insights                   | `insights.html`               | Blog index with topic filters and newsletter signup      |

---

## Design system

All design decisions live in `src/styles/tokens.css` as CSS custom properties.

- **Color** — single brand primary, neutral grayscale, semantic surface tokens, dark surface for footer / CTA bands
- **Type scale** — fluid `clamp()` based, display → body sizes
- **Spacing** — `--sp-1` through `--sp-12`
- **Radius** — `--radius-sm`, `--radius-md`, `--radius-lg`
- **Shadow** — soft elevation tokens

To re-skin the site, edit tokens — components inherit from there.

---

## JavaScript modules

`src/scripts/app.js` is a single IIFE that boots on `DOMContentLoaded`. Every behaviour is a small `initX()` function:

| Function              | What it does                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `loadPartials()`      | Fetches `partials/announce.html`, `header.html`, `footer.html` into `[data-partial=…]` slots |
| `initNav()`           | Mega menu open/close, hover on desktop, click on mobile, click-outside, Escape              |
| `initSignInMenu()`    | Header sign-in dropdown                                                                     |
| `initMobileNav()`     | Mobile menu toggle + nested submenu open/close                                              |
| `setActiveNavLink()`  | Adds `.is-active` to the current page's nav link                                            |
| `initTabs()`          | ARIA tablist behaviour with arrow-key navigation                                            |
| `initAccordion()`     | Click to expand `.accordion-item`                                                           |
| `initFilters()`       | Products Hub filter chips + sidebar categories (`data-product-card` / `data-tags`)          |
| `initCatalogFilters()`| Academy & Insights chip filters (`.catalog-filters` + `data-track`)                         |
| `initModals()`        | Open / close / overlay-click / Escape                                                       |
| `initReveal()`        | `IntersectionObserver` reveal-on-scroll for `.reveal`                                       |
| `initAnnounce()`      | Dismiss top bar, remember choice in `sessionStorage`                                        |
| `stampYear()`         | Writes the current year into `[data-year]`                                                  |

No external libraries. No polyfills required for evergreen browsers.

---

## Authoring conventions

- **Partials** — never hard-code the header, footer, or announce bar in a page. Use `<div data-partial="header"></div>` and let `app.js` inject it.
- **Sections** — wrap every section in `<section class="section">…</section>` (or `section--tight` / `section--alt` / `section--cta`) and put content inside `<div class="container">`.
- **Headings** — only one `<h1>` per page (the hero). Use `<h2>` for section heads, `<h3>` for cards.
- **Buttons** — always use `.btn` plus a variant: `.btn--primary`, `.btn--secondary`, `.btn--ghost`. Add `.btn--lg` or `.btn--sm` for size.
- **Eyebrow** — `<span class="eyebrow">…</span>` above section titles for the all-caps mono label.
- **Pills** — `.pill` plus a variant: `.pill--live`, `.pill--beta`, `.pill--soon`, `.pill--category`.
- **Filters** — Products Hub uses `[data-product-card]` + `data-tags="a,b,c"`. Academy & Insights use `[data-track]` + `.catalog-filters`.
- **Anchors** — every section that's deep-linked from the header / footer must have a stable `id`: `#consulting`, `#engineering`, `#training`, `#advisory`, `#telematics`, `#ortholuma`, `#healthdoc`, `#careers`, `#press`, `#team`, `#newsletter`.

---

## Adding a new product page

1. Duplicate `product-chorebuddies.html` and rename.
2. Update `<title>`, `<meta name="description">`, breadcrumbs, hero copy.
3. Replace the feature, integration, pricing, and FAQ blocks.
4. Add a new `<article class="product-card" id="your-slug" …>` to `products.html`.
5. Add the link to `partials/header.html` (mega menu) and `partials/footer.html` (Products column).

## Adding a new blog post

1. Open `insights.html`.
2. Drop a new `<article class="post-card" data-track="engineering|product|academy|leadership|case-studies">` into `.post-grid`.
3. Set `<span class="pill pill--category">` to match the track for visual consistency.

---

## Accessibility

- Skip-to-content link on every page (`.skip-link`)
- Semantic landmarks: `<header>`, `<main id="main">`, `<footer>`, `<nav>`, `<section>`
- All interactive elements are real `<button>` / `<a>` (no clickable divs)
- `aria-expanded`, `aria-controls`, `aria-current`, `aria-label` on menus, tabs, breadcrumbs, social links
- Visible focus states inherit from `:focus-visible` in `base.css`
- Reduced-motion respect can be added by wrapping `.reveal` transitions in `@media (prefers-reduced-motion: reduce)`

---

## Browser support

Targets evergreen browsers: latest Chrome, Edge, Firefox, Safari (desktop + mobile). Uses `color-mix()`, `clamp()`, CSS Grid, `IntersectionObserver` — all supported in current browsers.

---

## Deploy

Any static host works. For Netlify / Vercel / Cloudflare Pages, point the build at the `temted-site/` directory with **no build command** and the publish directory set to the same folder. For GitHub Pages, push the contents of `temted-site/` to the `gh-pages` branch.

---

## Roadmap

- [ ] Replace placeholder visuals (`product-card__media`, `featured-post__visual`, etc.) with real artwork
- [ ] Wire `contact.html` form to a serverless endpoint (Formspree / Netlify Forms / custom)
- [ ] Wire `newsletter-form` (insights / academy) to the email provider of choice
- [ ] Add OpenGraph + Twitter card meta to every page
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Add favicons + `apple-touch-icon`
- [ ] Author real blog posts and split `insights.html` into individual post pages

---

## License

© TemTed Group. All rights reserved.
