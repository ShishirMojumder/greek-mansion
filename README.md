# Greek Mansion

A premium, responsive restaurant website for Greek Mansion in Scarborough, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content structure

Menu content is centralized in `data/menu.ts`, ready to replace with Sanity queries later. Shared UI lives in `components/`, while route-level metadata and content live in `app/`.

## Production notes

- Replace the order-online search links with the restaurant's direct ordering URL.
- Confirm operating hours and replace the temporary hours copy on the contact page.
- Connect the catering form to an email/form service before launch.
- Update `metadataBase` if the production domain differs from `greekmansion.ca`.
