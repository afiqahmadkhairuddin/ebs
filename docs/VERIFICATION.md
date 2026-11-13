# Redesign verification and handoff

## Implementation

The static HTML/Bootstrap application is retained. All 17 requested routes use directory index HTML files generated from shared content and templates. No React, Next.js or other runtime framework was introduced. Development-only Node tooling makes the static generation and regression checks repeatable.

The design retains the original plum/magenta logo palette, adds navy, white and restrained cyan, and uses local fonts, a locally hosted licensed photo, authored diagrams, an accessible desktop services menu and responsive mobile navigation. Company, service and experience content replaces dummy template material. Experience is separated into EBS software work, EBS industrial subcontracting and former-employer experience.

## Checks

| Check | Result |
| --- | --- |
| `npm run build` | Pass: 17 pages, four legacy URL files and complete sitemap generated. |
| `npm run lint` | Pass: 17 pages, 698 local link/asset references, unique titles/descriptions, canonicals, heading hierarchy, unique IDs, JSON-LD, JS syntax, sitemap, CNAME/robots preservation and tracking regression. |
| `npm test` | Pass: all 10 tests. All 51 page/viewport combinations and the prepared-enquiry state have no detected axe violations. |
| Typecheck | Not applicable: the original site and redesign are HTML/CSS/JavaScript with no TypeScript setup. All authored JS/MJS passes Node syntax checks. |
| Existing tests | No pre-existing tests or test command were present. A browser/regression suite has been added. |

The browser suite covers Microsoft Edge headless at **1440×1000, 768×1000 and 390×1000**. At each width it loads all 17 routes, checks horizontal overflow, audits WCAG 2 A/AA and 2.1 AA with axe, checks local HTTP responses and runtime errors, and captures representative full-page screenshots. It also tests menus, Escape behavior, service quotation context, WhatsApp handoff, validation, enquiry preparation, the prepared-message edit flow, original conversion destinations, email fallback scheduling, legacy redirects and static content without JavaScript.

The pages are served locally by `scripts/serve.mjs`, bound to loopback. The test runner starts and stops its owned server. Source files are excluded by the preview server. That exclusion is a local preview behavior, not an unverified claim about the production host.

Final browser run: no detected horizontal overflow, local HTTP errors or uncaught page errors across the 51 page/viewport combinations. Nineteen full-page screenshots were captured. Desktop, tablet and mobile homepages, representative service pages, the contact layout and prepared-enquiry state were visually inspected. The initial pass found a quotation-button contrast issue; its color was corrected before the passing runs. Screenshot review also identified overlap from the floating chat control in the mobile confirmation view; that control is omitted from the contact page, which already has dedicated channel actions. All four legacy redirects are tested with UTM/GCLID parameters and a fragment. `git diff --check` also passes. Automated test reports and screenshots represent local results; no production validation is implied.

## Advertising preservation

- Exactly one Google loader and one initialization script per new page.
- Original config ID: `AW-10852613132`.
- Original email destination: `AW-10852613132/HSdnCJDq5dQcEIz49rYo`.
- Original WhatsApp destination: `AW-10852613132/Z6GjCJXF5dQcEIz49rYo`.
- Both retain event `conversion`, value `1.0` and currency `MYR`; WhatsApp retains timeout `2000`.
- Legacy global functions `gtag_report_conversion` and `gtag_report_conversion_ws` remain available. One delegated click handler replaces inline bindings. The same outbound conversion behavior is available on the new pages.
- The static checker executes the actual original conversion snippets from commit `91fe243` in a mock runtime and compares their parameters with the redesigned functions. It also verifies that email callback and fallback together navigate only once.
- Page loads, quotations and preparing/revising a form emit no conversion. Each tested WhatsApp/email click emits exactly one appropriate conversion. No form-success or new conversion destination was invented.
- No GA4/GTM/Meta/TikTok tag added. No advertising account, DNS or production setting changed.
- Google advertising requests are intercepted in browser QA, preventing test traffic/conversions from reaching the account. These are local emission checks, not production receipt or account attribution checks.

## Enquiry behavior

The old form had no delivery endpoint. The replacement validates locally and prepares a message for an explicit WhatsApp or email handoff. The success state says the message **has not been sent yet**. It does not claim a received lead, store visitor data, or fire a submission conversion. Editing the enquiry hides its prepared state until the visitor prepares the updated message. Phone, email and WhatsApp contact details match the original homepage.

## SEO and URL handling

All pages have unique title and description, one H1, ordered headings, canonical URL, Open Graph metadata and Organization schema. The 12 individual/category service pages additionally have Service schema; inner pages have BreadcrumbList schema. The sitemap contains all 17 canonical URLs. Directory URLs include the trailing slash expected by static hosting. Original `robots.txt` and `CNAME` are unchanged.

The four legacy files provide immediate browser redirects that preserve the query string (including campaign parameters) and fragment, plus canonical targets and visible fallback links. A no-JavaScript meta-refresh fallback is also included. They do **not** return HTTP 301 redirects. A server-side 301/308 mapping should be added once the hosting provider and its supported redirect mechanism are confirmed. Root `index.html` and the original homepage section anchors remain available.

## Verification limits

- No production deployment, push, DNS change or advertising-account write was performed.
- Historical conversion totals, Google Ads destination receipt, attribution, account-side conversion configuration and any remote account-managed tags are not accessible from the repository.
- Real email/WhatsApp delivery and native device/app behavior are not established by intercepted handoff tests. The visitor must send the message in their chosen app. A server-delivered form requires a separately configured backend/provider.
- Desktop/tablet/mobile layouts were tested in Edge with viewport emulation; Safari, Firefox, physical devices and assistive technology sessions were not available. Automated axe checks and keyboard interaction checks are not a complete accessibility certification.
- Production HTTPS, caching, compression, directory handling, host-level redirects and Search Console indexing require host/account access and launch verification.
- Public project summaries rely on the user-supplied CV; contracts, IP ownership, client publication permissions and measured outcomes were not independently verified. No confidential screenshots, project values, performance claims or individual accreditations are presented as company credentials.

These deployment limitations describe the original local delivery. The user subsequently authorized publishing to `main`; GitHub Pages source, custom domain and HTTPS settings have now been verified. See `docs/GITHUB-PAGES.md` for the release configuration and checks. The advertising-account, native message-delivery and third-party platform limitations still apply.

## Review artifacts

Full automated report: `playwright-report/index.html` (local, ignored by Git). Full screenshot set: `test-results/` (local, ignored). Selected final screenshots are retained under `docs/previews/` for review. See `docs/MODIFIED-FILES.md` for the exact changed/added file list and `docs/ASSETS.md` for image licensing.

## Subsequent About page update

At the user's request, the technical-background section now introduces the owner with a CV-based biography and LinkedIn, GitHub, Google Scholar and EBS Resources Facebook links. Static generation and checks pass. The updated About page was checked in Edge at 1440, 768 and 390px: four profile links present, no horizontal overflow and no detected axe WCAG A/AA violations. Mobile section screenshot was visually inspected. External profiles were not used to infer additional credentials; the supplied destinations are retained as requested.

The user subsequently supplied the owner portrait, now displayed alongside the biography and stacked above it on mobile. Its original pixels and aspect ratio are preserved, with explicit dimensions, lazy loading and alternative text. Build and static checks pass with 699 local references. The image loads successfully at all three viewport sizes; About-page overflow and axe checks pass, and desktop/mobile section screenshots were visually inspected.
