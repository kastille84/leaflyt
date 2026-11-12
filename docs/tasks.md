# Leaflit — Task Checklist

Living checklist for planned work and for changes requested by the user. Check it when asked "what's next?", and update it as work starts and finishes.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` deferred/blocked

Conventions:
- Group tasks under a phase or topic heading with a one-line `status`.
- Give each task a short id (`1a`, `1b`, ...) and keep the wording specific enough to act on (name the file or feature).
- When the user requests a new change, add it under the right heading (or a new one) before starting work.
- Move finished items to `[x]` instead of deleting them. Add a note for anything deferred or blocked and say why.

---

## Phase 1 — Project documentation · status: in progress

Populate `/docs` with `.md` files that describe how each part of the app currently works, so future work follows existing patterns.

- [x] 1a. `PRD.md` — product requirements
- [x] 1b. `tasks.md` — this checklist
- [x] 1c. `auth.md` — how authentication works
- [x] 1d. `error-handling.md` — how errors are handled (client and server)
- [x] 1e. `responsiveness.md` — how CSS responsiveness is done
- [x] 1f. `ui-inputs.md` — how form inputs are built
- [x] 1g. `ui-styling.md` — how CSS styling is done
- [x] 1h. `coding-style.md` — React & TypeScript coding standards
- [ ] 1i. Review the docs with the product owner and correct anything that is wrong or out of date
- [ ] 1j. Further docs as needed (candidates: `state-management.md`, `data-fetching.md`, `payments.md`, `testing.md`, `modals-and-slide-ins.md`, `deployment.md`)

## Phase 2 — Unit-test coverage (client + server) · status: not started

Raise unit-test coverage to the 90% threshold (see `docs/coding-style.md` → Testing). Work one chunk per session; chunks are independent and ordered by value/ease (pure logic first).

How to work a chunk:
1. Run `npm run coverage` (in `client/`) and skip files already above the threshold.
2. Add `client/tests/<mirror of src path>/<Name>.test.tsx` per source file. Reuse `tests/test-utils.tsx` and `tests/fixtures/`.
3. Run `npx vitest run <file>`, then `npm run coverage` to confirm, then `npm run lint` and `npx tsc --noEmit`.
4. Mark the chunk `[x]`. Do not add `v8 ignore` to dodge coverage unless the code can't run in a browser test.

### Client (`client/src/`)

- [x] 2a. `src/utils/` — `FlyerUtils.tsx`, `ServiceUtils.tsx` (`GeneralUtils` already tested; extend if gaps). Note: `getBaseUrl`'s production/development branches are untestable because Vite `define` inlines `process.env.NODE_ENV`.
- [x] 2b. `src/hooks/` storage and UI — `useLocalStorageState`, `useSessionStorageState`, `useResponsiveWidth`, `usePWAInstallation`
- [x] 2c. `src/hooks/` data — `useGetPlans`, `useGetUserLimits`, `useGetUserProfileById`, `useGetPlaceByPlaceId`, `useLikeFlyers`, `useStripe`
- [x] 2d. `src/services/` A — `apiFlyers`, `apiBoards`, `apiAssets`
- [x] 2e. `src/services/` B — `apiAuth`, `apiUser`, `apiPlans`, `apiStripe`, `apiQrAnalytics`, `cloudinary`, `googleMaps`, `supabase`
- [x] 2f. `src/ui/` basics — `Button`, `Checkbox`, `Input`, `Select`, `Heading`, `Spinner`, `OverlaySpinner`, `InfoAlert`, `StepSection`, `UpgradeText`, `LimitExceededWarning`
- [x] 2g. `src/ui/` navigation/layout — `ActionMenu`, `ActionMenuMobile`, `DropdownMenu`, `MainNav`, `LandingNav`, `LandingItem`, `Sidebar`, `Footer`, `FaqItem`, `PWABanner`, `SlideIn/SlideInBottom`
- [x] 2h. `src/ui/Form/` A, simple inputs — `Form`, `FormControl`, `FormControlRow`, `FormInfoAlert`, `FieldInputError`, and the text inputs (`Email`, `Password`, `Phone`, `Website`, `FirstName`, `LastName`, `FullName`, `Title`, `Templatename`, `Content`, `Cta`, `Comments`) Note: `CtaInput` lines 105-106 (headline `validate` fallback) are unreachable because `required` fires first.
- [ ] 2i. `src/ui/Form/` B, complex inputs — `Address`, `Attestation`, `BorderRadius`, `Category`, `Subcategory`, `Color`, `FlaggedReason`, `FlyerDesigner`, `Lifespan`, `PlaceSearch`, `Plan`, `RadioGroup`, `Select`, `Tags`, `TypeOfUser`, `Image*` (4 files)
- [ ] 2j. `src/ui/Modals/` — the 11 modals without tests (all except `CloseSlideInModal`)
- [ ] 2k. `src/ui/Flyer/` — `CreateFlyerButton`, `FlyerBlock*` (4), `FlyerFormContainer`, `FlyerSlideIn`, `FullCarouselContainer`
- [ ] 2l. `src/ui/Flyer/SubComponents/`, `ui/Plan/`, `ui/Statistics/` — `CommentsSection`, `Contact`, `CTA`, `ImageCarousel`, `Info`, `PlanItem`, `PlansInputContainer`, `DoughnutStat`, `NumberStat`
- [ ] 2m. `src/features/` gaps — `map/MarkerWithInfoWindow`, `map/MyRectangle`, `createFlyer/CreateFlyer`, `createFlyer/useCreateUnregisteredFlyer`, `saved_flyers`, `single_flyer`, `statistics/usage`, `template/*` (4 files; check existing `tests/features/template` first)
- [ ] 2n. `src/pages/` and `src/partials/` — `AppLayout`, `Faq`, `Home`, `MyAccount`, `MyArea`, `MyAssets`, `MyTemplates`, `Pricing`, `SavedFlyers`, `Statistics`, `CommunityGuidelines`, `PrivacyPolicy`, `TermsOfUse` (`Landing`, `MainLayout` already tested)
- [ ] 2o. Final client pass — run `npm run coverage`, list files still under 90%, add follow-up tasks for them

### Server (root Express API)

The backend has no test tooling yet (`npm test` is a stub; no jest/vitest/supertest). Covers backlog `B3`.

- [ ] 2p. Set up backend testing — add Vitest + `supertest` as root devDependencies, a node-environment config, `server/tests/` mirroring `server/`, a shared mock helper for Supabase/Stripe/Cloudinary/Mailgun/OpenAI, and replace the stub `npm test`. If supertest needs `app` exported separately from `listen()` in `server.js`, confirm with the product owner first and keep the webhook-before-`bodyParser.json()` order.
- [ ] 2q. `server/utility/` — `error.js`, `generalUtils.js`
- [ ] 2r. `server/middlewares/validators/auth.js` and `server/routes/*` wiring (supertest, controllers mocked)
- [ ] 2s. `server/controllers/auth.js` and `controllers/emails.js` (+ root `mailgun.js`)
- [ ] 2t. `server/controllers/assets.js` and `controllers/flyers.js` (+ root `cloudinary.js`, `supabase.js`)
- [ ] 2u. `server/controllers/moderate.js` (+ root `moderate.js`)
- [ ] 2v. `server/controllers/stripe.js`, the `/webhook` handler and root `stripe.js` (raw-body signature handling)
- [ ] 2w. `server.js` — error middleware (`{ error }` + `statusCode`), CORS by `NODE_ENV`, SPA fallback, cron jobs (mock `node-cron`)

## Backlog — known gaps from the PRD

- [ ] B1. Views and interactions analytics (`client/src/features/statistics/analytics` is empty)
- [ ] B2. Decide whether to enable the unregistered/expired flyer cleanup cron jobs in `server.js`
- [ ] B3. Add a backend test suite (`npm test` is a stub) — tracked in Phase 2, tasks 2p–2w
- [ ] B4. Fix `.github/copilot-instructions.md` (references a non-existent `npm run start`)
- [ ] B5. Wire up server-side validators on `/api/auth` (`signup` validators are commented out, `login` is an empty stub)
