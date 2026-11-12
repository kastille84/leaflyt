# Authentication

How sign-up, login, session handling and account deletion work today.

## Overview

- **Identity provider:** Supabase Auth (email + password). The client talks to it directly through `client/src/services/supabase.ts`.
- **Profile data:** a `profiles` table in Supabase holds the app-level user (name, type of user, plan, etc.). It is linked to the auth user by the `user` column.
- **No custom session or JWT code is used for the app.** Session persistence is handled by the Supabase JS client. The Express `/api/auth/login` handler is an empty stub and is not used by the client.
- **Anonymous use is supported.** Visitors can post a flyer without an account (see `docs/PRD.md`).

## Key files

| Area | File |
|---|---|
| Supabase client | `client/src/services/supabase.ts` |
| Auth API functions | `client/src/services/apiAuth.ts` |
| Login / reset hooks | `client/src/features/authentication/useLogin.ts` |
| Auto-login hook | `client/src/features/authentication/useLoginWithAccessToken.ts` |
| Signup hook | `client/src/features/authentication/useSignup.ts` |
| Login UI | `client/src/features/authentication/LoginModal.tsx` |
| Signup UI | `SignupContainer.tsx`, `SignupForm.tsx`, `PickPlanForm.tsx`, `PaymentFormContainer.tsx` |
| Password flows | `ForgotPassword.tsx`, `ResetPassword.tsx` |
| Auth state | `isLoggedIn`, `user`, `showLoginModal` in `client/src/context/GlobalContext.tsx` |
| Server routes | `server/routes/auth.js`, `server/controllers/auth.js` |
| Server validators | `server/middlewares/validators/auth.js` |

## Sign-up flow

1. `SignupForm` collects the account type (`individual`, `business` or `organization`), contact info, address, password and terms acceptance. The fields differ per type, so the code reads `individual`, `business` or `organization` sub-objects in `signupUser`.
2. `signupUser` (`apiAuth.ts`) calls `supabase.auth.signUp` with `emailRedirectTo` set to `/dashboard/home?verified=true&email=...&typeOfUser=...&name=...`. The query string carries what is needed to send the welcome email after verification.
3. It then `POST`s the profile to `/api/auth/signup`. The controller inserts the row into `profiles` using the server-side Supabase client and forces `plan: 1` (the free plan).
4. The user picks a plan (`PickPlanForm`). Paid plans continue to the Stripe payment forms (see Payments below).
5. The user clicks the verification link in their email and lands on `/dashboard/home?verified=true...`. `SignupContainer` detects `verified=true` and calls `sendWelcomeEmailFn` (`POST /api/email/send-welcome-email`).
6. After a successful Stripe checkout the URL carries `session_id`, `customer_id` and `plan`; the user is told to verify their email and log in again to activate the plan.

## Login flow

1. `LoginModal` (react-hook-form, `mode: "onBlur"`) calls `useLogin().login`, which runs `loginUser(email, password)`.
2. `loginUser` signs in with `supabase.auth.signInWithPassword`, then loads the full profile in one query: `profiles` joined with `flyers(place)`, `templates`, `plan`, `assets`, `saved_flyers` and `customers`.
3. **Unpaid check:** if the user's first `customers` row has `subscriptionStatus == "unpaid"`, the function returns `{ data, error: { message: "unpaid" } }`.
4. **Plan sync:** if the Stripe `productId` on the customer row differs from the profile's plan `stripeProductId`, the matching plan is fetched and written to the profile, and the in-memory profile is updated.
5. On success the profile is stored in global context with `setUser(response.data)`, a toast is shown, and the app navigates to `/dashboard/board/<selectedPlace.id>` if a place was chosen, otherwise `/dashboard/home`.
6. On the `"unpaid"` error the login modal closes and the bottom slide-in opens with type `"unpaid"` (`UnpaidPlanContainer`).

Note the convention: the service functions **catch and return** errors as `{ data, error }` instead of throwing. Components convert a returned `error` back into a thrown `Error` inside `onSuccess` so the mutation's `onError` handles it. See `docs/error-handling.md`.

## Session persistence (auto-login)

`MainLayout.tsx` and `Landing.tsx` each run this on mount:

1. `supabase.auth.getSession()`.
2. If a session exists, call `autoLogin` (`loginUserWithAccessToken`), which does `supabase.auth.getUser()` and loads the same profile query as login.
3. Store the profile in context. Navigate to `/dashboard/home` (or `/dashboard/board/:id` when a board id is in the route), unless the path includes `fullFlyer`.
4. `MainLayout` skips auto-login on any path containing `password`, so the password-reset page is not redirected.

The session itself lives in Supabase's own browser storage; the app does not store the access token (the `useLocalStorageState` line in `Landing.tsx` is commented out).

## Password reset

- `forgotPassword(email)` calls `supabase.auth.resetPasswordForEmail` with `redirectTo` = `/dashboard/update-password`.
- `ResetPassword` calls `updatePassword`, which uses `supabase.auth.updateUser({ password })`.
- The password input enforces a minimum length of 8 on the client (`ui/Form/PasswordInput.tsx`).

## Account deletion

`deleteUser` (`apiAuth.ts`) sends `DELETE /api/auth/delete-user` with the Supabase `access_token` in a `token` header. The controller forwards it as `Authorization: Bearer <token>` to a Supabase delete-user endpoint configured per environment (`supabase.deleteUserUrl` in `server/utility/generalUtils.js`). The client then calls `supabase.auth.signOut()`. A deleted-user email is sent via `/api/email/send-deleted-user-email`.

## Authorization

- **Client:** UI is gated by the presence of `user` in context and by plan limits (`useGetUserLimits`, `LimitExceededWarning`, `UpgradeText`, `WhyRegister`, `WhyUpgrade`). Routes under `/dashboard/` are not protected by a route guard component; the dashboard layout is reachable without login for anonymous use.
- **Data access:** most reads and writes go directly from the browser to Supabase using the public anon key, so **Supabase Row Level Security is the real authorization layer**. Keep RLS policies in sync when adding tables.
- **Server:** the Express API has no auth middleware. Only `delete-user` relies on the caller's Supabase token. The server-side Supabase client (`supabase.js` at the repo root) uses privileged credentials, so do not expose new routes that use it without verifying the caller.

## Environment keys

- Client: `keysBasedOnEnv()` in `client/src/utils/GeneralUtils.tsx` picks the `_PROD` or non-prod Supabase URL and key from `VITE_*` variables based on Vite `MODE`.
- Server: `keysBasedOnEnv()` in `server/utility/generalUtils.js` does the same from `process.env`, keyed on `NODE_ENV`.

## Known gaps

- `server/routes/auth.js` has the `signup` validators commented out and `login` is an unused stub. Server-side validators in `server/middlewares/validators/auth.js` exist but only apply to the stub login route.
- No route guards, no server auth middleware (see Authorization).
- Two places run the auto-login effect (`Landing`, `MainLayout`) with near-identical code.
- `supabase.auth.onAuthStateChange` is not used, so a session expiring in another tab is not detected until the next load.
