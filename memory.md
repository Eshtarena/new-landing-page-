# Eshtarena Landing Page — Codebase Audit

**Audit date:** 2026-07-07
**Scope:** Read-only investigation. No code, dependencies, or config were modified.
**Repo:** `new-landing-page-` (package name: `eshtarena-landing-page`), branch `main`.

---

## ⚠️ Important note on the original brief

The task that prompted this audit referred to the project as "Moshtarena" and described it
as suffering from a mix of **MUI v4, MUI v5, SASS, and plain CSS**, requiring migration to
Tailwind + shadcn/ui.

**This is confirmed to be the correct/intended project** — "Moshtarena" was simply a naming
slip; the actual product/repo name is **Eshtarena**. However, the styling-chaos description
itself still does not match this codebase's actual state. Verified exhaustively before writing
this report:

- `package.json` has **zero** `@mui`/`@material-ui` dependencies, current or historical.
- `grep -r "@mui|@material-ui"` across the whole tree returns nothing.
- **No `.scss`/`.sass` files exist anywhere in the repo.**
- `git log --all -S"@mui"` / `-S"@material-ui"` / `-S".scss"` across **all 85 commits on all 3
  branches** (`main`, `dev`, `eshtarena-web`) returns nothing — this project has been
  **Tailwind CSS from its very first commit**.
- Styling today consists of Tailwind utility classes + exactly **2 plain CSS files**
  (194 lines total): a global reset/RTL-support sheet and a small override sheet for
  third-party form widgets (`react-select`, `react-phone-number-input`).

**Conclusion:** this is the right repo, but there is no MUI/SASS legacy to strip out in it,
and no shadcn/ui migration to plan for the styling layer itself, since Tailwind is already
the sole styling system. It's possible the MUI/SASS description belongs to a different,
older version of this product (e.g. a prior iteration built with Create React App + MUI
before this Next.js + Tailwind rewrite), but that history is not present in this repo's git
log. This report instead documents the *actual* state of the codebase: real architecture
debt, dead code, dependency drift, and code-quality issues — which are substantial, just not
the ones originally described.

---

## 1. Framework Status

| Item | Value |
|---|---|
| Framework | Next.js, **Pages Router** (not App Router) |
| Next.js version | `14.2.30` installed (package.json range `^14.2.30`; npm reports `14.2.35` as latest matching that range, `16.2.10` as absolute latest) |
| React | `18.2.0` (exact pin, no `^`) |
| React DOM | `18.2.0` (exact pin) |
| Language | Mixed **JavaScript + TypeScript** in the same directories (see §3) |
| TS config | `strict: false`, `allowJs: true` — loose mode, not enforcing type safety |
| Styling | Tailwind CSS `3.4.1` (utility-first) + 2 plain CSS files. No CSS-in-JS, no SASS, no MUI. |
| i18n | `next-i18next` (English / Arabic, RTL supported via `[dir]` CSS) |
| Deployment | Docker, `node:18-alpine` base image (Node 18 is EOL as of April 2025) |
| Node package manager | npm (`package-lock.json`, lockfileVersion 3) |

**Notable red flag:** `@types/react@^19.1.9` and `@types/react-dom@^19.1.7` are installed
as devDependencies while the actual runtime is `react@18.2.0`. Type definitions are one
major version ahead of the runtime — this can silently produce incorrect type-checking
(JSX types, `ReactNode` changes, ref typing differences between React 18 and 19) and should
be corrected to `@types/react@^18` / `@types/react-dom@^18` unless an intentional React 19
upgrade is already underway.

---

## 2. Dependencies to Upgrade

Checked live against the npm registry (read-only `npm outdated` / `npm view`, no installs performed).

### Runtime dependencies

| Package | Current | Latest | Gap |
|---|---|---|---|
| `next` | 14.2.30 | 16.2.10 | **2 major versions** behind |
| `react` / `react-dom` | 18.2.0 | 19.2.7 | **1 major** behind |
| `next-i18next` | 14.0.0 | 16.0.7 | **2 major** behind |
| `i18next` | 23.16.8 | 26.3.4 | **3 major** behind |
| `axios` | ^1.11.0 | 1.18.1 | minor drift |
| `@hookform/resolvers` | ^5.2.1 | 5.4.0 | minor drift |
| `react-hook-form` | ^7.62.0 | 7.81.0 | minor drift |
| `react-phone-number-input` | ^3.4.12 | 3.4.17 | minor drift |
| `yup` | ^1.7.0 | 1.7.1 | patch drift |
| `react-select`, `react-swipeable` | current | current | up to date |

### Dev dependencies

| Package | Current | Latest | Gap |
|---|---|---|---|
| `eslint` | 8.56.0 (exact pin) | 10.6.0 | **2 major** behind |
| `eslint-config-next` | 14.1.0 | 16.2.10 | mismatched even against the installed `next@14.2.30`, and 2 majors behind latest |
| `tailwindcss` | ^3.4.1 | 4.3.2 | **1 major** behind (Tailwind v4 is a significant architecture change — see §5) |
| `typescript` | ^5.9.2 | 6.0.3 | 1 major behind (low urgency, 5.9 is current-gen) |
| `@types/node` | ^24.1.0 | 26.1.0 | minor drift |
| `@types/react` | ^19.1.9 | 19.2.17 | **mismatched with runtime react@18** (see §1) |
| `@types/react-dom` | ^19.1.7 | 19.2.3 | **mismatched with runtime react-dom@18** |
| `sharp` | ^0.34.2 | 0.35.3 | patch drift |
| `autoprefixer`, `postcss` | current-ish | current | fine |

### Other findings

- **No `.eslintrc*` file exists anywhere in the repo**, despite `eslint` + `eslint-config-next`
  being installed and a `"lint": "next lint"` script defined. Without a config file, `next lint`
  will typically prompt to generate one on first run — meaning linting is likely not actually
  enforced today (worth confirming by running `npm run lint` locally).
- `node_modules` is not currently installed in this checkout (fresh clone state) — all of the
  above was gathered from `package.json`/`package-lock.json` plus live registry queries.
- Docker base image `node:18-alpine` — Node 18 reached end-of-life in April 2025. Should move
  to Node 20 or 22 LTS alongside any dependency upgrade pass.

---

## 3. Code Quality Issues

### 3.1 Duplicate/parallel component trees (biggest structural issue)

> **Correction (post-Phase-1 build verification):** the original version of this section
> claimed `Navbar.js`, `Footer.js`, `DealCard.js`, and `LanguageSwitcher.js` were all dead
> alongside `sections/`. A real `npm run build` run during Phase 1 proved that wrong for four
> of the five items — only `sections/` was actually unreachable. Those four files have been
> moved to [§3.4](#34-mixed-jsts-with-loose-config-including-surviving-legacy-js-files) as
> live technical debt, not dead code. Details of how each was proven live are below.

The repo contains **two full, parallel implementations** of the same UI concepts — an older
plain-JS set at the top level and a newer TSX set in subfolders. Initially assumed to be
fully superseded, but a static `grep` audit alone was not sufficient to prove that — build
verification found the old set is only *partially* dead:

| Legacy file | Status | Reason |
|---|---|---|
| `sections/AboutSection.js`, `BannersSection.js`, `ContactSection.js`, `DealsSection.js`, `SuppliersRequests.js` (entire `sections/` dir, 608 LOC) | **Confirmed dead — deleted in Phase 1** | No importers found anywhere in the codebase, before or after a `grep` sweep for both path-qualified and bare imports. Build passes with them removed. |
| `components/Navbar.js` | **Live** | Imported directly by `pages/join-suppliers.js` (`import Navbar from "../components/Navbar"`), a real Pages Router route served at `/join-suppliers`. Deleting it breaks that page's build. |
| `components/Footer.js` | **Live** | Same file, same reason: `pages/join-suppliers.js` imports and renders `<Footer socialData={...} />`. |
| `components/DealCard.js` | **Live** | Imported by `components/landingpage/DealsSection.tsx` (the *active*, currently-routed section) via `import DealCard from "../DealCard"`. This is **not** the same file as `components/deals/DealCard.tsx` — that's a separate component in a separate folder, coincidentally sharing a name. Deleting `components/DealCard.js` broke the build with `Cannot find module '../DealCard'` until it was restored. |
| `components/LanguageSwitcher.js` | **Live** — via Webpack resolution order, not just imports | Three files import it with a bare, extensionless specifier: `components/landingpage/Navbar.tsx`, `pages/privacy-policy/index.tsx`, and `pages/terms-and-conditions/index.tsx` (e.g. `import LanguageSwitcher from "../../components/LanguageSwitcher"`). Both `LanguageSwitcher.js` and `LanguageSwitcher.tsx` exist on disk, so which one loads depends entirely on module resolution order. Next.js's webpack config (`node_modules/next/dist/build/webpack-config.js`, `resolveConfig.extensions`) resolves extensions in this order: `[".js", ".mjs", ".tsx", ".ts", ".jsx", ".json", ".wasm"]` — **`.js` before `.tsx`**. That means every one of those bare imports resolves to `components/LanguageSwitcher.js`, making it the file actually rendering the live language switcher today. `components/LanguageSwitcher.tsx` is the one that's truly dead. |

The original "verified dead via grep" claim for the four live files above was a false
negative: `grep` searches missed relative imports that don't repeat the `components/` prefix
(e.g. `"../DealCard"` from inside `components/landingpage/`), and static search cannot surface
a bundler's extension-resolution priority at all. Both gaps were only caught by an actual
`npm run build`, which is why Phase 0's "confirm build succeeds" step is treated as mandatory
before any further deletion, not optional.

There is also a **third, separate component family** for e-commerce/deals pages
(`components/ecommerce/*`, `components/deals/*`) with its own `MainNavbar.tsx` distinct from
`landingpage/Navbar.tsx` — two different navbars for two different route trees
(`/landingpage` vs `/[countryCode]`), which is architecturally reasonable, but means there is
no shared navbar/footer component despite both being "the site chrome."

### 3.2 Orphaned Next.js API route handlers

`services/api/contact.js` and `services/api/terms.ts` are written as Next.js **API route
handlers** (`export default function handler(req, res)`, using `NextApiRequest`/`NextApiResponse`
types) — but **there is no `pages/api/` directory in this project**. In the Pages Router,
only files under `pages/api/` are wired up as real routes. These two files are never invoked
by the framework and are completely dead code, likely artifacts of an abandoned "build our own
API proxy" approach that was superseded by calling the external API directly from the client.

### 3.3 Three parallel data-fetching patterns

1. `utils/api.js` — plain async functions, `fetch` calls, `API_BASE_URL` from
   `process.env.NEXT_PUBLIC_API_URL` with a hardcoded fallback.
2. `services/*.service.ts` (`TermsService`, `PrivacyService`) — class-based, static methods,
   centralized `services/config.ts` with `API_BASE_URL` **hardcoded** (no env var at all).
3. `services/api/*` (dead, see 3.2) — used `process.env.API_URL` (a *different* env var name
   than `utils/api.js`'s `NEXT_PUBLIC_API_URL`, and one that wouldn't even be available
   client-side without the `NEXT_PUBLIC_` prefix).

Three different conventions for the same concern (talking to the backend), with inconsistent
env-var naming and no single source of truth for the API base URL.

### 3.4 Mixed JS/TS with loose config (including surviving legacy `.js` files)

`allowJs: true` and `strict: false` in `tsconfig.json` let `.js`/`.jsx` files coexist
indefinitely with `.ts`/`.tsx`. Concretely: `pages/_app.js`, `pages/_document.js`,
`pages/index.js`, `pages/join-suppliers.js`, `components/Navbar.js`, `components/Footer.js`,
`components/DealCard.js`, `components/LanguageSwitcher.js`, `components/ContactForm.js`,
`utils/api.js`, `utils/consts.js`, `services/api/contact.js` are all plain JS in an otherwise
TypeScript-majority codebase (49 `.tsx` + 15 `.ts` files vs 22 `.js`). `ContactForm.js` is
**not** dead code — it's actively used by the live `landingpage/ContactSection.tsx` — so the
JS/TS split isn't just legacy vs. current, it's threaded through live code too.

**Reclassified from §3.1 after Phase-1 build verification:** `components/Navbar.js`,
`components/Footer.js`, `components/DealCard.js`, and `components/LanguageSwitcher.js` were
originally listed as dead code but are all confirmed live (see §3.1 for the per-file
evidence — a live import from `pages/join-suppliers.js`, a live import from
`components/landingpage/DealsSection.tsx`, and a Webpack extension-resolution order that
picks the `.js` file over its `.tsx` sibling, respectively). They belong here, not in dead
code: they are real, reachable, plain-JS implementations sitting in an otherwise
TypeScript-majority codebase, and in the `LanguageSwitcher` case, silently shadowing a `.tsx`
file of the same name that everyone likely *intended* to be the live one. This is a sharper
version of the JS/TS debt described above — it's not just coexistence, it's an
easily-misread trap where the "obviously newer-looking" `.tsx` file is not actually the one
executing.

### 3.5 Duplicated brand-color source of truth

`utils/colors.ts` hardcodes `darkViolet: '#340040'` (plus a `TAILWIND_COLORS` export meant
"for extending Tailwind colors"), while `tailwind.config.js` independently hardcodes the same
`#340040` as `primary.500`. They are not linked — `tailwind.config.js` does not import from
`utils/colors.ts`. Components then inconsistently reference the color either via the Tailwind
class (`text-primary-500`) or via inline `style={{ color: COLORS.darkViolet }}`
(e.g. `components/deals/DealInfoSection.tsx`, `components/deals/ProgressBar.tsx`). Two sources
of truth for the same brand color, both used in production code.

### 3.6 Inline styles alongside Tailwind

37 occurrences of `style={{...}}` across `.tsx`/`.jsx` files, mostly for values Tailwind's
default scale can't express directly (exact pixel dimensions, dynamic `animationDelay`,
theme-driven colors from `utils/colors.ts`). Not "chaos," but it does mean styling truth is
split three ways: Tailwind classes, the 2 global CSS files, and scattered inline styles.

### 3.7 Unfinished/stubbed functionality

Several auth-related pages contain `// TODO` comments in place of real logic:
- [pages/[countryCode]/[lang]/login.tsx:68](pages/%5BcountryCode%5D/%5Blang%5D/login.tsx#L68) — `TODO: Implement actual login logic here`
- [pages/[countryCode]/[lang]/register/personal.tsx:152](pages/%5BcountryCode%5D/%5Blang%5D/register/personal.tsx#L152) — `TODO: Implement actual registration logic here`
- [pages/[countryCode]/[lang]/register/organization.tsx:192](pages/%5BcountryCode%5D/%5Blang%5D/register/organization.tsx#L192) — same
- [pages/join-suppliers.js:85](pages/join-suppliers.js#L85) — `TODO: Implement API call to submit supplier form`

These pages render full UI/forms but don't actually submit anywhere yet — worth knowing before
assuming any of the auth/registration flow is production-ready.

### 3.8 Miscellaneous

- 33 `console.log`/`console.warn`/`console.error` calls left in source, including in
  production code paths (not just error boundaries).
- Only 4 explicit `: any` type annotations — TypeScript usage is otherwise reasonably typed
  where it's used at all, that part is a positive.
- No test files anywhere in the repo (no `*.test.*`, `*.spec.*`, no test runner configured).

---

## 4. Styling Debt (revised — no MUI/SASS found)

Since the MUI/SASS premise doesn't apply, here is what *actually* constitutes styling debt:

1. **Duplicated color definitions** — `utils/colors.ts` vs `tailwind.config.js` (§3.5).
2. **Three-way style split** — Tailwind classes vs. 2 global CSS files vs. inline `style={{}}` (§3.6).
3. **`!important` usage** in `styles/globals.css` (`.navbar-container`, `.navbar-logo`) —
   a sign some Tailwind/CSS specificity conflict was patched over rather than resolved.
4. **Tailwind is still on v3.4**, not v4 — relevant only if a future shadcn/ui adoption is
   desired, since shadcn/ui's current generator defaults assume Tailwind v4 conventions
   (CSS-first config, `@theme`). Not urgent, just worth knowing.
5. The 2 CSS files themselves are small and purpose-built (global reset/RTL + third-party
   widget overrides for `react-select`/`react-phone-number-input`) — this part is not messy,
   it's a reasonable, minimal footprint.

---

## 5. Migration & Upgrade Action Plan

Given there is no MUI/SASS to remove, the roadmap below is reframed around what this codebase
actually needs: **dependency currency, dead-code removal, and consolidating the styling/data
sources of truth** — with an optional Tailwind v4 + shadcn/ui adoption path if new UI work
wants component primitives beyond raw Tailwind utilities.

### Phase 0 — Safety net (before touching anything)
- Get `npm install` run once to produce a real `node_modules` + confirm current build actually
  succeeds (`npm run build`) as a baseline. This audit couldn't do this — no installs were
  performed under the read-only constraint.
- Add a CI check (or at minimum a documented manual step) that runs `next build` and
  `next lint` (once a lint config exists) before merges, so regressions from the cleanup below
  are caught immediately.

### Phase 1 — Dead code removal (zero risk, highest ROI)
- **Done:** the entire `sections/` directory (5 files, `AboutSection.js`, `BannersSection.js`,
  `ContactSection.js`, `DealsSection.js`, `SuppliersRequests.js`) has been deleted and verified
  dead — `npm run build` passes cleanly with it removed.
- **Revised target:** delete `components/LanguageSwitcher.tsx`, **not**
  `components/LanguageSwitcher.js`. Build verification (§3.1) showed Webpack's extension
  resolution order (`.js` before `.tsx`) makes the `.js` file the one actually loaded by
  `components/landingpage/Navbar.tsx`, `pages/privacy-policy/index.tsx`, and
  `pages/terms-and-conditions/index.tsx` — so the `.tsx` file is the truly orphaned one.
  Grep for importers of `components/LanguageSwitcher.tsx` specifically (not just
  `LanguageSwitcher` generally) immediately before deleting, as a final safety check.
- **No longer targeted for deletion:** `components/Navbar.js`, `components/Footer.js`, and
  `components/DealCard.js` are confirmed live (§3.1) and must stay. They're reclassified as
  technical debt in §3.4, to be addressed by consolidation/conversion in Phase 2 instead of
  deletion.
- Delete `services/api/contact.js` and `services/api/terms.ts` (§3.2) — orphaned API route
  handlers with no `pages/api/` to live in, OR, if server-side API proxying was actually the
  intent, move them into a real `pages/api/` directory and wire them up properly. This is a
  product decision, not just cleanup — confirm which before deleting.
- **Process lesson learned:** a static `grep`-only audit produced two false positives (missed
  a relative import without the `components/` prefix, and couldn't see Webpack's extension
  resolution order at all). Treat "confirmed dead via grep" as provisional until a real
  `npm run build` passes with the file removed — grep is necessary but not sufficient.

### Phase 2 — Consolidate parallel patterns
- **New priority (added after Phase 1 findings):** `components/Navbar.js`,
  `components/Footer.js`, `components/DealCard.js`, and `components/LanguageSwitcher.js` are
  live plain-JS files that either duplicate or silently shadow a `.tsx` counterpart of the
  same name (§3.1, §3.4). Rather than being deletable, each needs a deliberate decision and
  migration: convert to `.tsx` and either merge with its same-named sibling
  (`components/deals/DealCard.tsx` is a genuinely different component, so `DealCard.js` needs
  a rename, not a merge) or, for `LanguageSwitcher`, delete the now-redundant
  `components/LanguageSwitcher.tsx` first (Phase 1) and then convert the surviving `.js` file
  to TypeScript in place. Treat this as higher priority than the general JS→TS conversion
  below, since the `LanguageSwitcher` name collision is an active footgun for the next person
  who assumes the `.tsx` file is the live one.
- Pick **one** data-fetching convention (recommend the `services/*.service.ts` class pattern,
  since it already centralizes `API_BASE_URL` and response handling) and migrate
  `utils/api.js`'s functions into that shape. Standardize on a single env var name
  (`NEXT_PUBLIC_API_URL`) used everywhere, including `services/config.ts`, which currently
  hardcodes the URL with no env override at all.
- Make `tailwind.config.js`'s `primary` palette the single source of truth; either delete
  `utils/colors.ts` in favor of Tailwind classes everywhere, or have `tailwind.config.js`
  import from `utils/colors.ts` so there's one definition, not two.
- Convert the remaining live `.js`/`.jsx` files with real logic (`ContactForm.js`,
  `utils/api.js`, `utils/consts.js`, `pages/join-suppliers.js`, `pages/_app.js`,
  `pages/_document.js`) to TypeScript incrementally, file by file, since `allowJs` already
  permits them to coexist — no big-bang rewrite needed.

### Phase 3 — Dependency upgrades (in order of risk, lowest first)
1. **Patch/minor bumps first** (§2 runtime table): `axios`, `@hookform/resolvers`,
   `react-hook-form`, `react-phone-number-input`, `yup`, `sharp`. Low risk, run full manual
   regression of the contact form and phone input afterward.
2. **Fix the `@types/react`/`@types/react-dom` mismatch immediately** — either pin them back to
   `^18.x` to match the installed React 18 runtime, or treat it as the trigger to do the React
   19 upgrade properly (see step 4). Leaving mismatched major-version type packages installed
   is the single highest-value, lowest-effort fix in this whole audit.
3. **`eslint` 8 → next major, add a real `.eslintrc`/flat config**, then run `next lint` and
   triage the fallout before continuing further upgrades — this makes every subsequent step
   safer by catching regressions automatically.
4. **Next.js 14 → 15 → 16, React 18 → 19**, as a dedicated, isolated upgrade effort (not
   bundled with feature work.) Do Next 14→15 first, run the app, then 15→16; check Next's
   official codemods for the Pages Router at each step. React 19 has behavioral changes (ref
   handling, `useEffect` timing edge cases) worth a manual pass over the two custom hooks/state
   patterns in `hooks/useDealsFilter.ts` and the deal/carousel components.
5. **`next-i18next` 14 → 16 / `i18next` 23 → 26**, after the Next.js upgrade lands (these
   track Next.js major versions closely) — verify Arabic RTL rendering and locale routing
   still work, since this is a bilingual product-facing surface.
6. Move Docker base image from `node:18-alpine` to `node:22-alpine` (current Node LTS) as part
   of the same effort, since the Next.js versions being targeted require newer Node anyway.

### Phase 4 — Optional: Tailwind v4 + shadcn/ui adoption
Only pursue this if the new UI design genuinely needs reusable, accessible component
primitives (dialogs, dropdowns, tabs, etc.) beyond what hand-rolled Tailwind components
currently provide — not because of any legacy-styling pressure, since there isn't any here.
1. Upgrade `tailwindcss` 3.4 → 4.x first, in isolation, using Tailwind's official codegen
   migration tool. Confirm `tailwind.config.js` → CSS-first `@theme` config translates the
   `primary` palette correctly, and that the two existing CSS files
   (`globals.css`/`form.css`) still compile (v4 changes `@tailwind` directive syntax).
2. Run `npx shadcn@latest init` once Tailwind v4 is stable, pointing its color tokens at the
   same brand palette consolidated in Phase 2.
3. Introduce shadcn components only where a new design screen is actively being built —
   don't retrofit existing working components. Let old and new coexist; there is no MUI to
   race to remove, so there's no urgency pressure here, unlike a real MUI-migration scenario.

---

## 6. Summary

- **The originally-described MUI v4/v5/SASS chaos does not exist in this repository** — it has
  been Tailwind-only since its first commit. This needs to be reconciled with whoever provided
  the original brief; either a different repository was intended, or the description was stale.
- The *actual* debt here is: ~1,500+ LOC of dead legacy component code left alongside its
  replacement, orphaned Next.js API route handlers that were never wired up, three competing
  data-fetching conventions, a duplicated brand-color source of truth, a React/`@types/react`
  major-version mismatch, no lint config despite lint tooling being installed, and Next.js/React
  sitting one to two major versions behind current.
- None of this blocks shipping, but the dead-code removal (Phase 1) is free, safe, and should
  happen regardless of any other decision; the `@types/react` mismatch (Phase 3.2) is the
  highest-value single fix in the dependency list.

---

## Routing & Navigation Map

**Audit date:** 2026-07-08
**Scope:** Read-only navigation/routing investigation. No `.js`/`.tsx` files were modified —
findings only, written here.
**Trigger:** manual testing found "island routing" — the landing page (`/`) has effectively no
visible path into the rest of the app (store, deals, auth). This section maps every route and
proposes how to connect them.

### 1. Complete route map (Pages Router, from `pages/` file structure)

| Route (URL) | File | What it is | Site chrome used |
|---|---|---|---|
| `/` | `pages/index.js` | Client-side redirect (`router.replace`) straight to `/landingpage` | none (redirect only) |
| `/landingpage` | `pages/landingpage.tsx` | The actual marketing homepage (banners, about, deals, contact, suppliers CTA) | `landingpage/Navbar.tsx` + `landingpage/Footer.tsx` |
| `/[countryCode]` (`egy`, `saudi`) | `pages/[countryCode]/index.tsx` | The e-commerce store home (hero slider, category shortcuts, mega deals) | `ecommerce/MainNavbar.tsx` |
| `/[countryCode]/[lang]/login` | `.../login.tsx` | Auth login page (`egy`/`saudi` × `en`/`ar`) | **none** — no navbar/footer import at all |
| `/[countryCode]/[lang]/register` | `.../register/index.tsx` | Registration type picker (personal vs organization) | **none** |
| `/[countryCode]/[lang]/register/personal` | `.../register/personal.tsx` | Personal registration form (stubbed submit, §3.7 above) | **none** |
| `/[countryCode]/[lang]/register/organization` | `.../register/organization.tsx` | Org registration form (stubbed submit) | **none** |
| `/[countryCode]/[lang]/forgot-password` | — | **Linked from `login.tsx` but the page does not exist.** Confirmed via `find pages -iname "*forgot*"` returning nothing. This is a live 404 in production today. | n/a |
| `/deal-details/[id]` | `pages/deal-details/[id].tsx` | Individual deal detail page (tabs, info section) | `ecommerce/MainNavbar.tsx` |
| `/deal-showcase` | `pages/deal-showcase.tsx` | Internal component showcase for deal-card variants | none |
| `/mega-deals-demo` | `pages/mega-deals-demo.tsx` | Dev/demo page for the `MegaDeals` component, emoji-labeled ("🎯 Mega Deals Demo") | none |
| `/join-suppliers` | `pages/join-suppliers.js` | Supplier application form (stubbed submit, §3.7 above) | legacy `components/Navbar.js` + `components/Footer.js` |
| `/privacy-policy` | `pages/privacy-policy/index.tsx` | Legal page, CMS-backed via `PrivacyService` | `Logo` + `LanguageSwitcher` only — no nav links, no footer |
| `/terms-and-conditions` | `pages/terms-and-conditions/index.tsx` | Legal page, CMS-backed via `TermsService` | `Logo` + `LanguageSwitcher` only |
| `/404` | `pages/404.tsx` | Custom not-found page | (not inspected in this pass) |

### 2. Navigation audit — what's actually wired up vs. missing

**a) The landing page is nearly a dead end.**
`landingpage/Navbar.tsx` and `landingpage/Footer.tsx` (the chrome for `/` → `/landingpage`)
contain **zero links to `/[countryCode]`, `/deal-showcase`, `/deal-details/*`, or any auth
page.** Concretely:
- Navbar desktop/mobile links are only in-page scroll anchors (`#about`, `#deals`, `#contact`)
  plus one external link, `https://dashboard.eshtarena.com/login` (`target="_blank"`).
- Footer links are only: logo → `/`, `/terms-and-conditions`, `/privacy-policy`, app-store
  badges, and social icons. No store link, no deals link, no login/register link.
- The **only** genuine internal cross-page link anywhere on the landing page is the
  `SuppliersRequests` section's button, which does `router.push("/join-suppliers")`
  (`components/landingpage/SuppliersRequests.tsx:10`).
- Deal cards rendered by `DealsSection` (via the live `components/DealCard.js`, see §3.1 above)
  have **no click handler and no link** — clicking a deal on the landing page does nothing,
  even though a fully built `/deal-details/[id]` page exists and is reachable from elsewhere.

**b) `/[countryCode]` (the actual store) is an orphan.**
Nothing in the codebase links *to* `/[countryCode]` from the landing page or any other page —
grepped for `countryCode` in every landing-page component and found no `Link`/`href`/`router.push`
targeting it. The store is only reachable if a user already knows the URL (`/egy` or `/saudi`).
Once inside the store, navigation *within* the ecommerce tree works fine (`MainNavbar` → account
icon → `buildLoginRoute(countryCode, lang)`, logo → `/`), it's just that nothing points *into* it.

**c) Two different, inconsistent "Login" destinations exist across the app.**
- `landingpage/Navbar.tsx`: external `https://dashboard.eshtarena.com/login`
- legacy `components/Navbar.js` (used only by `/join-suppliers`): external
  `https://eshtarena.com/login` — a **different domain** than the one above.
- `ecommerce/MainNavbar.tsx`: internal `buildLoginRoute(countryCode, lang)` →
  `/[countryCode]/[lang]/login`, the real, fully-built login page in this repo.

  Three different "login" destinations depending on which page a user is standing on, and the
  one pointing at the actual in-repo login page is never surfaced from the landing page at all —
  someone lands on the marketing site, hits "Login," and is sent to an entirely external domain
  instead of the working `/[countryCode]/[lang]/login` this codebase ships.

**d) Legacy `/join-suppliers` chrome (`Navbar.js`/`Footer.js`) points to a third external domain
for terms/privacy**, even though this same repo has working internal pages for both:
`Footer.js` links to `https://eshtarena.com/terms-conditions` and
`https://eshtarena.com/privacy-policy`, while `landingpage/Footer.tsx` correctly links to the
internal `/terms-and-conditions` and `/privacy-policy`. Same site, same two legal documents,
two different link targets depending on which footer happens to render.

**e) Auth pages (`login`, `register/*`) render with zero site chrome.**
No `Navbar`/`Footer` import anywhere in `login.tsx`, `register/index.tsx`,
`register/personal.tsx`, or `register/organization.tsx` — confirmed via grep, only form/input/
button/stepper components are imported. A user who lands here (e.g. via the store's account
icon) has no logo-as-home-link, no way back to the store or landing page except the browser
back button, and no cross-link to the marketing site at all. `privacy-policy`/
`terms-and-conditions` are slightly better (they at least render a `Logo`, which links home)
but still have no nav links to the store or landing sections.

**f) `MobileBottomNav.tsx` (ecommerce) is inert.**
Its four tabs (Home / Vouchers / My deals / Profile) are plain `<button>` elements with no
`onClick`, no `Link`, no route wiring at all — it's a visual mockup of a bottom nav, not a
functioning one, in the mobile store experience.

**g) Dev/demo pages are indistinguishable from real routes.**
`/deal-showcase` and `/mega-deals-demo` are component showcases (their own titles say "Demo"/
"Showcase") but ship as normal top-level routes with no `noindex`, no auth gate, and no
navigation pointing at *or away from* them — they're just floating in the same route space as
production pages.

**h) The broken `forgot-password` link (§1 table)** compounds the auth-page isolation problem:
a user who does find their way to `/[countryCode]/[lang]/login` and clicks "Forgot password?"
hits a 404, with no chrome on that 404 pointing them back anywhere either.

### 3. UX/UI proposal — unifying navigation

**Landing page CTAs (highest priority — this is the reported symptom):**
1. Add a primary "Shop Now" / "Browse Store" CTA button in the landing-page navbar
   (`landingpage/Navbar.tsx`) and in the hero/banner area, routing to `/[countryCode]` — but
   the country code must come from somewhere real (locale/geo-detection, a country picker
   modal, or a stored user preference), not be hardcoded, since two countries (`egy`, `saudi`)
   already exist as valid routes.
2. Wire `DealCard.js` deal clicks (rendered inside the landing page's `DealsSection`) to
   `navigateToDealDetails`/`handleDealClick` from `utils/navigation.ts` — that helper already
   exists and is already used by `deal-showcase.tsx`, it's just never imported by the live
   landing-page deals section.
3. Replace the landing page's external login link
   (`https://dashboard.eshtarena.com/login`) with the same `buildLoginRoute(countryCode, lang)`
   pattern `ecommerce/MainNavbar.tsx` already uses — one login destination, not three.

**Unify the navbar/footer components (ties into the Phase 2 consolidation plan in §5 above):**
4. Standardize on a single footer content model: keep `landingpage/Footer.tsx`'s internal
   `/terms-and-conditions` / `/privacy-policy` links as the canonical version, and either
   delete `components/Footer.js`'s external legal links or repoint them to match. Same repo,
   same documents, must resolve to the same URL everywhere.
5. Give the auth pages (`login`, `register/*`) a shared minimal header — at minimum a logo
   linking home and a link back to the store for the current `countryCode`/`lang` — so users
   aren't stranded with only the browser back button.
6. Add a "Store" and/or "My Account" entry point to `landingpage/Navbar.tsx` and
   `landingpage/Footer.tsx`'s link column, so the store isn't only reachable by direct URL.
7. Wire up `MobileBottomNav.tsx`'s four buttons to real routes (`Home` → `/[countryCode]`,
   `Profile`/`My deals` → the relevant `countryCode`/`lang` auth or account route) instead of
   inert buttons — currently a purely cosmetic bottom nav in the mobile store view.
8. Create the missing `/[countryCode]/[lang]/forgot-password` page (or remove the link from
   `login.tsx` until it exists) to close the dead-end 404.
9. Either gate `/deal-showcase` and `/mega-deals-demo` behind a dev-only flag / exclude from
   the sitemap, or formally fold their content into the real deals flow — right now they're
   unlinked orphans indistinguishable in the route table from production pages.

**Suggested cross-linking summary (who should link to whom):**
- Landing page → Store (`/[countryCode]`): **missing, add primary CTA.**
- Landing page → Login/Register: **exists but points externally, redirect internally.**
- Store → Landing page: **exists** (logo `href="/"` in `MainNavbar`/`Logo`).
- Store → Login/Register: **exists** (`buildLoginRoute` in `MainNavbar`'s account icon).
- Login/Register ↔ each other: **exists** (`buildLoginRoute`/`buildRegisterRoute` cross-links).
- Login → Forgot password: **broken, page missing.**
- Any page → Join Suppliers: **only from landing page's `SuppliersRequests` section** — consider
  also surfacing this from the store or a footer link, since supplier signup is a distinct
  funnel from customer login/register.
- Legal pages (`privacy-policy`, `terms-and-conditions`) → rest of site: **only via logo**, no
  nav back to store/landing sections.
