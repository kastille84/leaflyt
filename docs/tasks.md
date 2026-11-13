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
- [x] 2i. `src/ui/Form/` B, complex inputs — `Address`, `Attestation`, `BorderRadius`, `Category`, `Subcategory`, `Color`, `FlaggedReason`, `FlyerDesigner`, `Lifespan`, `PlaceSearch`, `Plan`, `RadioGroup`, `Select`, `Tags`, `TypeOfUser`, `Image*` (4 files). Note: selects wired with a fixed `value=""` prop are controlled, so tests feed `value` from `watch()` to let `selectOptions` stick. `ColorInput` tests stub `ColorPicker`, because the real one only fires `onChangeComplete` on pointer release. `ImagePreviewItemTimed` tests tick one second per `act`, since React batches updates inside a single `act` and the interval closure would go stale.
- [x] 2j. `src/ui/Modals/` — the 11 modals without tests (all except `CloseSlideInModal`). Note: `vi.clearAllMocks()` keeps `mockImplementation`, so tests that expect a spinner to stay visible call `mockReset()` on the mutation fn first (an earlier `onSuccess`/`onError` implementation would otherwise hide it).
- [x] 2k. `src/ui/Flyer/` — `CreateFlyerButton`, `FlyerBlock*` (4), `FlyerFormContainer`, `FlyerSlideIn`, `FullCarouselContainer`. Note: sub-components (`Info`, `Contact`, `CTA`, `ImageCarousel`) are mocked here and covered in 2l. `FlyerBlockInteractive` throws if `user.saved_flyers` is undefined, so test users need `saved_flyers: []`. `FlyerSlideIn` line 51 (branch) is the unreachable `drawerAction` switch fall-through.
- [x] 2l. `src/ui/Flyer/SubComponents/`, `ui/Plan/`, `ui/Statistics/` — `CommentsSection`, `Contact`, `CTA`, `ImageCarousel`, `Info`, `PlanItem`, `PlansInputContainer`, `DoughnutStat`, `NumberStat`. Note: `ImageCarousel` finds its fullscreen button with `document.querySelector`, so its tests call `cleanup` after each test and wait out the slide transition between clicks. Uncovered: line 174 (image `description` span, no caller sets one) and the `onImageLoad` handler (211-215). `ImageCarousel` throws on mount if there are no images (`defineGalleryItems[0].isVideo`), so that case is not tested. Contact tests don't cover the `user` prop's address: `getContactInfoFromUser` sets `contactInfo.addres` (typo), so the address never shows for that path.
- [x] 2m. `src/features/` gaps — `map/MarkerWithInfoWindow`, `map/MyRectangle`, `createFlyer/CreateFlyer`, `createFlyer/useCreateUnregisteredFlyer`, `saved_flyers`, `single_flyer`, `statistics/usage`, `template/*` (4 files; check existing `tests/features/template` first). Note: the other 3 template files already had tests, so only `template/TemplateList` and `template/myTemplates/TemplateList` were added. `MarkerWithInfoWindow` tests use `fireEvent.click` on "Go to Board", because a real click first blurs the marker and the container's `onBlur` closes the info window. `MyRectangle` tests stub `google.maps.Rectangle` and mock `useMap`. Existing failures not from this chunk: `template/TemplateDisplay.test.tsx` ("should render with template", `FlyerBlockStatic` line 349 reads `[0]` of undefined) and `template/WhichTemplate.test.tsx` ("should create a template", `onSuccess` destructures `user` from undefined, line 150).
- [x] 2n. `src/pages/` and `src/partials/` — `AppLayout`, `Faq`, `Home`, `MyAccount`, `MyArea`, `MyAssets`, `MyTemplates`, `Pricing`, `SavedFlyers`, `Statistics`, `CommunityGuidelines`, `PrivacyPolicy`, `TermsOfUse` (`Landing`, `MainLayout` already tested). Note: feature children and hooks are mocked, and `useGlobalContext` is set with `vi.mocked(GlobalContext.useGlobalContext)` because `vi.spyOn` on the module throws "Cannot redefine property". `Home` mocks `react-hot-toast` with both a named and a default export, since other modules import the default. Existing failures not from this chunk: `pages/Landing.test.tsx` (all 4 tests) and `pages/MainLayout.test.tsx` ("should render MainLayout", the mock action menu is not found).
- [x] 2o. Final client pass — run `npm run coverage`, list files still under 90%, add follow-up tasks for them. Result (2026-11-12): 150 of 166 test files pass (907 of 963 tests); overall statements 67.87%, branches 91.28%, functions 88.08%. Follow-ups are 2o-1 to 2o-6 below. Note: `vitest run --coverage` writes no report when any test fails, so use `npx vitest run --coverage --coverage.reportOnFailure=true`. Note: coverage also counts `client/dist/` (built output) and `src/service-worker.ts` as 0%, so exclude both in `vitest.config`/`vite.config.ts` (see 2o-6).
- [x] 2o-1. Fix the 16 failing test files before adding more tests, since coverage on their sources is low because the tests crash. Result (2026-11-12): all 166 test files pass (995 tests). Causes were stale tests, not source bugs: components now render `Link`/`useLocation`/`useStripe`, so tests need the Router/`QueryClientProvider` wrappers (`SignupForm`, `Anonymous`, `NoFlyers`, `PaymentFormContainer`, `PickPlanForm`, `ResetPassword`, `NewAssetContainer`); `mockUseGlobalContextReturnObj` lacked `setShowBoardWelcomeModal`/`showBoardWelcomeModal`; `onSuccess` callbacks destructure `{ user }`, so tests must pass it (`WhichTemplate`, `Registered`); phone is now optional and terms are required in `SignupForm`; the template checkbox in `Registered` is unchecked by default and the fixture user is already at their template limit, so tests use `userWithTemplateRoom`; `useGetUserGeo` toast messages now contain `
`; templates from the API have `user` joined in, so `TemplateDisplay` uses `templateWithUser` (the fixture's `user: 3` is stale). `PaymentForm.test.tsx` was empty and is now a real test (7 tests); `Landing` and `MainLayout` tests were rewritten for the current pages, and `Landing` got a `data-testid="get-geo-button-section"`. `PaymentBillingInfoForm` mocks `AddressInput` and its submit tests were rewritten to the real flow (delete Stripe customer, then create).
- [x] 2o-2. `features/authentication/` — `PaymentForm` (16%), `PickPlanForm` (45%), `PaymentFormContainer` (48%), `useSignup` (64%), `PaymentBillingInfoForm` (67%), `ResetPassword` (71%), `SignupForm` (79%), plus branch gaps in `ResetPasswordContainer`/`SignupFormContainer`/`WhyRegister`/`WhyUpgrade`. Depends on 2o-1. Result (2026-11-12): every file in `features/authentication/` is now above 90% statements/branches (was 16-79%). Added tests for `useSignup`, `useLoginWithAccessToken`, `PaymentFormContainer`, `PickPlanForm`, `ResetPassword`, `SignupContainer`, `UnpaidPlanContainer`, `WhyRegister`/`WhyUpgrade`, and the cancel/legal links in `SignupForm`. Note: the task named `ResetPasswordContainer`/`SignupFormContainer`, which don't exist; the real files are `SignupContainer`/`UnpaidPlanContainer`. Note: in `PickPlanForm` the signup "Continue to Pay" button condition `!(!isUpgrade || !isAnyPaidPlan)` is only true when `isUpgrade && isAnyPaidPlan`, so a paid-plan signup has no submit button; tests submit the form directly. Possible source bug, not changed.
- [x] 2o-3. `features/createFlyer/` and `features/board/` — `Anonymous` (49%), `Registered` (80%), `Board` (70%), `NoFlyers` (58%), `MapContainer` (76%, branches 36%). Depends on 2o-1. Result (2026-11-12): `Board`, `NoFlyers`, `MapContainer` 100%; `Anonymous` 99% lines / 92% branches; `Registered` 100% lines / 95% branches. Added Board tests (filters, list view, limit warning, QR scan logging, owner alert), `NoFlyers` limit/unmount/welcome-modal tests, Anonymous cancel and legal-link tests, Registered edit-flow tests with a selected place and the repeat-error path. `MapContainer` is tested in `tests/features/map/MapContainerBehavior.test.tsx` with `@vis.gl/react-google-maps`, `MyRectangle`, `MarkerWithInfoWindow` and `PlaceSearchInput` mocked, because the existing `MapContainer.test.tsx` loads the real Google Maps API and only checks typing. Note: `NoFlyers.tsx` has a stray `import { use } from "chai"` (unused, not changed). Note: `Anonymous` lines 187-189 (the "Error: ..." header shown after a failed submit) are still uncovered; its two failure tests only assert that `toast.error` ran.
- [x] 2o-4. `features/assets/` — `NewAssetContainer` (63%), `SelectedAssetsList/…ItemTimed` (73%), `ExistingAssetsList` + list item (83-89%, branches 63-75%), assets mutations hook (functions 25%), `AssetSelectionContainer` branches (lines 137, 147). Result (2026-11-12): every file in `features/assets/` is at 100% except `SelectedAssetsListItemTimed` (98.7% lines, branches 100%). Rewrote `useAssetMutations.test.tsx` against a real `QueryClientProvider` (the old test mocked `useMutation`, so the `mutationFn`s never ran). Added `NewAssetContainerSaveOnUpload.test.tsx` for the `saveOnUpload` path, fake-timer countdown tests for `SelectedAssetsListItemTimed`, `onlySafeToDelete`/pre-check tests for `ExistingAssetsList`, preview/selection/safe-delete tests for the item, and limit tests for `AssetSelectionContainer`. Note: `SelectedAssetsListItemTimed` filters the timed list with `prev.filter((asset) => asset.public_id !== asset.public_id)`, where the inner `asset` shadows the prop, so the predicate is always false and the whole list is emptied. Possible source bug, not changed.
- [x] 2o-5. `pages/Landing` (73%, branches 21%), `pages/MainLayout` (71%), `utils/GeneralUtils` (86%, lines 89 and 119-143), `FlyerDesigner/Display` and its list item (branches 33-66%), and branch/function gaps in `ui/Modals` (`WelcomeModal`, `CloseSlideInModal`, `DcmaModal`, `DisclaimerModal`, `TermsModal`; all lines are covered, only branches under 90%), `WhichTemplate`, `apiQrAnalytics`. Result (2026-11-12): `Landing` 100%, `MainLayout` 100%, `FlyerDesigner/Display` 100%, `WhichTemplate` 100%, the five modals' width branches covered via `ModalResponsiveWidth.test.tsx`, `CloseSlideInModal` flyer/template/user branches covered. `GeneralUtils` stays at 86% statements: lines 119-143 are the production branch of `keysBasedOnEnv`, untestable because Vite `define` inlines `import.meta.env.MODE` (same limit as 2a). Remaining sub-90% branch figures on modals and `apiQrAnalytics` point at import lines (2-4), not real branches.
- [x] 2o-6. Exclude `dist/` and `src/service-worker.ts` (and `global.d.ts`) from coverage, then re-run the final pass to confirm the 90% threshold is met. Result (2026-11-12): added `dist/**`, `**/service-worker.ts` and `**/global.d.ts` to `coverage.exclude` in `client/vite.config.ts`. Final run: 169 test files and 1135 tests pass; overall 99.55% statements, 97.21% branches, 98.07% functions, 99.55% lines, so the 90% threshold is met.

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
