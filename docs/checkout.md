# Checkout and Plan Changes

How a user gets onto, moves between, and leaves a paid plan. Complements `docs/PRD.md` §6.6.

Plans: level 1 **Seed** (free, no Stripe), 2 **Garden**, 3 **Grove**, 4 **Forest** (paid, Stripe subscriptions). Stripe price IDs come from env vars via `keysBasedOnEnv()` in `server/controllers/stripe.js`.

## Key pieces

| Piece | Location | Role |
|---|---|---|
| `PickPlanForm` | `client/src/features/authentication/` | Plan picker used by sign-up, upgrade and change-plan. Its props decide the flow. |
| `PaymentFormContainer` / `PaymentForm` | same | Creates a Stripe Checkout Session (`ui_mode: "custom"`) and renders `PaymentElement`. |
| `PaymentBillingInfoForm` | same | Billing form for the **unpaid** recovery flow. |
| `ChangePlanContainer` | same | Wraps `PickPlanForm` + `PaymentFormContainer` for upgrade / change plan. |
| `CancelSubscriptionModal` | `client/src/ui/Modals/` | Cancel at payment step (`onPayment`) or cancel a live subscription (`onAccount`). |
| `useStripe` / `apiStripe.ts` | `client/src/hooks`, `client/src/services` | Client calls to `/api/stripe/*`. |
| Stripe controller + webhook | `server/controllers/stripe.js` | Stripe API calls and the `/webhook` handler that syncs `customers`. |
| Login reconciliation | `client/src/services/apiAuth.ts` | Syncs `profiles.plan` with the subscription at login. |

Slide-in types (`SlideInBottom.tsx`) choose the flow:

| `bottomSlideInType` | Renders | Opened from |
|---|---|---|
| `signup` | `SignupContainer` | Sign-up buttons |
| `upgrade` | `ChangePlanContainer isUpgrade` | "Upgrade" (`UpgradeText`, My Plan, My Billing) |
| `changePlan` | `ChangePlanContainer isAnyPaidPlan` | "Change plan" in My Billing |
| `unpaid` | `UnpaidPlanContainer` | Login finds `subscriptionStatus = "unpaid"` |

## The decision in `PickPlanForm.onSubmit`

```
(!isUpgrade && !isAnyPaidPlan)        // sign-up
|| (isUpgrade && currentPlanId === 1) // upgrade from Seed
        → create Stripe customer → Checkout (card required)
otherwise (paid → paid)
        → update the existing subscription (no checkout, no card prompt)
```

Plans offered (`PlansInputContainer`): `upgrade` shows only plans above the current one; `changePlan` shows every paid plan except the current one (so it covers downgrades between paid plans).

## Scenarios

### 1. Sign-up → Seed
No Stripe call. Toast, slide-in closes. `profiles.plan = 1` (sign-up always starts at level 1).

### 2. Sign-up → paid, or Upgrade from Seed → paid
1. Billing name + address collected in `PickPlanForm`.
2. `POST /api/stripe/create-customer` creates the Stripe customer and a `customers` row (`customerId`, `user`).
3. `POST /api/stripe/create-checkout-session` (`mode: "subscription"`) returns a `clientSecret`.
4. `PaymentForm` calls `checkout.confirm()`; Stripe redirects to `/dashboard/home?session_id=…&customer_id=…&plan=…`. `Home.tsx` shows "Payment successful! Verify your email and re-login to activate your plan."
5. Webhook `customer.subscription.created` writes `subscriptionId`, `subscriptionStatus`, `productId` to `customers`.
6. At the next login, `apiAuth` sees `customers[0].productId !== plan.stripeProductId` and sets `profiles.plan` to the matching plan.

`profiles.plan` is **not** changed by the checkout itself; step 6 activates it.

### 3. Cancel at the payment step
`PaymentForm` Cancel → modal `onPayment` → `DELETE /delete-customer` removes the customer in Stripe and in `customers`. User stays on Seed.

### 4. Upgrade paid → higher paid (`upgrade`)
### 5. Change / downgrade paid → paid (`changePlan`)
Same path for both; a downgrade is just a lower target plan.
1. `POST /api/stripe/update-subscription` `{ subscriptionId, newPlan }`.
2. Server validates `subscriptionId` and that `newPlan` maps to a paid price (else `400`), retrieves the subscription (rejects if canceled), swaps the price on the first item with `proration_behavior: "create_prorations"`. Prorations are charged or credited on the **next** invoice, not immediately.
3. **Only if Stripe accepted the change** (`response.ok`) does the client write `profiles.plan` and update global state. If Stripe rejects, or the Supabase write fails, `profiles.plan` is untouched and the form shows the error.
4. Webhook `customer.subscription.updated` updates `productId` / `subscriptionStatus` in `customers`.

### 6. Downgrade to Seed (cancel subscription)
My Billing → modal `onAccount` → `DELETE /delete-customer` (Stripe deletes the customer and **immediately** cancels the subscription; no refund, no end-of-period grace) → `profiles.plan = 1`. Cannot be undone.

### 7. Payment failed (unpaid)
1. `invoice.payment_failed` webhook sets `customers.subscriptionStatus = "unpaid"`.
2. Login (`loginUser` / `loginUserWithAccessToken`) returns the error `"unpaid"`; the `unpaid` slide-in opens (no close button, no cancel on the payment form).
3. `PaymentBillingInfoForm` offers:
   - **Switch to Free Plan:** delete the customer, set `profiles.plan = 1`.
   - **Continue to Pay:** delete the old customer, **set `profiles.plan = 1`**, create a new customer, then Checkout for the plan the user was on. A successful payment restores the paid plan through the webhook and login reconciliation (scenario 2, steps 5–6).

## Safety nets

- **Failures surface as errors.** `apiStripe.ts` services return `{ data: null, error }` instead of throwing. `useStripe` rethrows `result.error` so react-query fires `onError` / rejects `mutateAsync`. `deleteCustomer` and `updateSubscription` also treat a non-2xx response as an error.
- **Paid plan without a subscription is reset.** `resetPlanIfNoSubscription` (`apiAuth.ts`) runs at every login: if the profile has a paid plan and **no** `customers` row, the plan is set to Seed. It skips `powerUser` and `pioneer` profiles, whose plans are granted outside Stripe. This catches an abandoned re-payment after scenario 7, or any other drift.

## Source of truth

- Stripe holds the subscription. `customers` mirrors it via webhook (`subscriptionId`, `subscriptionStatus`, `productId`).
- `profiles.plan` is what the app enforces limits from. It is written by the client on plan change/cancel, and reconciled at login from `customers.productId`.

## Known limitations

- Webhook handlers for `subscription.created/updated/deleted` only act when `event.request != null` (API/Dashboard-initiated). Stripe-initiated changes are skipped except `invoice.payment_failed`; the automatic `subscription.deleted` branch is empty.
- `invoice.paid` only logs.
- `cancelSubscription` in `stripe.js` and its route are unused (cancel goes through `delete-customer`) and never send a response.
- After paying, the plan is only activated at the next login (hence the "re-login" toast).
- Cancel is immediate and non-refundable; there is no `cancel_at_period_end` option.
- The Seed reset in scenario 7 is applied before payment completes, so a user who abandons checkout is on Seed until they pay.
