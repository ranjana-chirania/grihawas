# Grihawas website

Responsive static website for Grihawas Aawas Yojna, Govind Puram Extension, NH-24, Ghaziabad.

## Run locally

Serve this directory with any static web server and open `index.html`. For example, with Node installed:

```powershell
npx serve .
```

The frontend is a static website, while the application form uses a Node.js/Express backend with MongoDB Atlas.

## Structure

- `index.html` — landing page
- `about.html`, `project.html`, `price-list.html`, `floor-plans.html`, `amenities.html`, `location.html`, `gallery.html`, `contact.html`, `apply-now.html`, `results.html` — project pages
- `assets/css/style.css` — shared responsive design system
- `assets/js/config.js` — shared public contact and project information
- `assets/js/components.js` — shared header, footer and floating actions
- `assets/js/main.js` — navigation, forms, tabs, gallery and lightbox interactions
- `assets/images/` and `gallery/` — local project imagery

## Forms and application status

The Apply Now form includes frontend validation and submits application details to the Node.js/Express backend.

Application data is stored securely in MongoDB Atlas.

The application form collects:

- Full Name
- Phone Number
- Email
- Property
- Visit Date
- Configuration
- Budget
- Message

The backend API endpoint is:

`POST /api/apply`

Sensitive database credentials are stored in `.env` and are excluded from GitHub using `.gitignore`.

Never add API keys, database credentials or other secrets to frontend files.

## Admin Login and Dashboard

The website includes a secure admin login and dashboard for managing submitted applications.

Admin features include:

- Admin login with email and password
- JWT-based authentication
- Protected applications API
- View all registered applicants
- View applicant name, phone and email
- View property, visit date, configuration and budget
- View application submission date
- Admin logout

Admin API endpoints:

`POST /api/admin/login`

`GET /api/admin/applications`

Admin credentials are stored securely in `.env` and are not committed to GitHub.

## Content maintenance

Public project facts and contact details are centralized in `assets/js/config.js`. Confirm changing prices, availability, approvals, eligibility and timelines against current official records before publishing updates.

The `assets/documents/` directory contains legacy, unpublished document files retained for review. No page links to them. Publish only verified official documents.

## Backend

The backend is built with Node.js and Express.js.

The backend server runs locally on:

`http://localhost:5000`

MongoDB Atlas is used to store application and admin account data.

Required environment variables:

- `MONGO_URI`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

The `.env` file is excluded from GitHub using `.gitignore`.

## Deployment

Upload the project directory to a static host, preserve the current folder structure, enable HTTPS and submit `sitemap.xml` in the relevant search-console account. Canonical URLs currently use `https://grihawas.com/`.
