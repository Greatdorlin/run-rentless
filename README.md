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
- `src/components/audit` contains the audit journey and the isolated, reduced-motion-aware example counter.
- `src/lib/audit.ts` owns currency-separated costs, seat-growth scenarios and conservative recommendation rules. `src/lib/audit-report.ts` validates submitted tools and builds the email/download report from the same calculations.
- `src/content/site.ts` contains editable marketing copy and repeated structured content.
- `public/brand` contains the two supplied source JPEGs plus non-destructive derived PNG assets.

### Future blog path

Add `src/app/blog/page.tsx` for the index and `src/app/blog/[slug]/page.tsx` for articles. Put blog-specific components in `src/components/blog` and content adapters in `src/lib/blog`. Content can begin as typed MDX or local files and later switch to a CMS without changing the homepage sections. Each article can add `generateMetadata`, a route-level `opengraph-image.tsx`, and structured data.

## Waitlist submission status

The waitlist posts to `src/app/api/waitlist/route.ts`, which validates required fields and consent, rejects cross-origin requests, includes a honeypot, and creates or updates the subscriber in Sender. The subscriber is added to the `Run Rentless Waitlist` group, while company, interest, team size, current software, consent, and submission time are recorded as a `run_rentless_waitlist_submission` event on that subscriber.

Set `SENDER_API` as a server-only environment variable in Vercel Production and Preview. Never expose it through a `NEXT_PUBLIC_` variable or commit it to the repository. Local submissions return a clear unavailable response when the variable is absent.

Audit submissions use the same endpoint. Contact details are requested only after results. A required report permission and a separate optional marketing permission are recorded. Audit leads go into `Run Rentless Software Audits`; investment range (USD), preferred engagement, audit summary and priority are custom profile fields. The `run_rentless_audit_submission` event preserves the full cost inputs, categories, answers, results, qualification and permissions. Market only to contacts with the recorded permission, not to every member of the audit group.

The endpoint reads the subscriber back to verify profile persistence, then submits an HTML and plain-text report to Sender's `/v2/message/send`. `SENDER_FROM_EMAIL` can override the default `info@runrentless.com`; the sending domain/account must be approved by Sender. HTTP 202 means the lead was saved but email delivery was unavailable. The UI must not claim an email was sent in that state and offers a full text download. There is no background email retry queue. HTTP 200 with `reportSent: true` means Sender accepted the email, not that the recipient opened it.

The illustrative homepage counter starts at USD 300. It does not feed into any audit totals. Unknown or incomplete costs are excluded, currencies are not converted, and headcount scenarios keep fixed charges constant. Recommendations are preliminary rule-based signals, not savings estimates or manually approved replacement decisions.

## Deployment

Production is connected to the GitHub `master` branch through Vercel Git integration. Pushes to `master` are intended to trigger production deployments automatically.
