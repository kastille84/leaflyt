# Coding Style — React & TypeScript

Standards for the `client/` app (React 19, TypeScript, Vite). This describes what the code does today, with a note where new code should be stricter than older code. When in doubt, match the surrounding file. Styling is covered in `docs/ui-styling.md`, forms in `docs/ui-inputs.md`, errors in `docs/error-handling.md`.

## Tooling

| Tool | Setting |
|---|---|
| TypeScript | `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`, `jsx: react-jsx`, target ES2020, `moduleResolution: bundler` (`client/tsconfig.app.json`) |
| ESLint | `typescript-eslint` recommended + `react-hooks` recommended + `react-refresh/only-export-components` (warn); unused vars warn (`client/eslint.config.js`) |
| Formatting | No Prettier or editorconfig is checked in. The code follows Prettier defaults: 2-space indent, double quotes, semicolons, trailing commas in multi-line literals, ~80 columns. Keep to that. |
| Build | `npm run build` runs `tsc --noEmitOnError false && vite build`, so type errors do **not** fail the build. Run `npx tsc --noEmit` yourself and fix errors anyway. |

Run `npm run lint` before finishing a change.

### `erasableSyntaxOnly`
Do not use TypeScript-only runtime syntax: no `enum`, no `namespace`, no constructor parameter properties. Use union types and `as const` objects instead. (There are no enums in the codebase.)

## Project structure and file naming

```
client/src/
  features/<domain>/   domain modules: components + their own hooks
  ui/                  shared, domain-agnostic components (Button, Input, Form/, Modals/ ...)
  pages/               route-level components
  hooks/               shared hooks (useXxx)
  services/            API wrappers (apiXxx.ts) - the only place that talks to Supabase/fetch
  context/             React Context providers
  interfaces/          shared types (Auth_User, DB_Flyers, Plan, Geo, Stripe ...)
  utils/               pure helpers (GeneralUtils, FlyerUtils, ServiceUtils)
  constants/           constant data
  styles/              global styles
client/tests/          mirrors src/ (see Testing)
```

| Kind | Convention | Example |
|---|---|---|
| Component file | `PascalCase.tsx`, one main component per file | `LoginModal.tsx` |
| Hook file | `camelCase`, `use` prefix, `.ts` or `.tsx` | `useLogin.ts`, `useGetPlans.tsx` |
| Service file | `api` + `PascalCase` noun | `apiFlyers.ts` |
| Utils | `PascalCase` + `Utils` | `GeneralUtils.tsx` |
| Interface file | `PascalCase`, domain prefix with underscores where it mirrors a table | `DB_Flyers.tsx`, `Auth_User.tsx` |
| Test | same name as source + `.test.tsx` | `LoginModal.test.tsx` |

- Put feature-specific code in `features/<domain>/` (component, its `useXxx` hook, sub-components). Move something to `ui/` only when it is domain-agnostic and reused.
- Pages in `pages/` stay thin: layout and composition, with logic in `features/`.

## Components

- **Function components only.** Use `export default function Name() {}` (the dominant pattern, ~160 files). Do not use `React.FC` or class components.
- Declare styled-components **above** the component in the same file (see `ui-styling.md`), then the component, then small helpers.
- Name event handlers `handleXxx` (`handleClose`, `handleRegisterClick`, `handleToggle`) and submit handlers `onSubmit`.
- Prefer early returns for loading/empty states over deep nested ternaries; keep JSX shallow by extracting small components.
- Inline props typing for small components; a named `interface` for larger ones:

  ```tsx
  export default function FieldInputError({ message }: { message: string }) { ... }
  ```

- Extend native element props when wrapping an element: `interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { hasError?: boolean }`.
- Children: type as `React.ReactNode`, or use `PropsWithChildren` for providers.
- Keys: use a stable id (`key={plan.id}`), never the array index for reorderable lists.
- Add a `data-testid` to containers that tests need (`testId` prop on `FormControl`, `data-testid="main-layout"`). Use kebab-case names.
- Only export components from component files (`react-refresh/only-export-components`). Put shared non-component exports in `utils/` or `constants/`.

## Hooks

- Custom hooks start with `use` and return an **object** of named values, not a tuple, except for state-like hooks (`useLocalStorageState` returns `[value, setValue]`).
- **Data hooks wrap TanStack Query.** Rename `mutate`/`error` to intent-revealing names:

  ```ts
  const { mutate: createFlyer, error: createFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyer_Create) => createRegisteredFlyer(prepData, selectedPlace!),
  });
  return { createFlyer, createFlyerError, ... };
  ```

  Queries use a descriptive `queryKey` array (`["getPlans"]`) and set `staleTime`/`gcTime` explicitly where caching matters (the app default is `staleTime: 0, gcTime: 0`).
- Components never call `supabase` or `fetch` directly; they call a hook, and the hook calls a `services/` function. (A few legacy spots such as the session check in `MainLayout.tsx` use `supabase.auth` directly; do not add more.)
- Follow the Rules of Hooks (the lint rule is on). Keep `useEffect` dependency arrays honest. Where an effect is intentionally mount-only, say so with a targeted `// eslint-disable-next-line react-hooks/exhaustive-deps` as `SignupContainer.tsx` does.
- Prefer deriving values during render over syncing them with `useEffect` + state.
- Use `useResponsiveWidth()` for structural responsive changes only (`responsiveness.md`).

## State management

- **Local state** (`useState`) for UI-only state inside one component.
- **Global state** is React Context only (`context/`): `GlobalContext`, `AssetSelectionContext`, `FlyerDesignerContext`, `StripeContext`. **Do not introduce Redux, MobX, Zustand, etc.**
- **Server state** belongs in TanStack Query, not in Context. (The logged-in `user` profile is the existing exception and lives in `GlobalContext`.)
- Context pattern (`GlobalContext.tsx`): a typed `ContextType`, `createContext<ContextType>(defaults)`, an exported `XxxProvider` that owns the `useState` calls, and an exported `useXxx` hook that throws a clear error when used outside the provider. Consumers always use the hook, never `useContext` directly.
- Forms: **react-hook-form**. Do not hand-roll controlled form state.
- Persisted UI state: `useLocalStorageState` / `useSessionStorageState`.

## TypeScript

### Types
- Share domain types from `src/interfaces/`. Model database rows with `DB_*` names and API payloads with `*_Create` / `*_Response` suffixes (`DB_Flyer_Create`, `DB_Flyers_Response`, `Auth_User_Profile_Response`). Use these, not ad-hoc shapes.
- `interface` for object shapes and props; `type` for unions, intersections and aliases. Discriminated unions model variants (the `type: "individual" | "business" | "organization"` shapes in `Auth_User.tsx`).
- Use string-literal unions for fixed sets, for example `"edit" | "create" | "editTemplate" | "createTemplate" | null`, instead of enums.
- Type function parameters and return values explicitly for exported functions and services. Let TypeScript infer local variables.
- Import types the normal way (`import { Plan } from ...`); `import type` is optional here because `verbatimModuleSyntax` is off.
- Use `React.Dispatch<React.SetStateAction<T>>` for setter types and `UseFormRegister<any>`, `FieldErrors<FieldValues>` for form props.

### `any` and assertions
- The codebase has a lot of `any` (about 200 occurrences). **Do not add more.** Prefer a real interface, `unknown` plus a narrowing check, or a generic. When catching, use `catch (error: any)` only to read `.message`, as existing services do.
- Avoid non-null assertions (`!`) unless the value is guaranteed by flow (for example `selectedPlace!` after a UI guard). Prefer a check.
- Prefer `as const` objects over casts. Keep type assertions (`as Foo`) to DOM lookups and third-party shapes.

### Nullability
- Use optional chaining and nullish coalescing: `userProfile?.customers ?? []`, `session?.access_token`.
- Model "not loaded" as `null` in state (`useState<LatLng | null>(null)`), not empty strings or fake defaults.

## Imports

- Relative paths only (no path aliases are configured). Order: third-party packages, then context/hooks/services, then `ui/` components, then interfaces and utils. Keep it grouped and consistent within the file; no enforced sorter exists.
- Named imports for libraries. Default imports for components and hooks; named imports for utilities.
- Remove unused imports (`noUnusedLocals` flags them).
- Client code reads env through `keysBasedOnEnv()` (`utils/GeneralUtils.tsx`), not `import.meta.env` scattered across files.

## Naming

| Thing | Style | Example |
|---|---|---|
| Components, interfaces, types | PascalCase | `PickPlanForm`, `Plan` |
| Variables, functions, hooks | camelCase | `showSpinner`, `getFlyerById` |
| Boolean state | `is` / `has` / `show` prefix | `isLoggedIn`, `hasError`, `showLoginModal` |
| State setters | `set` + state name | `setUser` |
| Handlers | `handleXxx`, submit is `onSubmit` | `handleClose` |
| Styled components | `StyledXxx` | `StyledFormControl` |
| Mutation wrappers | verb + `Fn` when the plain name collides | `forgotPasswordFn`, `deleteFlyerFn` |
| Constants | SCREAMING_SNAKE for config objects, camelCase for lists | `FILE_UPLOAD_OPTIONS`, `excludedTypeList` |
| DB-shaped types | `DB_` prefix with underscores | `DB_Template` |

Use descriptive names; avoid single-letter variables except short callbacks.

## Functions and utilities

- Pure helpers go in `utils/` and are unit-tested. Keep side effects in services and hooks.
- Prefer small functions with early returns. Use `async/await` with `try/catch` (no raw `.then` chains for new code; existing `getSession().then(...)` is legacy).
- Use `dayjs` for dates, not `Date` arithmetic. Use the existing helpers (`accessNestedProperty`, `getBaseUrl`, `calculateEndDate`, `keysBasedOnEnv`) before writing new ones.
- No magic values: put repeated numbers and lists in `constants/` or a named constant near the top of the file.

## Services

- One `apiXxx.ts` per domain. Export named async functions.
- Keep the file's existing error style (return `{ data, error }` or throw); see `docs/error-handling.md`.
- Log with `console.error` for failures in services. Remove stray `console.log` debugging before committing.

## Comments

- Comment *why*, not *what*. Existing style: short `//` lines above a block, `// TODO:` for planned work (with context), and `/* v8 ignore start/stop */` only around code that cannot be covered in a browser test.
- Do not leave commented-out code in new changes. The repo has some legacy blocks; do not add to them.
- Use `// eslint-disable-next-line <rule>` narrowly, with a reason, never file-wide.

## Testing

- Framework: Vitest (browser mode, Playwright Chromium) with React Testing Library and `user-event`. E2E with Playwright in `client/e2e/`.
- Tests live in `client/tests/`, mirroring `src/` (`tests/features/authentication/LoginModal.test.tsx`), and match `tests/**/*.test.{ts,tsx}`.
- Wrap renders with helpers from `tests/test-utils.tsx` (`QueryClientProviderWrapperWithBrowserRouter`, etc.). Query retries are disabled there so error states are deterministic.
- Mock context and hooks with `vi.mock(...)` and fixtures from `tests/fixtures/` (for example `mockUseGlobalContextReturnObj`).
- Write per-component getter helpers (`getEmail()`, `getPassword()`) that return `{ container, label, input }` via `data-testid`, then reuse them across tests.
- Query by test id, role or label text. Use `userEvent.setup()` for interactions.
- Coverage threshold is **90%** (excludes `context/`, `interfaces/`, `constants/`, `styles/`, fixtures). New code needs tests that keep it above this.
- Run a single file: `npx vitest run tests/features/path/File.test.tsx`. Use `npm run coverage` for a single full run (`npm test` is watch mode).

## Git and process

- Feature branches merged into `develop` by PR, then `develop` into `main`.
- Before opening a PR: `npm run lint`, `npx tsc --noEmit`, and the relevant tests pass.
- Check `docs/tasks.md` for planned work and update it when a task starts or finishes.

## Checklist for new code

1. Is there an existing component, hook, util or type to reuse?
2. Lives in the right folder, with the right file name and default export?
3. Props and returns typed; no new `any`; no enums.
4. Server data via a `services/` function and a TanStack Query hook; global UI state via the existing Context.
5. Styles use tokens and styled-components; mobile overrides added.
6. Errors handled and surfaced per `error-handling.md`.
7. `data-testid` added and tests written in `client/tests/`.
8. Lint and `tsc --noEmit` clean; no stray `console.log` or commented-out code.

## Known gaps / inconsistencies

- High `any` count; `useLocalStorageState` itself is typed with `any`.
- Type errors do not fail `npm run build`.
- No Prettier config or import sorting; formatting relies on convention.
- Mixed `.ts`/`.tsx` extensions for hooks and interfaces (`Auth_User.tsx` has no JSX).
- Mixed service error styles and a few components calling Supabase directly.
- Some legacy `console.log` and commented-out blocks remain.
