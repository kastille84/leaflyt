import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";

export default function PhoneInput({
  register,
  registerName,
}: {
  register: UseFormRegister<any>;
  registerName: string;
}) {
  return (
    <FormControl>
      <label htmlFor="phone">Phone</label>
      <Input
        type="tel"
        id="phone"
        {...register(registerName, {
          required: { value: true, message: "Phone is required" },
        })}
      />
    </FormControl>
  );
}
