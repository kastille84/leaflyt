# Leaflit — Product Requirements Document

| | |
|---|---|
| **Product** | Leaflit (repo: `leaflyt`) |
| **Website** | https://www.leaflit.us |
| **Status** | Living document, reflects the product as built plus known roadmap items |
| **Last updated** | 2026-11-12 |

> Items marked **[Roadmap]** are announced or stubbed in the code but not fully shipped. Items marked **[Open]** are questions to resolve with the product owner.
>
> Naming: the product and brand are **Leaflit**. The repository and root npm package are named `leaflyt`.

---

## 1. Overview

Leaflit is a virtual flyer distribution platform. Instead of printing flyers and pinning them to physical bulletin boards, users design a flyer once and post it to a **virtual community board** tied to a real-world establishment (café, library, gym, shop, etc.). People at or near that location browse the board on their phone and interact with flyers.

Leaflit ships as a Progressive Web App (PWA) so it works as an installable, mobile-first experience. The live product is at **https://www.leaflit.us**, where the landing page, pricing, FAQ and the app itself are served.

## 2. Problem Statement

- Physical flyers cost money to print, take time to distribute, are often removed or ignored, and produce no feedback.
- Individuals, community groups and small businesses have no cheap way to reach a hyper-local audience.
- Location owners have no simple way to curate or moderate community postings.

## 3. Goals and Non-Goals

### Goals
1. Let anyone create and post a flyer to a location-based board in minutes, with or without an account.
2. Reach people in a specific place, whether the poster is on site or remote.
3. Give registered users tools that save time (templates, saved assets, remote posting, longer lifespans) and show results (analytics).
4. Fund the product through tiered subscription plans.
5. Keep boards safe through automated and manual moderation.

### Non-Goals
- Printing or shipping physical flyers.
- General-purpose social networking (feeds, followers, direct messaging).
- Ad-network or programmatic advertising features.
- Native iOS/Android apps (the PWA covers mobile).

## 4. Target Users

| Persona | Needs | Example |
|---|---|---|
| **Individual / neighbor** | Quick, free, one-off posts | Garage sale, lost pet, roommate wanted |
| **Community group / organizer** | Recurring event promotion, multiple locations | Church event, school fundraiser, meetup |
| **Small business** | Promote offers to nearby foot traffic, measure results | Restaurant special, salon opening |
| **Anonymous visitor** | Post without signing up | Someone standing at a venue who wants to post now |
| **Board viewer** | Browse what's happening around them | Anyone at a location or exploring an area |

Registered accounts are one of three types, chosen at sign-up and stored on the profile (`typeOfUser`): **individual**, **business** or **organization**. The type drives which contact details a flyer shows and which welcome email is sent.

## 5. User Tiers

Plans are stored in the Supabase `plans` table and loaded dynamically (`useGetPlans`), then sorted by level. Upload and lifespan limits per level are also defined on the client in `client/src/constants/index.ts` (`FILE_UPLOAD_OPTIONS`, `LIFESPAN`). Sign-up always starts a user on level 1 (the free plan).

| Level | Plan | Account | Media per flyer | Max file size | Lifespan options |
|---|---|---|---|---|---|
| 0 | **Anonymous** | None | 1 | 10 MB | 1 week |
| 1 | **Seed** (free) | Yes | 2 | 20 MB | 1 week |
| 2 | **Garden** (paid) | Yes + Stripe | 4 | 50 MB | 1-2 weeks |
| 3 | **Grove** (paid, shown as "Recommended") | Yes + Stripe | 6 | 75 MB | 1-2 weeks |
| 4 | **Forest** (paid) | Yes + Stripe | 10 | 100 MB | 1-4 weeks |

Notes:
- **Only level 4 reaches 4 weeks.** Levels 2 and 3 are capped at 2 weeks. The in-app FAQ currently says "up to 4 weeks" for any premium plan, which overstates levels 2 and 3.
- **Media types:** levels 0-1 accept images only (jpg, jpeg, png, gif, webp). Levels 2-4 accept images and video, with no format restriction in the upload widget. The Pricing UI labels level 2 as "Images only" even though its upload widget also accepts video.
- **Features that vary per plan** (all columns in `plans`): number of templates (`templateLimit`), on-location flyer limit, remote flyer limit, virtual posting distance, bulk posting, analytics (`lite` or `full`), saved asset limit (`maxAssets`), and flyer lifespan.
- **Gated in the client** (`hooks/useGetUserLimits.tsx`): registered = level 1+, paid = level 2+. Custom flyer design and the interactive map are paid features (level 2+). Upgrades are offered below level 4.
- **Anonymous defaults:** 1 media, up to 10 on-location flyers, no remote posting, no templates.
- The "Why upgrade" prompt sells: more templates, more posting from home, a larger posting distance, more image/video uploads, bulk posting and longer flyer lifespan.

### Plan data (from `plans_rows.sql`, repo root)

Snapshot of the `plans` table rows. The database is the source of truth; if prices or limits change there, update this table.

| | **Seed** (L1) | **Garden** (L2) | **Grove** (L3) | **Forest** (L4) |
|---|---|---|---|---|
| **Price** | 0 (free) | 7 | 12 | 18 |
| **Tagline** | "Get to know Leaflyt and post flyers with our generous free plan" | "For Enthusiasts who have something to say or sell" | "For Businesses and Orgs who want greater visibility" | "For those who want to leave a lasting mark beyond their community" |
| **Price tagline** | "Post Flyers For Free!" | "Less Than a Ream of Paper" | "Less Than an Ink Cartridge" | "Save Time & Gas Spent Posting" |
| **Max flyer lifespan** | 1 week | 2 weeks | 2 weeks | 4 weeks |
| **Media per flyer** | 2 | 4 | 6 | 10 |
| **On-location flyers** | 10 | 20 | 40 | 80 |
| **Remote flyers** | 4 | 10 | 20 | 40 |
| **Max flyers at any moment** (on-location + remote) | 14 | 30 | 60 | 120 |
| **Templates** | 1 | 2 | 4 | 8 |
| **Saved assets** | 4 | 10 | 20 | 30 |
| **Virtual posting distance** (stored value → miles shown in the UI) | 0.05 → ~3.1 mi | 0.05 → ~3.1 mi | 0.1 → ~6.2 mi | 0.25 → ~15.5 mi |
| **Bulk posting** | No | No | Yes | Yes |
| **Analytics** | None | Lite | Full | Full |
| **Stripe product ID** | none | redacted | redacted | redacted |

Notes:
- The distance in miles is how `PlanItem.tsx` displays the stored value (`value × 100 × 0.621371`); the stored value is not itself a unit of miles.
- Anonymous users are not in the table. They use a client-side default (see above).
- Bulk posting is only a plan flag today; the feature itself is stubbed **[Roadmap]**. Analytics tiers are also ahead of the product: only likes and QR scans exist (see 6.5).
- The seed tagline spells the product "Leaflyt"; the brand is Leaflit.

**[Open]** The file stores `price` as a bare number. Confirm the currency and billing period (presumably USD per month) against the Stripe products before using this in sales material.

## 5.1 Core User Flows

1. **Anonymous post:** open a board → "Create flyer" → design with template builder → upload one image → submit → flyer appears on the board.
2. **Register and subscribe:** sign up (choose individual, business or organization) → pick a plan → (paid) enter billing/payment details via Stripe → land in the app.
3. **Registered post:** create flyer → choose template or start blank → select/upload assets → pick one or more target boards → set lifespan → publish.
4. **Remote posting:** choose a location from the map or location search without being physically present.
5. **Browse a board:** open a location's board → filter by category/subcategory → open a single flyer → like / comment / save.
6. **Manage:** view saved flyers, my templates, my assets, account info, plan, billing and usage.
7. **QR entry:** a physical QR code at an establishment opens that location's board; the scan is logged (see 6.5).

A flyer's **posting method** is one of `onLocation`, `remote` or `remoteBulk`, set from a URL parameter. Bulk posting (`remoteBulk`) is stubbed and not yet fully built **[Roadmap]**.

## 6. Functional Requirements

### 6.1 Authentication and Accounts
- Email/password sign-up and login, forgot/reset password (Supabase Auth).
- Automatic login from an existing Supabase session when the app loads (`useLoginWithAccessToken`). This is not an email-link token flow.
- Account info viewing and editing.
- Plan selection at sign-up, plus upgrade/downgrade/change-plan and cancel-subscription flows, and account deletion.
- Handling for users who registered but have not completed payment (an `unpaid` subscription state opens an "unpaid plan" prompt).
- Profile badges **power user** and **pioneer** are stored on the profile and shown as icons on flyers.

### 6.2 Flyer Creation
- **Flyer designer** with a configuration panel and live display preview.
- **Templates:** pick from template list; registered users can save and reuse their own ("My Templates"). Count is limited per plan.
- **Assets:** upload via the Cloudinary widget (local, URL, camera, image search, Unsplash, Google Drive, Shutterstock), with cropping. Format and media-type limits depend on level (see section 5). Registered users keep a reusable asset library ("My Assets"), limited per plan.
- **Categories:** each flyer has a category and subcategory (`client/src/data/categories.ts`), used for filtering on boards.
- **Call to action** and flyer design are stored with the flyer.
- **Anonymous mode** (limited) and **Registered mode** (full).
- **Lifespan:** default 1 week; options depend on plan (see section 5). An `expires_at` timestamp is set when the flyer is created.
- **[Roadmap]** Expired flyers are *not* currently removed or hidden. See 6.7.
- Registered users can edit and delete their flyers at any time.

### 6.3 Boards and Locations
- Each public establishment has a virtual community board (`boards` table, keyed by Google `placeId`; a board row exists once it has flyers).
- Location selection via search and an interactive map (`features/map`, `features/location`) with board listings. Search and posting distance are limited to a bounding area around the user, sized by plan.
- Certain place types are excluded from boards (`excludedTypeList`: corporate offices, apartment buildings/complexes, condo complexes, housing complexes, ATMs, public baths, bus stops).
- Board view lists flyers and can be filtered by category and subcategory; an empty state is shown when there are none.
- "My Area" page for exploring nearby boards.

### 6.4 Flyer Interaction
- Single-flyer view (shareable) at `/dashboard/fullFlyer/:id`.
- Likes. Stored as a counter on the flyer, not per user.
- Comments, powered by Disqus. They appear only when the flyer's `hasComments` setting is on and a Disqus shortname is configured. `hasComments` is inherited from the template when the flyer does not set it.
- Save flyers for later (Saved Flyers page, `saved_flyers` table).

### 6.5 Statistics and Analytics
- **Usage:** plan usage against limits, shown with charts (Chart.js).
- **Analytics:** like counts available now. **[Roadmap]** views and interactions analytics (stated as "coming soon" in the FAQ; `features/statistics/analytics` is currently empty). The `plans.hasAnalytics` field (`lite` / `full`) exists for gating it.
- **QR scan analytics:** when a board is opened with the `ea` URL parameter (the QR entry), the scan is logged once per session to `qr_analytics` (place, name, address, date). Useful as a measure of physical-to-digital conversion.

### 6.6 Payments and Billing
- Stripe subscriptions: plan checkout, billing info, payment form, plan changes, cancellation.
- Paid plans are Garden, Grove and Forest; their Stripe price IDs come from environment variables.
- Stripe webhook updates subscription state server-side (handles invoice paid and payment failed → `unpaid`, plus subscription created, updated, paused, resumed and deleted). It is mounted before the JSON body parser so the raw body is available for signature verification.
- "My Billing" and "My Plan" views (under `/dashboard/account`).

### 6.7 Content Moderation
- Automated moderation endpoint (`/api/moderate`, backed by OpenAI `omni-moderation-latest` via `moderate.js`). **Text only**: image moderation is disabled in code with a TODO, even though the client sends file URLs.
- When content is flagged at creation, the flyer is rejected on the client with a message pointing to support.
- Flyers can also be marked `flagged` (with `flagged_at` and `flaggedReason`). The owner and support are emailed. A daily cron job (05:00) deletes flyers that were flagged more than 7 days ago.
- **[Roadmap]** Deletion of unregistered-user flyers and of expired flyers is implemented but intentionally disabled (commented-out cron jobs in `server.js`, with TODOs).
- **Known gap:** with the expiry job disabled, nothing enforces expiry today. The board query does not filter on `expires_at` or `flagged`, so expired and flagged flyers remain visible until deleted. The FAQ statement that flyers are removed automatically is not yet true. Confirm the intended behavior before enabling.

### 6.8 Email
- Transactional email through Mailgun (`/api/email`), sent from `support@` the Mailgun domain using Mailgun templates:
  - **Welcome** (separate templates for individual and organization sign-ups).
  - **Account deleted.**
  - **Flagged flyer**, sent both to the flyer owner and to support for review.
- Support contact appears as `Support@Leaflit.us` in the FAQ and footer, and as `support@leaflit.us` elsewhere. Pick one canonical form.

### 6.9 Marketing and Help Pages
- Landing page (on-location / remote toggle, QR hero), Pricing page (live plan data), FAQ, "Why register" / "Why upgrade" prompts, Terms, Privacy Policy, DMCA and merchant disclaimer modals, and a PWA install banner.

### 6.10 Offline Flyer Builder (internal tooling)
- An internal agent workflow (`.github/agents/`) can scrape a business's site, upload media to Cloudinary, build a CSV and insert seeded flyers into Supabase. Used to pre-populate boards; not user-facing.

## 7. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Platform** | Mobile-first responsive PWA, installable, custom service worker (`vite-plugin-pwa`, `injectManifest`). |
| **Performance** | Fast first load on mobile networks; TanStack Query caching for board and flyer data; images optimized via Cloudinary. |
| **Security** | CORS restricted to `leaflit.us` in production. Stripe webhook signature verification. Secrets via environment variables (dotenv only outside production). Authorization relies on Supabase Row Level Security; there are no route guards on `/dashboard/*`. See section 10 for RLS concerns. |
| **Privacy** | Location is used to find nearby boards. Anonymous posting must not require personal data. **[Open]** Document retention and deletion policy for user data. |
| **Reliability** | Centralized Express error middleware returning `{ error }` with status codes. |
| **Quality** | Client unit/integration tests with Vitest and React Testing Library (90% coverage threshold), Playwright e2e tests. **Gap:** no backend test suite and no CI workflow (`.github/workflows` does not exist). |
| **Accessibility** | **[Open]** No formal WCAG target is defined. Recommend WCAG 2.1 AA. |

## 8. Technical Architecture (summary)

- **Frontend:** React 19, TypeScript, Vite, React Router v7, styled-components, react-hook-form, TanStack Query. Global state via React Context (Global, AssetSelection, FlyerDesigner, Stripe). No Redux or MobX. Also Chart.js (usage charts), Quill (rich text), Disqus (comments).
- **Backend:** Node.js/Express (CommonJS). Routes → controllers → third-party services. Mounts `/api/{auth,assets,moderate,email,stripe}` and `/webhook`. Serves `client/dist` in production with SPA fallback.
- **Data and services:** Supabase (database and auth, also queried directly from the client), Stripe (billing), Cloudinary (media), Mailgun (email), OpenAI (moderation), Google Maps (map and places), Disqus (comments).
- **Scheduled jobs:** `node-cron` for daily deletion of flagged flyers (the expired and unregistered-flyer jobs are disabled).
- **Deployment:** single server serving API and built client; branches flow feature → `develop` → `main`.

## 8.1 Data Model (Supabase)

`Supabase_Schema.md` (repo root) is the source of truth for columns, enums and RLS policies. Summary:

| Table | Purpose |
|---|---|
| `profiles` | One per registered user: name, contact info, address, `typeOfUser`, `plan` (level), `termsAccepted`, `powerUser`, `pioneer` |
| `plans` | Plan definitions: price, lifespan, media count, flyer/template/asset limits, posting distance, bulk posting, analytics level, `stripeProductId` |
| `customers` | Stripe customer, subscription, product and `subscriptionStatus` per user |
| `boards` | Google places that have flyers (`placeId`, name, address, lat/lng) |
| `flyers` | The flyer: content, category, files, design, call to action, `postingMethod`, `lifespan`, `expires_at`, `likes`, `flagged` fields, `hasComments`, and the poster's type and contact blocks |
| `templates` | Reusable flyer designs owned by a user |
| `assets` | A user's uploaded media, with which flyers and templates use each |
| `saved_flyers` | A user's bookmarked flyers |
| `qr_analytics` | QR scan log per place |

Enums: `posting_method` (`onLocation`, `remote`, `remoteBulk`), `type_of_analytics` (`lite`, `full`), `type_of_user` (`individual`, `business`, `organization`). There is no comments table (comments live in Disqus) and no per-user likes table (likes are a counter).

### 8.2 Schema change workflow

`Supabase_SQL.sql` (repo root) is the hand-off file for database changes.

- Whenever a feature needs a schema change (new table, column, enum, index, function or RLS policy), Claude writes the SQL into `Supabase_SQL.sql` for the product owner to run in Supabase. Claude does not run SQL against the database.
- Append each change as its own block, headed by a comment with the date and feature name. Include the RLS policy changes the feature needs, and a rollback note if the change is destructive.
- After the owner confirms the SQL was run, update `Supabase_Schema.md` so it matches, and update section 8.1 here if the change is product-relevant.
- Do not build client or server code that depends on a schema change without also adding the SQL.

## 9. Success Metrics

| Category | Metric |
|---|---|
| **Activation** | Flyers created per new visitor; share of anonymous users who finish a post |
| **Conversion** | Anonymous → registered; free → paid plan conversion rate |
| **Engagement** | Likes and comments per flyer; saved flyers; return visits to boards; QR scans per board |
| **Supply** | Number of boards with at least one active flyer; flyers per active board |
| **Retention** | Monthly active posters; paid-plan churn |
| **Safety** | Time to remove flagged content; share of flyers flagged |
| **Revenue** | MRR, ARPU |

## 10. Roadmap and Known Gaps

1. Views and interactions analytics (currently likes and QR scans only).
2. Decide and enable cleanup of unregistered and expired flyers (cron jobs disabled). Until then expired flyers stay visible. Also hide flagged flyers from board views.
3. Image moderation (currently text only).
4. Add a backend test suite and a CI workflow.
5. Help center and tutorials (referenced in the FAQ).
6. Settings area (`features/settings` is empty).
7. Bulk posting (`remoteBulk`) is stubbed.
8. Correct the FAQ and Pricing copy: lifespan per plan, and level 2 media types.
9. Documentation fixes: `.github/copilot-instructions.md` references a non-existent `npm run start` (use `npm run dev` or `npm run start-prod`).
10. Code cleanups: unused stub `POST /api/auth/login`; `POST /api/stripe/` is mounted after the JSON body parser (only `/webhook` gets the raw body); `getBaseUrl` has a TODO; the comment on the `deleteUnregisteredFlyers` cron says "turn OFF" and looks inverted.
11. **RLS review.** Most tables have fully open policies: `flyers` (all actions, `true`), `customers` (read, insert, update, delete for public), `saved_flyers` (all actions), and `templates` (update for everyone). `profiles` (including email and phone) is publicly readable. `boards` has an "all public actions" policy that conflicts with its insert-false policy. Because the client talks to Supabase directly, these policies are the real authorization layer. This is flagged for review, not changed here.

## 11. Risks and Open Questions

| Risk / Question | Notes |
|---|---|
| Cold start: empty boards give viewers no reason to return | Seed boards via the Offline Flyer Builder; target dense areas first |
| Abuse and spam, especially from anonymous posting | Moderation, rate limiting **[Open]** (none exists today), anonymous caps |
| Location trust: on-site posting is not verified | Confirmed: no client or server check that a poster is at the place. **[Open]** Decide whether to verify proximity for on-site flyers |
| Open database policies expose user and billing data | See section 10, item 11 |
| Third-party dependency cost and lock-in (OpenAI, Cloudinary, Google Maps, Stripe) | Monitor unit costs per flyer |
| Plan prices and limits are authoritative in the database, with a snapshot in section 5 | Keep the snapshot in sync; confirm currency and billing period |
| Establishment owner involvement (claiming/curating a board) | **[Open]** Not currently supported |

## 12. Release and Process

- Feature branches → PR to `develop` → PR to `main`.
- Definition of done: lint passes, client tests pass at the coverage threshold, manual check on mobile viewport.
- Schema changes follow the workflow in section 8.2.
