# UI Styling

How CSS is written. The client uses **styled-components only**. There are no CSS modules, Tailwind or component library, and no separate stylesheets beyond `src/index.css` and the global style component.

## Where styles live

| Location | Contents |
|---|---|
| `client/src/styles/GlobalStyles.ts` | `createGlobalStyle`: design tokens (CSS variables), reset, base typography, rem scaling, form-element defaults. Mounted once in `App.tsx`. |
| `client/src/ui/` | Shared primitives: `Button`, `Input`, `Select`, `Heading`, `Spinner`, `OverlaySpinner`, `InfoAlert`, etc. |
| Each component file | Its own `const StyledX = styled.tag\`...\`` blocks at the top of the file, above the component. |

## Design tokens (CSS variables on `:root`)

Always use the variables instead of raw hex values.

**Colours**
- Brand green: `--color-brand-0, 50, 100, 200, 500, 600, 700, 800, 900` (primary is `--color-brand-600` = `#2B8A40`).
- Grey: `--color-grey-50 ... --color-grey-900`.
- Blue: `--color-blue-100, 200, 400-800`.
- Orange: `--color-orange-100, 200, 400-800`. Used for **error/warning** states and sub-headings.
- Red: `--color-red-100, 200, 400-800`. Used for **danger** actions (`Button variation="danger"`).
- `--backdrop-color`.

**Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`.

**Radius:** `--border-radius-tiny` (3px), `-sm` (5px), `-md` (7px), `-lg` (9px).

> Some code references `--color-grey-0`, which is not defined in `GlobalStyles.ts` (inputs, selects, secondary buttons). It falls back to unset. Define it, or use `--color-grey-50`/`#fff`, when fixing those.

## Units and typography

- `html { font-size: 62.5% }`, so **1rem = 10px**. Write sizes and spacing in `rem` (for example `1.6rem`, `2.4rem`). Responsive root scaling is described in `docs/responsiveness.md`.
- Spacing scale (from the comment in `GlobalStyles.ts`, px): 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128, so `0.8rem`, `1.2rem`, `1.6rem`, `2.4rem`, `3.2rem`, `4.8rem`...
- Font: `"DM Sans", sans-serif`; body `1.6rem`, line-height `1.5`, colour `--color-grey-700`.
- Headings: use `ui/Heading` with `as="h1" | "h2" | "h3"` (3rem/600, 2rem/600, 2rem/500). The semantic level and the look come from the same `as` prop.
- Text wrapping: `p` and headings use `overflow-wrap: break-word; hyphens: auto`.

## Global reset

`*` has `box-sizing: border-box; margin: 0; padding: 0`. `button` is `cursor: pointer`; `*:disabled` is `cursor: not-allowed`; disabled `input`/`select` get a grey background. `a` inherits colour with no underline, `ul` has no list style, `img` is `max-width: 100%`.

## Conventions

### Styled components
- Define styles next to the component. Name them `StyledThing`.
- Use nested selectors with `&` for children and states: `& h4 { ... }`, `&:hover`, `&.error`.
- Variants are done with props plus `css` helpers, as in `Button.tsx`: `sizes` and `variations` objects of `css` blocks selected by `props.size` / `props.variation`.
- Extend an existing component with `styled(Component)` (for example `styled(Heading)`, `styled(Button)`) rather than copying its CSS.
- State classes (`.error`) are used alongside props in some form code; follow the file you are in.
- `!important` appears in a few overrides (for example `StyledSubmitError`). Avoid it for new code.

### Props
- Custom props such as `hasError`, `size`, `variation` are passed straight to the styled element. Prefer transient props (`$hasError`) for new components to avoid unknown-attribute warnings on DOM nodes.

### Colour semantics
| Meaning | Token |
|---|---|
| Primary action, labels, links | `--color-brand-600` (hover `-700`) |
| Input border (normal) | `--color-brand-500` |
| Validation error, warning text | `--color-orange-600` |
| Destructive button | `--color-red-600` (hover `-800`) |
| Body text | `--color-grey-700` |
| Subtle backgrounds / disabled | `--color-grey-50` / `--color-grey-200` |

### Common patterns
- **Cards/pages:** white `StyledMain`, `StyledMainSection` with `padding: 4rem 2.4rem` and flex column with `gap: 3.2rem`.
- **Back links:** `BackLink` styled `Link`, brand-600, weight 600.
- **Modals:** `react-modal` with a `customModalStyles` object (overlay `rgba(0,0,0,0.6)`, `zIndex: 1000`, content centred with `transform`, `boxShadow: var(--shadow-lg)`, `padding: 3.2rem`). Styles are passed as JS objects here, not styled-components, so tokens are referenced as strings like `"var(--shadow-lg)"`.
- **Slide-ins / drawers:** `SlideInBottom` and `FlyerSlideIn`.
- **Loading:** `Spinner`, and `OverlaySpinner` (absolute full-size overlay, `z-index: 1000`, translucent green).
- **Toasts:** styled via `toastOptions` in `App.tsx`.
- **Flyer rendering:** the flyer designer allows user-chosen colour and border radius, so flyer components style from data rather than tokens (`ui/Flyer/`).

## Dos and don'ts

Do:
- Use tokens and `rem`.
- Reuse `Button`, `Input`, `Select`, `Heading`, `FormControl`.
- Add mobile overrides for every new layout (`docs/responsiveness.md`).

Don't:
- Add new CSS files, utility classes, or another styling library.
- Hard-code colours, `px` font sizes or shadows.
- Put layout rules in `GlobalStyles.ts`; it is for tokens, reset and element defaults.

## Known gaps

- Undefined `--color-grey-0` token is referenced in several primitives.
- `ui/Checkbox.tsx` is a stub; checkbox styling is in `FormControl`.
- No dark mode; colours are a single light theme.
- Some pages inline `style={{ ... }}` (for example `Faq.tsx` headings); prefer styled blocks.
- Media-query literals are repeated rather than shared.
