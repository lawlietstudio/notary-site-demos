# Design variants

Three designs built on Astro templates, adapted to the same notary content and photos, so they can be compared with the main site (option A, the custom design in the project root). Letters match the landing page.

| | Folder | Source | Licence | Run (from project root) |
| --- | --- | --- | --- | --- |
| B | `screwfast/` | [mearashadowfax/ScrewFast](https://github.com/mearashadowfax/ScrewFast) | MIT | `npm run variant:screwfast` (port 4323) |
| C | `astrowind/` | [arthelokyo/astrowind](https://github.com/arthelokyo/astrowind) | MIT | `npm run variant:astrowind` (port 4324) |
| A | project root | custom | n/a | `npm run dev` (port 4321) |
| D | `audit-pro/` (generated) | [ctrimm/astro-audit-pro-theme](https://github.com/ctrimm/astro-audit-pro-theme) | none declared | `npm run variant:audit` (port 4325) |
| E | `molique-site/` | [molique](https://github.com/rafalrozacki-debug/molique) (npm) | Apache-2.0 | `npm run variant:molique` (port 4326) |
| F | `motion-site/` | a copy of E with an animation layer | Apache-2.0 (molique) | `npm run variant:motion` (port 4327) |

First time only: `npm install --ignore-scripts` inside each variant folder (dependencies were installed without lifecycle scripts as a precaution).

## What was changed in the templates

- Content comes from `../content/site.json` (via small generator scripts), English only, so every variant shows the same business.
- The photos in `../photos/` are copied into each variant (credits in `../photos/CREDITS.md`).
- Hardware, blog, docs, landing-page demo and French pages were **moved** (not deleted) into each variant's `_unused/` folder, outside `src/`. You can delete `_unused/` whenever you like. A few empty folder shells remain in `screwfast/src/pages/fr` and `screwfast/src/content`.
- The contact forms in A and B are the templates' demo forms: they are not wired to send anything yet.
- Variants A and B read `site.json` directly. Sanity and bilingual (English + 中文) support exist only in variant C so far; they would be added to whichever variant you choose.

`run.mjs` starts a variant's dev server from inside its own folder (some templates resolve files relative to the working directory).
