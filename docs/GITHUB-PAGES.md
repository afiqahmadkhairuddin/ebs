# GitHub Pages publishing

The user authorized pushing the completed redesign to `main` on 14 November 2026.

## Verified configuration

Read through GitHub's authenticated REST API without modifying settings:

- Repository: `afiqahmadkhairuddin/ebs` (public).
- Default and publishing branch: `main`.
- Publishing folder: `/` (repository root).
- Build type: `legacy` (GitHub's existing branch-based Pages deployment).
- Custom domain and `CNAME`: `ebsresources.my`.
- Public URL: `https://ebsresources.my/`.
- HTTPS enforced: `true`.
- Prior successful published commit: `91fe24379bcde3b0e0a1896107d9bb69719cfb36`.

## Compatibility

GitHub Pages serves static HTML, CSS, JavaScript and images. All 17 routes have physical directory `index.html` files. The root page and four old HTML URLs remain present. CSS, browser JavaScript, fonts, the technology photograph and supplied owner portrait are local assets. The root `.nojekyll` marker disables Jekyll preprocessing. Generated HTML is included in the release commit, so Pages does not need to run npm or a Node server.

The existing custom domain makes root-relative internal links appropriate. The canonical URLs and sitemap match that domain. No DNS, Pages-source, HTTPS or advertising-account setting is changed by this release.

The enquiry form prepares a WhatsApp or email message in the browser; it does not depend on a server-side endpoint. The visitor explicitly chooses a channel and sends the message there. Ads scripts retain the original config and conversion destinations. No backend-only feature is represented as available on Pages.

Legacy page files use browser redirects with query/fragment preservation and a no-JavaScript fallback. They do not return HTTP 301 responses. GitHub Pages is static hosting; this release does not assume nginx, Apache, PHP, Django, Next.js middleware or a custom application server.

## Release checks

1. Run `npm run build`, `npm run lint` and `npm test` locally.
2. Commit the website and shared source on the redesign branch, then fast-forward `main` where possible.
3. Push `main` without force-pushing, which triggers the existing Pages publication.
4. Confirm the Pages build targets the new commit and succeeds.
5. Request all 17 live routes and key assets; inspect navigation and the owner portrait without sending test conversions to Google.
6. Keep the temporary local test service stopped after verification, as requested by the user.

Live Ads receipt/attribution, message delivery in native apps and Search Console indexing remain separate from deployment verification. Publication status is available in the repository's [Pages deployment history](https://github.com/afiqahmadkhairuddin/ebs/actions).

GitHub references: [Static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [branch publication and `.nojekyll`](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
