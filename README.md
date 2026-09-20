# Grihawas website

Responsive static website for Grihawas Aawas Yojna, Govind Puram Extension, NH-24, Ghaziabad.

## Run locally

Serve this directory with any static web server and open `index.html`. For example, with Node installed:

```powershell
npx serve .
```

The site has no build step or runtime package dependency.

## Structure

- `index.html` — landing page
- `about.html`, `project.html`, `price-list.html`, `floor-plans.html`, `amenities.html`, `location.html`, `gallery.html`, `contact.html`, `apply-now.html`, `results.html` — project pages
- `assets/css/style.css` — shared responsive design system
- `assets/js/config.js` — shared public contact and project information
- `assets/js/components.js` — shared header, footer and floating actions
- `assets/js/main.js` — navigation, forms, tabs, gallery and lightbox interactions
- `assets/images/` and `gallery/` — local project imagery

## Forms and application status

Frontend validation is active. No CRM or customer-record backend is included in this static project. Until `FORM_ENDPOINT` is connected in `assets/js/config.js`, forms accurately direct visitors to the published phone number and email instead of reporting a false submission. The Results page likewise directs applicants to the project team for a verified status update.

Never add API keys or CRM secrets to frontend files.

## Content maintenance

Public project facts and contact details are centralized in `assets/js/config.js`. Confirm changing prices, availability, approvals, eligibility and timelines against current official records before publishing updates.

The `assets/documents/` directory contains legacy, unpublished document files retained for review. No page links to them. Publish only verified official documents.

## Deployment

Upload the project directory to a static host, preserve the current folder structure, enable HTTPS and submit `sitemap.xml` in the relevant search-console account. Canonical URLs currently use `https://grihawas.com/`.
