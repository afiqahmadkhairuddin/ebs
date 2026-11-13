# EBS Resources

Static HTML website for **ebsresources.my**, retained from the existing Bootstrap project. No frontend framework, runtime package installation, server application or database is required for hosting. The original logo, local Bootstrap assets and domain configuration are retained.

The redesign is developed on `redesign/industrial-tech` and released through `main`. GitHub Pages publishes the generated files from the repository root to **https://ebsresources.my/**.

## Local development

Requires Node.js 20 or newer for the development tools:

```sh
npm ci
npm run build
npm run dev
```

Open `http://127.0.0.1:4173`. Stop the server with Ctrl+C.

The 17 generated HTML pages are the actual website. `scripts/content.mjs` holds service and experience content; `scripts/build.mjs` generates HTML from shared templates. Edit these source files, then run the build to keep all pages consistent. CSS is in `assets/css/site.css`; interaction code is in `assets/js/site.js`.

## Routes

- `/`
- `/services/`
- `/services/it-hardware/`
- `/services/it-hardware/computer-laptop-repair/`
- `/services/it-hardware/mobile-phone-repair/`
- `/services/it-hardware/software-support/`
- `/services/custom-software/`
- `/services/custom-software/web-development/`
- `/services/custom-software/business-systems/`
- `/services/custom-software/ai-automation/`
- `/services/industrial-systems/`
- `/services/industrial-systems/imcs-enmcs/`
- `/services/industrial-systems/scada-plc/`
- `/services/industrial-systems/bms-monitoring/`
- `/projects/`
- `/about/`
- `/contact/`

Directory index files support GitHub Pages. Slashless requests resolve to the directory form, which is also the canonical URL. The old `about-us.html`, `contact-us.html`, `features.html` and `pricing.html` files remain as immediate browser redirects that preserve campaign query parameters and fragments, with canonical URLs, visible fallback links and a no-JavaScript meta-refresh fallback. These are client-side redirects; GitHub Pages does not provide application-server redirect configuration for this site. `index.html` and the original homepage anchors `#services`, `#industries`, `#why-us` and `#contact` remain available.

The root `.nojekyll` marker tells Pages to serve the generated static files without Jekyll processing. The existing `CNAME` remains `ebsresources.my`. No Node process, server-side form handler or runtime dependency is required on GitHub Pages. See [GitHub Pages publishing](docs/GITHUB-PAGES.md).

## Enquiries and tracking

No form backend existed. The contact form validates the enquiry and creates WhatsApp and email messages locally. The visitor then chooses a channel and sends the message there. The “ready” state explicitly says the message has not been sent. There is no database, lead storage, invented delivery confirmation or form-success conversion.

The original Google Ads tag, email and WhatsApp conversion destinations, values and currency are preserved in `assets/js/tracking.js`. One delegated handler records one event per outbound click; preparing a form or following a quotation link records no conversion. Email has a navigation fallback for blocked tag callbacks. Do not add a second tag or duplicate inline click handlers. See [the audit](docs/AUDIT.md), [baseline](docs/tracking-baseline.json) and [verification report](docs/VERIFICATION.md).

## Checks

```sh
npm run build
npm run lint
npm test
```

`lint` is a dependency-free static checker for metadata uniqueness, heading/ID structure, local links and assets, JSON-LD, sitemap completeness, JavaScript syntax and conversion parameters compared against original commit `91fe243`. It is deliberately scoped to this static website, rather than a framework lint command.

Playwright uses installed Microsoft Edge (`channel: msedge`); if it is unavailable, install an appropriate browser and change the channel in `playwright.config.mjs`. Tests start their own loopback-only server. All tests block advertising requests; no QA conversions reach Google. The HTML test report and 19 full-page screenshots are generated under ignored `playwright-report/` and `test-results/`. No TypeScript is used, so a TypeScript typecheck is not applicable.

## Content and assets

Approved sources: the original website, the user's positioning brief, and the supplied September 2026 CV. The private CV was read from Downloads and is not copied into this repository. Direct EBS work, EBS subcontracting and earlier employment experience are explicitly distinguished. Individual qualifications are not presented as company accreditations. No client logos are used to imply partnerships.

`assets/img/technology-board.jpg` is a locally hosted photograph by Alexandre Debiève, [original on Unsplash](https://unsplash.com/photos/macro-photography-of-black-circuit-board-FO7JIlwjOtU), downloaded under the [Unsplash License](https://unsplash.com/license). See [asset provenance](docs/ASSETS.md). Project diagrams are original HTML/CSS/SVG illustrations and visibly labeled as concepts, not client screenshots.

## Publishing

The user approved publishing the redesign to `main` on 14 November 2026. Existing Pages settings were verified through GitHub's authenticated API: source `main` at `/`, custom domain `ebsresources.my`, HTTPS enforced. GitHub's existing Pages build/deployment handles publication when `main` is pushed; no custom Actions workflow is needed. Build and check locally before committing the generated files. Keep the original custom domain and advertising IDs unchanged. Future publishing and settings changes require the appropriate authorization. Actual Ads receipt/attribution and real enquiry delivery require account/channel verification; static hosting and browser tests do not establish those outcomes.
