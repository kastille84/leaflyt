# Leaflit — Product Requirements Document

| | |
|---|---|
| **Product** | Leaflit (repo: `leaflyt`) |
| **Status** | Living document, reflects the product as built plus known roadmap items |
| **Last updated** | 2026-11-12 |

> Items marked **[Roadmap]** are announced or stubbed in the code but not fully shipped. Items marked **[Open]** are questions to resolve with the product owner.

---

## 1. Overview

Leaflit is a virtual flyer distribution platform. Instead of printing flyers and pinning them to physical bulletin boards, users design a flyer once and post it to a **virtual community board** tied to a real-world establishment (café, library, gym, shop, etc.). People at or near that location browse the board on their phone and interact with flyers.

Leaflit ships as a Progressive Web App (PWA) so it works as an installable, mobile-first experience.

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

## 5. User Tiers

Plans are stored in the database and loaded dynamically (`useGetPlans`), then sorted by level. The client defines per-level upload limits in `client/src/constants/index.ts`.

| Tier | Account | Capabilities (as implemented) |
|---|---|---|
| **Anonymous** | None | Create and post a flyer on site. 1 image upload, up to 10 MB. |
| **Level 1 (free, registered)** | Yes | Saved flyers, up to 2 image uploads (20 MB each), on-location and remote posting, 1-week default lifespan. |
| **Level 2+ (paid)** | Yes + Stripe subscription | Higher upload limits, flyer lifespan up to 4 weeks, premium features per plan. |

**[Open]** The exact feature matrix, prices and limits per plan live in the `plans` data, not in code. Confirm and document the authoritative values here.

## 5.1 Core User Flows

1. **Anonymous post:** open a board → "Create flyer" → design with template builder → upload one image → submit → flyer appears on the board.
2. **Register and subscribe:** sign up → pick a plan → (paid) enter billing/payment details via Stripe → land in the app.
3. **Registered post:** create flyer → choose template or start blank → select/upload assets → pick one or more target boards → set lifespan → publish.
4. **Remote posting:** choose a location from the map or location search without being physically present.
5. **Browse a board:** open a location's board → view flyers → open a single flyer → like / comment / save.
6. **Manage:** view saved flyers, my templates, my assets, account info, plan, billing and usage.

## 6. Functional Requirements

### 6.1 Authentication and Accounts
- Email/password sign-up and login, forgot/reset password (Supabase Auth).
- Login with an access token (e.g. email links).
- Account info viewing and editing.
- Plan selection at sign-up, plus upgrade/downgrade/change-plan flow.
- Handling for users who registered but have not completed payment (unpaid plan state).

### 6.2 Flyer Creation
- **Flyer designer** with a configuration panel and live display preview.
- **Templates:** pick from template list; registered users can save and reuse their own ("My Templates").
- **Assets:** upload via the Cloudinary widget (local, URL, camera, image search, Unsplash, Google Drive, Shutterstock), with cropping and format limits (jpg, jpeg, png, gif, webp). Registered users keep a reusable asset library ("My Assets").
- **Anonymous mode** (limited) and **Registered mode** (full).
- **Lifespan:** default 1 week; up to 4 weeks on premium plans. Expired flyers are removed from boards.
- Registered users can edit and delete their flyers at any time.

### 6.3 Boards and Locations
- Each public establishment has a virtual community board.
- Location selection via search and an interactive map (`features/map`, `features/location`) with board listings.
- Certain place types are excluded from boards (`excludedTypeList`: corporate offices, apartment buildings/complexes, condos, housing complexes, ATMs, public baths, bus stops).
- Board view lists active flyers; an empty state is shown when there are none.
- "My Area" page for exploring nearby boards.

### 6.4 Flyer Interaction
- Single-flyer view (shareable).
- Likes.
- Comments (recently added, includes per-flyer `hasComments` setting).
- Save flyers for later (Saved Flyers page).

### 6.5 Statistics and Analytics
- **Usage:** plan usage against limits.
- **Analytics:** like counts available now. **[Roadmap]** views and interactions analytics (stated as "coming soon" in the FAQ; `features/statistics/analytics` is currently empty).

### 6.6 Payments and Billing
- Stripe subscriptions: plan checkout, billing info, payment form, plan changes.
- Stripe webhook updates subscription state server-side (mounted before the JSON body parser so the raw body is available for signature verification).
- "My Billing" and "My Plan" views.

### 6.7 Content Moderation
- Automated moderation endpoint (`/api/moderate`, backed by OpenAI moderation via `moderate.js`).
- Flyers can be flagged; flagged flyers are deleted by a daily cron job (05:00).
- **[Roadmap]** Automated deletion of unregistered-user flyers and expired flyers is implemented but intentionally disabled (TODOs in `server.js`). Expiry is currently enforced by lifespan logic rather than these jobs. Confirm the intended behavior before enabling.

### 6.8 Email
- Transactional email through Mailgun (`/api/email`), e.g. account and notification messages.
- Support contact: Support@Leaflit.us.

### 6.9 Marketing and Help Pages
- Landing page, Pricing page (live plan data), FAQ, and "Why register" / "Why upgrade" prompts.

### 6.10 Offline Flyer Builder (internal tooling)
- An internal agent workflow (`.github/agents/`) can scrape a business's site, upload media to Cloudinary, build a CSV and insert seeded flyers into Supabase. Used to pre-populate boards; not user-facing.

## 7. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Platform** | Mobile-first responsive PWA, installable, custom service worker (`vite-plugin-pwa`, `injectManifest`). |
| **Performance** | Fast first load on mobile networks; TanStack Query caching for board and flyer data; images optimized via Cloudinary. |
| **Security** | CORS restricted to `leaflit.us` in production. Stripe webhook signature verification. Secrets via environment variables (dotenv only outside production). |
| **Privacy** | Location is used to find nearby boards. Anonymous posting must not require personal data. **[Open]** Document retention and deletion policy for user data. |
| **Reliability** | Centralized Express error middleware returning `{ error }` with status codes. |
| **Quality** | Client unit/integration tests with Vitest and React Testing Library (90% coverage threshold), Playwright e2e tests. **Gap:** no backend test suite. |
| **Accessibility** | **[Open]** No formal WCAG target is defined. Recommend WCAG 2.1 AA. |

## 8. Technical Architecture (summary)

- **Frontend:** React 19, TypeScript, Vite, React Router v7, styled-components, react-hook-form, TanStack Query. Global state via React Context (Global, AssetSelection, FlyerDesigner, Stripe). No Redux or MobX.
- **Backend:** Node.js/Express (CommonJS). Routes → controllers → third-party services. Mounts `/api/{auth,assets,moderate,email,stripe}` and `/webhook`. Serves `client/dist` in production with SPA fallback.
- **Data and services:** Supabase (database and auth, also queried directly from the client), Stripe (billing), Cloudinary (media), Mailgun (email), OpenAI (moderation), Google Maps (map and places).
- **Scheduled jobs:** `node-cron` for daily deletion of flagged flyers.
- **Deployment:** single server serving API and built client; branches flow feature → `develop` → `main`.

## 9. Success Metrics

| Category | Metric |
|---|---|
| **Activation** | Flyers created per new visitor; share of anonymous users who finish a post |
| **Conversion** | Anonymous → registered; free → paid plan conversion rate |
| **Engagement** | Likes and comments per flyer; saved flyers; return visits to boards |
| **Supply** | Number of boards with at least one active flyer; flyers per active board |
| **Retention** | Monthly active posters; paid-plan churn |
| **Safety** | Time to remove flagged content; share of flyers flagged |
| **Revenue** | MRR, ARPU |

## 10. Roadmap and Known Gaps

1. Views and interactions analytics (currently likes only).
2. Decide and enable cleanup of unregistered and expired flyers (cron jobs disabled).
3. Add a backend test suite.
4. Help center and tutorials (referenced in the FAQ).
5. Settings area (`features/settings` is empty).
6. Documentation fixes: `.github/copilot-instructions.md` references a non-existent `npm run start`.

## 11. Risks and Open Questions

| Risk / Question | Notes |
|---|---|
| Cold start: empty boards give viewers no reason to return | Seed boards via the Offline Flyer Builder; target dense areas first |
| Abuse and spam, especially from anonymous posting | Moderation, rate limiting **[Open]**, anonymous caps |
| Location trust: on-site posting is not verified server-side | **[Open]** Decide whether to verify proximity for on-site flyers |
| Third-party dependency cost and lock-in (OpenAI, Cloudinary, Google Maps, Stripe) | Monitor unit costs per flyer |
| Authoritative plan feature matrix is in the database, not the repo | Document in this PRD once confirmed |
| Establishment owner involvement (claiming/curating a board) | **[Open]** Not currently supported |

## 12. Release and Process

- Feature branches → PR to `develop` → PR to `main`.
- Definition of done: lint passes, client tests pass at the coverage threshold, manual check on mobile viewport.
