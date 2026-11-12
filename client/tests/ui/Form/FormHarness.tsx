import { FieldValues, UseFormReturn, useForm } from "react-hook-form";

export default function FormHarness({
  children,
  onSubmit = () => {},
  defaultValues,
}: {
  children: (form: UseFormReturn<FieldValues>) => React.ReactNode;
  onSubmit?: (data: FieldValues) => void;
  defaultValues?: FieldValues;
}) {
  const form = useForm({ defaultValues });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {children(form)}
      <button type="submit">submit</button>
    </form>
  );
}
