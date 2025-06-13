import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";

export default function EmailInput({
  register,
  registerName,
}: {
  register: UseFormRegister<any>;
  registerName: string;
}) {
  return (
    <FormControl>
      <label htmlFor="email">Email</label>
      <Input
        type="email"
        id="email"
        {...register(registerName, {
          required: true,
        })}
      />
    </FormControl>
  );
}
