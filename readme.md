# SD Fast Notary website

A static site with no build step. Upload the contents of this folder to the web root (`public_html`) of sdfastnotary.com.

## Files
| File | Purpose |
|---|---|
| `index.html` | Homepage: hero, booking, "at a glance" facts, services, pricing, areas, FAQ, guides, contact + map |
| `mobile-notary.html`, `loan-signing.html`, `apostille.html`, `hospital-jail-notary-san-diego.html` | Service pages |
| `service-areas.html` + 55 `*-mobile-notary.html` | Hub plus one page per community (ZIPs, local hospitals/facilities, FAQ, estimator, nearby links) |
| `price-estimator.html` | Notary cost calculator ($15 per signature); the same widget is on the homepage and area pages |
| `business-notary-san-diego.html`, `assisted-living-notary-san-diego.html` | Industry pages |
| `faq.html` | 23 Q&As with FAQPage schema (AI / featured-snippet answers) |
| `guides.html` + 4 guide pages | Answer-first articles: cost, ID rules, apostille, power of attorney |
| `privacy.html`, `404.html` | Privacy policy (CCPA/CPRA), not-found page |
| `robots.txt` | Explicitly allows Google, Bing, Apple, and AI crawlers (ChatGPT, Claude, Perplexity, etc.) |
| `llms.txt` | Plain-text summary of the business for AI assistants |
| `sitemap.xml` | All 71 indexable pages |
| `5fc4be2a970d3186a2c68e1b493f0d57.txt` | IndexNow key (instant Bing / ChatGPT-search indexing) |
| `.htaccess` / `_headers` / `vercel.json` | Security headers + HTTPS for Apache / Netlify-Cloudflare / Vercel |
| `.well-known/security.txt` | Security contact |

Booking buttons go to https://calendly.com/notaryservicesigning. The quick-request form opens a pre-filled text by default; set `FORM_ENDPOINT` in `assets/main.js` (for example a Formspree URL) to receive requests by email.

## Google reviews
The homepage shows the Google rating (5.0, 276+ reviews, Oct 2026) for the "Notary Public - Pragya Sharma" Google listing, with buttons linking to it (`https://maps.google.com/?cid=4287846694361830860`). Update the count in `index.html`, the page template top bar, and `llms.txt` as reviews grow.

**Live Google reviews widget (optional):** to show individual reviews that update automatically, create a free widget (for example Trustindex or Elfsight) connected to the Google listing, then paste its embed code inside `<div id="google-reviews-widget">` on `index.html`. Also add the widget's domains to the Content-Security-Policy in `.htaccess`, `_headers`, and `vercel.json` (`script-src`, `style-src`, `img-src`, `connect-src`, `frame-src`), or the browser will block it.

**Better "Leave a review" link:** in Google Business Profile, choose "Ask for reviews", copy the short link (`g.page/r/.../review`), and replace the "Leave a review" button URL in `index.html`.

## Launch checklist (dev)
1. Upload the files, including the hidden `.htaccess` and `.well-known/`.
2. Add 301 redirects from any old WordPress URLs that get traffic, e.g. `Redirect 301 /about-us/ /`.
3. **Google Search Console**: verify the domain, submit `sitemap.xml`, and request indexing for the homepage.
4. **Bing Webmaster Tools**: verify (you can import from Google Search Console) and submit `sitemap.xml`. Bing's index powers ChatGPT search and Microsoft Copilot.
5. **IndexNow**: after launch and after every content change, ping:
   `https://api.indexnow.org/indexnow?url=https://sdfastnotary.com/&key=5fc4be2a970d3186a2c68e1b493f0d57`
6. Test with the Google Rich Results Test (FAQ, LocalBusiness, Breadcrumb), securityheaders.com, and pagespeed.web.dev.

## Off-site (owner), the biggest ranking factors for local and AI search
1. **Google Business Profile**: name, address, and phone must exactly match the site. Category "Notary public"; add services, hours, photos, and the website + Calendly link.
2. **Reviews**: ask every happy client for a Google review. Reviews are the #1 local ranking factor and what AI assistants cite when recommending a business.
3. **Bing Places** and **Apple Business Connect** (Siri / Apple Maps). Bing Places can import from Google.
4. **Directories** with identical name, address, and phone: Yelp, Nextdoor, BBB, 123notary, NotaryRotary, Facebook page.
5. Once profiles exist, add their URLs to `"sameAs": [...]` in the homepage JSON-LD. This ties the business together for Google and AI.
6. Optionally add your notary's name and commission expiry to the homepage for extra trust (E-E-A-T).

## Editing
Hours (7 days, 7 AM–10 PM) appear in each page footer and in the `openingHoursSpecification` on `index.html`. Update the "Last updated" dates and `sitemap.xml` `lastmod` when content changes.
