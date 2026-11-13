# Responsiveness

How the app adapts to different screen sizes. Leaflit is a mobile-first PWA, but the stylesheets are written desktop-first with `max-width` media queries.

## Two mechanisms

1. **CSS media queries** inside styled-components, for layout and sizing changes.
2. **`useResponsiveWidth()` hook**, for cases where a *different component or prop* is needed, not just different CSS.

## 1. Rem scaling (global)

`GlobalStyles.ts` sets `html { font-size: 62.5% }`, so `1rem = 10px`, and all spacing and type use `rem`. Smaller screens shrink the root font size, which scales every rem-based value at once:

| Viewport | `html` font-size | 1rem |
|---|---|---|
| default | 62.5% | 10px |
| `max-width: 59em` | 55% | 8.8px |
| `max-width: 34em` | 50% | 8px |

At `max-width: 34em` the `body` font-size also goes from `1.6rem` to `1.8rem` to compensate for the smaller root, keeping body text readable on phones.

Consequence: use `rem` for sizes and spacing. Hard-coded `px` values do not scale.

## 2. Media query breakpoints (styled-components)

Queries are written inline in the component's styled block. The breakpoints actually used (by frequency):

| Query | Approx. px | Typical use |
|---|---|---|
| `@media (max-width: 59em)` | 944 | Tablet: stack/shrink layout (most common) |
| `@media (max-width: 34em)` | 544 | Phone: single column, full-width controls |
| `@media (max-width: 75em)` | 1200 | Small desktop / large tablet |
| `@media (max-width: 44em)` | 704 | Large phone / small tablet |
| `@media (max-width: 84em)` | 1344 | Wide desktop tweaks |
| `@media (max-height: 59em)` | 944 tall | Short viewports (pair with width queries for modals/drawers) |

Rules of thumb:
- Prefer these existing `em` breakpoints over inventing new ones. Use `em`, not `px` (a few legacy `480px` / `75rem` queries exist; do not copy them).
- Write the base style for desktop and override downward with `max-width`.
- Example (`ui/Form/FormControlRow.tsx`): a row is `display: flex; gap: 2.4rem` and becomes `flex-direction: column` at `max-width: 34em`.
- `prefers-reduced-motion: reduce` is respected in one place; add it for any new animation.

## 3. `useResponsiveWidth()` hook

`client/src/hooks/useResponsiveWidth.tsx` tracks `window.innerWidth` (resize listener) and returns a device label:

| Returned value | Width (px) |
|---|---|
| `s_mobile` | ≤ 375 |
| `l_mobile` | ≤ 544 |
| `s_tablet` | ≤ 704 |
| `m_tablet` | ≤ 940 |
| `l_tablet` | ≤ 1200 |
| `s_desktop` | ≤ 1344 |
| `l_desktop` | > 1344 |

Used where structure changes, for example:
- `MainLayout.tsx` renders `ActionMenuMobile` for `s_tablet`, `l_mobile`, `s_mobile` and `ActionMenu` otherwise.
- `ui/Flyer/FlyerSlideIn.tsx` sets the drawer width: `100%` on mobile, `80%` on small tablets, `70%` on large tablet / small desktop, `50vw` beyond.
- Also used in `Board`, `MapContainer`, `SavedFlyersList`, `BoardWelcomeModal`, `DcmaModal`.

Use the hook only when you need different markup or props. For pure styling, use a media query. Note the hook's px thresholds roughly line up with the em breakpoints (34em ≈ 544px, 44em ≈ 704px, 59em ≈ 944px, 75em ≈ 1200px, 84em ≈ 1344px) so JS and CSS switch at about the same widths.

## Layout conventions

- Page shells use flex columns with `min-height` and `100dvh` on `body` (dynamic viewport height, correct under mobile browser chrome).
- Containers wrap with `flex-wrap` and `gap` (for example the plan cards on `Pricing`).
- Images use `max-width: 100%` globally.
- Modals (`react-modal`) use fixed `width` values in a `customModalStyles` object, so they need their own mobile handling; check `ui/Modals/*` when changing them.
- Navigation switches between a sidebar/`ActionMenu` on larger screens and `ActionMenuMobile` on small ones.
- The app is installable (`PWABanner`, `usePWAInstallation`), so test at phone widths in standalone mode too.

## Checklist for new UI

1. Build with `rem` units and existing CSS variables (see `docs/ui-styling.md`).
2. Add overrides at `59em` and `34em` at minimum.
3. Verify at 375, 544, 704, 940 and 1344 px widths.
4. If the layout needs a different component tree, switch on `useResponsiveWidth()`.
5. Touch targets should be comfortably tappable; form fields stack in one column at `34em`.

## Known gaps

- Desktop-first `max-width` queries, no shared breakpoint constants; values are repeated as literals across ~40 files.
- Breakpoints are duplicated between the hook (px) and CSS (em).
- A few legacy queries use `px`/`rem`.
