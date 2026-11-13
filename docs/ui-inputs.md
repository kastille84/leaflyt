# UI Inputs

How form inputs are built. Forms use **react-hook-form** with small reusable input components in `client/src/ui/Form/`, built on the base primitives `ui/Input.tsx`, `ui/Select.tsx` and `ui/Button.tsx`.

## Building blocks

| Component | Purpose |
|---|---|
| `ui/Input.tsx` | Styled `<input>`. Takes a `hasError` prop; border is brand green normally and orange when `hasError`. |
| `ui/Select.tsx` | Styled `<select>`. Takes `options: {value,label}[]`, `value`, `onChange`, `hasError`. |
| `ui/Button.tsx` | Styled button with `size` (`small`/`medium`/`large`) and `variation` (`primary`, `secondary`, `secondary-outlined`, `danger`, `disabled`). Default is medium primary. |
| `ui/Form/Form.tsx` | Styled `<form>` wrapper. |
| `ui/Form/FormControl.tsx` | One field: flex column, label + input + error, with `gap` and bottom margin. Also holds shared styles for checkboxes and the tags input. Accepts `testId`. |
| `ui/Form/FormControlRow.tsx` | Puts several `FormControl`s side by side; collapses to a column at `max-width: 34em`. Also carries the Quill editor styles. |
| `ui/Form/FieldInputError.tsx` | `<small>` error text (orange, bold) with `data-testid="field-error"`. |
| `ui/Checkbox.tsx` | Unfinished placeholder. Checkboxes are plain `<input type="checkbox">` styled by `FormControl`. |

## Field components (`ui/Form/`)

One component per field type, each owning its label, validation rules and error display: `EmailInput`, `PasswordInput`, `FirstNameInput`, `LastNameInput`, `FullNameInput`, `PhoneInput`, `WebsiteInput`, `AddressInput` (Google Places autocomplete), `TypeOfUserInput`, `PlanInput`, `TitleInput`, `ContentInput` (Quill rich text), `CtaInput`, `CategoryInput`, `SubcategoryInput`, `TagsInput`, `LifespanInput`, `ColorInput`, `BorderRadiusInput`, `ImageInput` / `ImagePreview*`, `PlaceSearchInput`, `RadioGroupInput`, `SelectInput`, `AttestationInput`, `CommentsInput`, `FlaggedReasonInput`, `TemplatenameInput`, `FlyerDesignerInput`.

Search here first; reuse or extend an existing field before writing a new one.

## The standard field pattern

Every field component follows the same shape (see `EmailInput.tsx`, `PasswordInput.tsx`):

```tsx
export default function EmailInput({ register, registerName, errors }: {
  register: UseFormRegister<any>;
  registerName: string;                 // supports nested names like "individual.contact.email"
  errors: FieldErrors<FieldValues>;
}) {
  const errorObj = accessNestedProperty(errors, registerName);
  return (
    <FormControl testId="email-container">
      <StyledLabel htmlFor="email" className={`${errorObj && "error"}`}>Email</StyledLabel>
      <Input
        type="email"
        id="email"
        {...register(registerName, {
          required: { value: true, message: "Email is required" },
          pattern: { value: /.../i, message: "Invalid email address" },
        })}
        hasError={Boolean(errorObj)}
      />
      {errorObj && <FieldInputError message={errorObj?.message as string} />}
    </FormControl>
  );
}
```

Rules:
1. Props are `register`, `registerName` and `errors` (plus optional flags like `disabled`, `setValue`, `getValues` when needed). The parent form owns the `useForm` instance.
2. Use `accessNestedProperty` (`utils/GeneralUtils`) to read errors, because forms nest values by account type.
3. Validation rules and their messages live **inside the field component**, so every form that uses the field validates the same way.
4. Show an error three ways: label gets class `error` (orange), input gets `hasError`, and a `FieldInputError` renders the message.
5. Labels: `font-weight: 600`, brand-600 colour, orange-600 when in error. The label's `htmlFor` must match the input `id`.
6. Give the wrapper a `testId` such as `email-container`; tests rely on these.

## Form-level pattern

Reference: `ForgotPassword.tsx`, `LoginModal.tsx`, `SignupForm.tsx`.

```tsx
const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } =
  useForm({ mode: "onBlur" });

<form onSubmit={handleSubmit(onSubmit)}>
  {submitError && <StyledSubmitError as="h4" id="form-error">Error: {submitError}</StyledSubmitError>}
  <FormControlRow>
    <EmailInput register={register} registerName="email" errors={errors} />
    <FormControl>{/* placeholder */}</FormControl>
  </FormControlRow>
  <Button type="submit">Reset Password</Button>
  {showSpinner && <OverlaySpinner message="..." />}
</form>
```

- Validation mode is `onBlur`.
- Layout is rows: `FormControlRow` containing one or two `FormControl`s. An empty `<FormControl>` is used as a placeholder to keep a single field at half width.
- Submit with `Button type="submit"`; use the `size` and `variation` props instead of custom button CSS.
- Submission errors go in `submitError` state and render as `#form-error` (see `docs/error-handling.md`).
- Wrap long operations with `showSpinner` and `OverlaySpinner`.
- Some forms register extra hidden values, for example `register("addressObjToSave", { required: true })` in `AddressInput` when `shouldSaveAddressObj` is set.

## Special inputs

- **Address:** `AddressInput` uses `react-google-autocomplete` (`usePlacesAutocompleteService`, 800 ms debounce) and renders a prediction list; Tab selects the first prediction. Requires the Google Maps key from `keysBasedOnEnv()`.
- **Rich text:** `ContentInput` uses a Quill editor (styles in `FormControlRow`; error state via the `.quill.error` class).
- **Tags:** `TagsInput` uses a tag-pill input, styled by `.tag-input` rules in `FormControl`.
- **Images:** `ImageInput` / `ImagePreview` use the Cloudinary upload widget configured by `FILE_UPLOAD_OPTIONS` in `constants/index.ts` (limits depend on user level).
- **Password:** includes a Show/Hide toggle in the label row and a minimum of 8 characters.
- **Radio group:** `RadioGroupInput`.

## Accessibility notes

- Keep `label`/`id` pairs unique per page (several inputs use fixed ids like `email`, so avoid rendering two on one screen).
- Disabled inputs get a grey background via the global `*:disabled` rules.
- Error toasts use `role="alert"`.

## Adding a new input

1. Check `ui/Form/` for an existing field.
2. Copy the closest component, keep the `register` / `registerName` / `errors` props, and put the rules and messages inside it.
3. Build it from `Input` / `Select` / `FormControl` / `FieldInputError`; do not restyle from scratch.
4. Add a `testId` and a test in `client/tests/` mirroring the path.
