# Mobile notary website: Astro + Sanity

A fast, bilingual (English + a second language) brochure site for a mobile notary public service.

- **`/` (this folder):** the website, built with [Astro](https://astro.build) into plain static pages.
- **`/studio`:** [Sanity Studio](https://www.sanity.io/studio), the editing back office where the notary changes text, prices and hours.
- **`content/site.json`:** sample content. It is the fallback the site builds from until Sanity is connected, and the seed data for Sanity.

Needs Node 22.23.4 or newer (Astro 7 requirement).

## Run the site now (no Sanity account needed)

```powershell
npm install
npm run dev        # http://localhost:4321
npm run build      # static site into dist/
npm run check      # type-check
```

With no `SANITY_PROJECT_ID` set, the site reads `content/site.json`.

## Connect Sanity (one-time setup)

1. **Create a project.** Sign in at <https://www.sanity.io/manage>, create a project, and note its **project ID**. Use the `production` dataset.
2. **Tell the Studio.** Put the project ID into [`studio/project.ts`](studio/project.ts).
3. **Tell the website.** Copy `.env.example` to `.env` and set `SANITY_PROJECT_ID` to the same value.
4. **Load the sample content into Sanity:**

   ```powershell
   npm run seed
   cd studio
   npm install
   npx sanity login
   npx sanity dataset import seed.ndjson production --missing
   ```

   `--missing` only adds documents that don't exist yet, so it never overwrites edits.
5. **Open the editor.** From the project root run `npm run studio` and edit locally at <http://localhost:3333>. To give the notary a permanent address, run `npm run studio:deploy` and pick a name, such as `yourname.sanity.studio`. Invite them under *Members* at sanity.io/manage.
6. **Rebuild the site.** Run `npm run build`. It now reads from Sanity.

If Sanity is configured but unreachable, the build **fails** instead of publishing stale content. If a particular page document hasn't been created yet, the build warns and uses `content/site.json` for just that page.

## Publish changes automatically

The site is static, so edits in Sanity appear after a rebuild. Host it on Netlify, Cloudflare Pages or Vercel with these build settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | `SANITY_PROJECT_ID`, `SANITY_DATASET` |

Then add a **webhook** at sanity.io/manage → *API* → *Webhooks* that calls your host's *build hook* URL whenever a document is published. After that, hitting **Publish** in the Studio updates the live site within a minute or two.

## What the notary can edit

| Studio page | What's in it |
| --- | --- |
| Site settings | Business name, domain, phone, email, optional booking link and form endpoint, opening hours, search description, button labels |
| Home page | Banner, services list, "why choose us", booking banner |
| About page | Introduction, service area, bio, credentials |
| Pricing page | Price plans and payment note (the services list is shared with the Home page) |
| Contact page | Hours note, how-it-works steps, form labels |
| Privacy policy | The policy text |

Every text field has an English box and an optional **中文** box. Leave 中文 empty to show English only.

## Project layout

```
src/pages/        one file per page (+ sitemap.xml, robots.txt, 404)
src/layouts/      shared page shell: header, footer, SEO tags
src/components/   Bi (bilingual text), Btn, ServiceCards
src/lib/          content.ts (Sanity + fallback loader), types, config, helpers
src/styles/       global.css (colours are the variables at the top)
studio/           Sanity Studio: schema in studio/schemaTypes, page list in structure.ts
scripts/          make-seed.mjs: content/site.json -> studio/seed.ndjson
```

Things that aren't editable in Sanity because they're part of the site's structure: the menu items (`src/lib/config.ts`), the 404 page text, and the interface language pair (`secondaryLang` in `config.ts`; change it if you use something other than Traditional Chinese).

## Before you publish

- Replace every sample value: name, `example.com`, `000-000-0000`, prices, bio and credentials.
- Have the privacy policy reviewed against your own practices and local law.
- Pages use root-relative paths, so deploy at a domain root.
- Set your host's Node version to 22.23.4 or newer (Netlify, Cloudflare Pages and Vercel all have a Node version setting, or add a `.nvmrc`), otherwise the build will fail.
- The root project is on Astro 7 and `npm audit` reports 0 vulnerabilities. The Studio folder still reports some moderate-severity findings in Sanity's own tooling dependencies; they don't ship to your public site. Re-check with `npm audit` after Sanity releases updates, and avoid `npm audit fix --force` there.
- Run `npm run dev` only on localhost.

## Live preview (GitHub Pages)

`.github/workflows/deploy.yml` builds all three designs and publishes them from one Pages site:

| Path | Design |
| --- | --- |
| `/` | Landing page that links to the five designs |
| `/custom/` | Custom design (this project) |
| `/screwfast/` | ScrewFast template, adapted (`variants/screwfast`) |
| `/astrowind/` | AstroWind template, adapted (`variants/astrowind`) |
| `/audit/` | Design based on the free IT Audit Pro theme (`overlays/audit-pro`, see below) |
| `/molique/` | Luxury-brand design in English, with a Chinese version at `/molique/zh/`; AI-generated images and icons, built on the new molique CSS framework (`variants/molique-site`) |

Every push to `main` redeploys. To rehearse the exact Pages build locally:

```powershell
npm run pages:build      # builds _site/ with the same base paths as GitHub Pages
npm run pages:preview    # serves it at http://localhost:4400/notary-site-demos/
npm run pages:check      # crawls every page and reports broken links or assets
```

Preview builds set `PUBLIC_DEMO=1`, which adds `noindex` so search engines ignore them. To use a custom domain later, add a `CNAME` file to `deploy/`, set the domain under Settings, Pages, and build with `PAGES_BASE=""`.

The logo was designed with Codex CLI and refined by hand. Source files are in `logo/` (`mark.svg` is the main mark; `seal.svg` is an alternate).

### The IT Audit Pro design (`/audit/`)

The [IT Audit Pro theme](https://github.com/ctrimm/astro-audit-pro-theme) by Cory Trimm has no licence file, so its source is **not stored in this repository**. `scripts/prepare-audit.mjs` fetches it from the author's repository at a pinned commit, strips the audit-platform pages, and lays our own pages, components and dependency list (`overlays/audit-pro/`) on top. What it keeps from the theme is the stylesheet and design tokens. The prepared copy lives in `variants/audit-pro/` and is git-ignored. If the author adds a licence you can vendor the source instead. Run it locally with `npm run variant:audit`.

### The molique design (`/molique/`)

Built on [molique](https://github.com/rafalrozacki-debug/molique), a CSS framework first published in 2026 (Apache-2.0, installed from npm). It uses native cascade layers, popover and anchor positioning, so it needs a recent browser (Chrome/Edge 125+, Firefox 147+, Safari 26+). All thirteen photographs and textures were generated with Codex CLI; see `variants/molique-site/AI-IMAGES.md` for the list and how to regenerate them.

**Languages.** English is served at `/molique/` and Chinese (Traditional) at `/molique/zh/`; every page exists in both. A dropdown in the header (and links in the footer) switches to the same page in the other language, and the choice is remembered in the browser. The pages are thin wrappers (`src/pages/[...lang]/`) around views in `src/views/` that take a `lang` prop, so adding a language means adding a key to the content file and one entry to `LANGS` in `src/lib/site.ts`.

**Content.** All names, numbers, prices and addresses are made up (`content/molique-sample.json`, copied into the site by `scripts/prepare-molique.mjs`). It has the same amount of content as a typical single-notary site: 5 pages, 6 services, 4 reasons to choose us, 3 steps, 3 price plans, a biography with credentials and a 6-section privacy policy, in both languages. The contact form only composes an email in the visitor's own mail app.

**Look.** Designed after luxury brands (Aman, Cartier, Rolex): square corners, hairline rules, warm stone and near-black, widely spaced capitals, a large serif, a centred wordmark and gold only as an accent (`src/styles/luxe.css`). Primary buttons are live text over a brushed-gold texture (`gold-foil.webp`) rather than flat button images, so they stay sharp, translatable and accessible. The twelve icons are custom: Codex generated two sheets of engraved gold line icons and `scripts/make-icons.mjs` cuts them into transparent masks (`src/assets/icons/`), which CSS colours.

Fonts are self-hosted: Instrument Serif and Instrument Sans for Latin text, Noto Serif TC and Noto Sans TC for Chinese (split by unicode-range, so a page only downloads the glyph slices it uses). `scripts/prepare-molique.mjs` copies molique's CSS and JS (unmodified, with its LICENSE and NOTICE) to `public/vendor/`, and `scripts/optimize-ai-images.mjs` converts new PNGs into the site's WebP files. Run it locally with `npm run variant:molique`.
