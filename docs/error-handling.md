# Error Handling

How errors are produced, propagated and shown to the user, on the server and in the client.

## Server (Express)

### Pattern

Controllers wrap their body in `try/catch` and forward failures to Express:

```js
exports.signup = async (req, res, next) => {
  try {
    // ...work...
    if (error) throw error;
    return res.status(201).json({ data });
  } catch (err) {
    handleCatchError(next, err);
  }
};
```

### Helpers (`server/utility/error.js`)

| Helper | Behavior |
|---|---|
| `handleCatchError(next, err)` | Logs the error. If it has no `statusCode`, sets `statusCode = 500` and replaces the message with "Something went wrong on our end. Please try again later." Then calls `next(err)`. |
| `handleValidationError(errors)` | For `express-validator` results. If there are errors, throws an `Error("Validation failed")` with `statusCode = 422` and `data = errors.array()`. |

### Central error middleware (`server.js`)

Registered after all API routes:

```js
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  return res.status(status).json({ error });
});
```

The response body is `{ error: <the error object> }`. Note that `JSON.stringify` of an `Error` drops `message` (not enumerable), so clients mostly rely on the HTTP status and any enumerable fields (`statusCode`, `data`). Supabase errors thrown directly keep their own enumerable `message`, `code`, `details`.

### Other details

- The Stripe webhook is mounted before `bodyParser.json()` so it receives the raw body. Keep that order.
- Cron jobs (`node-cron`) run outside the request cycle and only `console.log`; they have no error reporting.
- There is no structured logger; everything uses `console.log`.

## Client (React)

### Layered flow

```
services/*.ts  ->  hooks (TanStack Query useMutation/useQuery)  ->  component callbacks  ->  UI
```

### 1. Services (`client/src/services/`)

Two styles exist. Match the file you are editing.

- **Return style** (auth, most mutations): catch everything and return `{ data, error }`.

  ```ts
  try {
    const { data, error } = await supabase.auth.signInWithPassword({...});
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
  ```

  Intentional "soft errors" are returned the same way, e.g. `{ data: userProfile, error: { message: "unpaid" } }`.

- **Throw style** (flyers, assets, boards, queries): log with `console.error`, then throw a new `Error` with a readable prefix so `useQuery`/`useMutation` marks the call as failed.

  ```ts
  throw new Error("Error getting flyer by id: " + error.message);
  ```

Calls to the Express API use `fetch`, then `const result = await response.json(); if (result.error) throw result.error;`. The base URL comes from `getBaseUrl()` in `utils/ServiceUtils.tsx`.

### 2. Hooks

Hooks wrap a service in `useMutation`/`useQuery` and expose the mutate function and its `error` (for example `useLogin` returns `login`, `loginError`). Global query defaults live in `App.tsx` (`staleTime: 0`, `gcTime: 0`); there is no global `onError` handler.

### 3. Components

- **Return-style services:** in `onSuccess`, check `response.error` and re-throw it as an `Error`, which is then handled by `onError`:

  ```ts
  onSuccess: (response) => {
    setUser(response.data);
    if (response.error) throw new Error((response.error as any).message);
    ...
  },
  onError: (error) => { setSubmitError(error.message); ... }
  ```

- **Form-level errors:** store the message in `submitError` state and render it at the top of the form as a heading with `id="form-error"`, then scroll to it:

  ```ts
  document.querySelector("#form-error")?.scrollIntoView();
  ```

- **Loading state:** a `showSpinner` boolean renders `<OverlaySpinner message="..." />`. Always reset it in both `onSuccess` and `onError`.

- **Toasts:** `react-hot-toast` is used for transient feedback (`toast.success(...)` / `toast.error(...)`, ~60 call sites). The single `<Toaster />` is configured in `App.tsx` (top-center, success 3s, error 6s, `role="alert"`, `aria-live="polite"`).

- **Special flows:** a specific error message can drive UI. For example `error.message === "unpaid"` closes the login modal and opens the bottom slide-in with type `"unpaid"`.

### 4. Field validation (react-hook-form)

- Forms use `useForm({ mode: "onBlur" })`.
- Rules are declared in the input component with `register(name, { required: { value, message }, pattern: {...}, minLength: {...} })`.
- The input reads its error with `accessNestedProperty(errors, registerName)` and shows it through `<FieldInputError message=... />`. The label gets an `error` class and the input gets `hasError`. See `docs/ui-inputs.md`.

### Routing errors

- `App.tsx` has a catch-all `<Route path="*" element={<div>Page not found</div>} />` (unstyled placeholder).
- There is **no React error boundary** and no `errorElement` on routes, so a render-time exception blanks the app.

## Testing notes

Unit tests mock services and assert on `field-error` / `form-error` test ids. Use `/* v8 ignore start */ ... /* v8 ignore stop */` only around untestable browser behavior such as `scrollIntoView`, as the existing code does.

## Known gaps

- No error boundary; no global `onError` for queries.
- Inconsistent service style (return vs throw).
- Server error responses depend on non-enumerable `message`; consider returning `{ message, data }` explicitly (the old line is commented out in `server.js`).
- No error monitoring or structured logging.
- 404 page is a bare `div`.
