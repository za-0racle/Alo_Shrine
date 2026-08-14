# Khaleed Adedokun — Personal Brand & Business Website

A lightweight multi-page website connecting Khaleed's work in technology, data, education and entrepreneurship with Oracle TEK Global Solutions.

## Stack and setup

Vite, semantic HTML5, CSS3 and vanilla JavaScript ES modules. No frontend framework is used.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Editing content

All maintainable content lives in `src/data/`: profile, experience, education, certifications, skills, projects, services, social links and contact information. Shared UI lives in `src/js/components.js`; global interactions and themes live in `src/js/main.js`; styling is in `src/css/`.

Add verified assets to `public/images/profile/`, `public/images/projects/`, `public/images/certifications/`, `public/images/business/` and `public/images/education/`. The expected profile filename is `profile.jpg`. Add the verified CV at `public/documents/khaleed-adedokun-cv.pdf`, then enable a CV link.

To add a project, append an object to `src/data/projects.js` using an existing filter category. Add live or GitHub URLs only after verifying them. Update `src/data/social-links.js` and `src/data/contact.js` only with public details.

## Contact and deployment

The contact form validates locally but intentionally does not send until a backend or form provider is connected. Never place private API keys in frontend code.

Run `npm run build` and deploy `dist/` to any static host. Replace `YOUR_DOMAIN_HERE` in canonical tags, `public/robots.txt` and `public/sitemap.xml` with the verified production domain.
