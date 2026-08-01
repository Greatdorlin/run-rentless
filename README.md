# Run Rentless marketing site

Production marketing site for Run Rentless, built with Next.js App Router, TypeScript, and CSS. The project is deliberately separate from Leads Desk, Product Hub, and Create Great Events.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Structure

- `src/app` contains routes, route-level metadata, and page composition.
- `src/components/home` contains one focused component per homepage section.
- `src/components/site` contains shared navigation, logo, and footer components.
- `src/content/site.ts` contains editable marketing copy and repeated structured content.
- `public/brand` contains the two supplied source JPEGs plus non-destructive derived PNG assets.

### Future blog path

Add `src/app/blog/page.tsx` for the index and `src/app/blog/[slug]/page.tsx` for articles. Put blog-specific components in `src/components/blog` and content adapters in `src/lib/blog`. Content can begin as typed MDX or local files and later switch to a CMS without changing the homepage sections. Each article can add `generateMetadata`, a route-level `opengraph-image.tsx`, and structured data.

## Waitlist submission status

No CRM, email, or database endpoint was supplied. The form therefore validates in the browser and saves a draft only to `localStorage` under `run-rentless-waitlist-draft`. Its success state and privacy copy explicitly say that nothing has been transmitted. Replace `handleSubmit` in `src/components/home/waitlist-form.tsx` with an authenticated server action or route handler before treating entries as received.

## Deployment

Production is connected to the GitHub `master` branch through Vercel Git integration. Pushes to `master` are intended to trigger production deployments automatically.
