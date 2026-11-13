# Repository audit — 13 November 2026

Baseline commit: `91fe243` (Enhance gtag_report_conversion_ws function). Working tree was clean. Redesign branch: `redesign/industrial-tech`. No production publication authorized.

## Application and routing

Buildless static HTML; no framework, package manifest, application server, existing tests, build, lint or typecheck commands. Five entry points: `index.html`, `about-us.html`, `contact-us.html`, `features.html`, `pricing.html`. All use local Bootstrap CSS/JS. No repository or ancestor AGENTS.md found.

The homepage is functional marketing content. The four other pages retain Bootstrap template content: lorem ipsum, generic metadata, nonfunctional section links, dummy dollar pricing and a sample Robert Downturn profile. The contact form in `contact-us.html` has no action, method, submit handler, validation or delivery integration.

## Branding and exact asset inventory

- `assets/css/custom.css`: purple primary #5b2be0, Montserrat, gradient hero and green WhatsApp float.
- Other CSS: `Animated-Type-Heading.css`, `Client-Logo-Slider.css`, `Contact-Details-icons.css`, `Footer-with-social-media-icons.css`, `Projects-Grid-images.css`, `animate.min.css`, `aos.min.css`, `styles.min.css`, `vanilla-zoom.min.css` under `assets/css/`.
- `assets/bootstrap/css/bootstrap.min.css`, `assets/bootstrap/js/bootstrap.min.js`.
- Scripts under `assets/js/`: `Animated-Type-Heading.js`, `aos.min.js`, `bs-init.js`, `script.min.js`, `theme.js`, `vanilla-zoom.js`. No advertising integration found in these files. Some unused legacy scripts expect jQuery, which the pages do not load.
- `assets/img/EBS Resources.png`: original 500×500 logo, three plum/magenta bars and black wordmark. Preserve artwork; do not imply a cyan rebrand.
- Other `assets/img/` files: `1280px-Logo_Rasmi_UMT.png`, `EIRLi2black2 (1).png`, `New-Logo.jpg`, `Timeline 1.gif`, `UTP.png`, `ikram-works-logo.png`, `kurita.png`, `persama.jpg`, `ppj.png`, `scenery/FY2023.png`, `avatars/afiq3.jpg`, `avatars/avatar2.jpg`, `avatars/hamizan.jpg`.
- Fonts: local Font Awesome, Simple Line Icons (EOT/SVG/TTF/WOFF/WOFF2 variants), FontAwesome.otf, and ten Montserrat WOFF2 files under `assets/fonts/s/montserrat/v29/`. Existing pages also request Google Fonts, cdnjs baguetteBox and an Icons8 WhatsApp image.

Client logo assets alone do not establish a direct commercial relationship. Avatar files do not verify staff identities. No CV or project narrative found in the repository. Requested technologies and industrial services are approved positioning, not proof of delivered projects. Kurita internal reporting attribution, former-employer/subcontractor work, and industrial achievements require source confirmation before publication.

## Advertising and interaction baseline

All discovered advertising code is in `index.html`:

| Integration | Exact baseline |
| --- | --- |
| Google tag loader | `https://www.googletagmanager.com/gtag/js?id=AW-10852613132` |
| Google Ads config | `AW-10852613132`, once per page |
| Email click | `gtag_report_conversion(url)` → `AW-10852613132/HSdnCJDq5dQcEIz49rYo` |
| WhatsApp click | `gtag_report_conversion_ws()` → `AW-10852613132/Z6GjCJXF5dQcEIz49rYo` |
| Conversion parameters | event `conversion`, value `1.0`, currency `MYR` |
| WhatsApp event timeout | `2000` milliseconds |
| WhatsApp baseline controls | Floating link, hero link, contact link; each invokes one conversion |
| Email baseline control | One `mailto:` link; callback navigates to email URL |

Email navigation currently depends on a tag callback, so blocking Google can prevent the email action. Preserve conversion semantics while adding a navigation fallback. No page-load conversion, form-success conversion, telephone conversion, GTM container, GA4 measurement ID, Meta pixel or TikTok pixel found. Google Ads is not GTM merely because its loader uses googletagmanager.com.

This is a source/interaction baseline, not historical conversion totals. No Ads account, Tag Assistant, consent configuration, remote tag destinations or production reporting access was supplied. Live platform receipt and attribution cannot be established from this checkout.

## Contact and company information

Source: `index.html`, also corroborated by the public homepage at https://ebsresources.my/.

- EBS Resources; registration `IP0539691-U`.
- WhatsApp `+60 10-921 6457`, destination `https://wa.me/60109216457`.
- Email `afiqkhairuddin@ebsresources.my`.
- Malaysia audience; no verified street address, opening hours, SLA, warranty, accreditation or inventory.

## SEO and deployment

`index.html` has title, description, canonical, Open Graph, Twitter card, Organization JSON-LD and favicon. Other pages have generic Brand titles, duplicated favicon links, no canonical or unique metadata. `sitemap.xml` lists all five old URLs with 2026-02-25 dates. `robots.txt` allows crawling and references the domain sitemap. No redirect rules found.

`CNAME` contains `ebsresources.my`, consistent with a custom-domain static host, but it does not prove the hosting provider or publishing settings. `.gitattributes` is the only tracked repository configuration. `README.md` contains only the project name. No `.env*`, secret/config credential file, CI/deployment workflow or backend endpoint found. Never change DNS, CNAME or production settings as part of this redesign.

## Implementation plan

1. Preserve this audit and machine-readable interaction baseline before UI changes.
2. Retain static HTML and local Bootstrap. Generate committed directory `index.html` files for all 17 requested routes using shared templates and content, with no runtime framework dependency.
3. Apply navy/white industrial typography, original plum identity, restrained cyan, original logo, accessible services mega-menu and mobile navigation. Use licensed illustrative photography and authored technical diagrams, never fictional project screenshots.
4. Add distinct, substantive service copy, related links, service-specific WhatsApp messages, quotation CTA and validated enquiry preparation. With no delivery backend, show an honest “enquiry ready” state and explicit WhatsApp/email send action. Do not claim delivery or fire a form-success conversion.
5. Preserve the Google tag ID, both conversion destinations, values and currencies. One delegated handler per outbound click; no new analytics/pixels or page-load conversions. Extend the same outbound actions to new pages. Keep legacy global conversion function names for compatibility.
6. Add unique SEO metadata, Organization/Service/Breadcrumb structured data, complete sitemap, and static legacy redirects with fallback links. Retain homepage anchor compatibility. Document host-level 301 limitations.
7. Run static generation, HTML/link/schema checks, JS lint/syntax checks and browser tests at 1440/768/390. Mock Google network requests during QA to avoid polluting real Ads data. Report limitations and leave production untouched.

## Source clarification received after the initial audit

The user supplied `Downloads/CV Afiq Sept 2026.pdf`. It was read in place, outside the project, without copying the PDF or personal contact details into the website. It identifies the Kurita internal system under EBS Resources, PRPC UF IMCS/ENMCS and SSRV SB BMS/HVAC as EBS subcontract work, and separate project experience under Eirli Systems and TFX Islamic. These distinctions now inform the public projects page. See `docs/CONTENT-SOURCES.md` for the claim-to-source mapping. The initial finding that no CV was present in the repository remains accurate.
