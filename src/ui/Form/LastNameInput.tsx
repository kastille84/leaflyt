import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";
export default function LastNameInput({
  register,
  registerName,
}: {
  register: UseFormRegister<any>;
  registerName: string;
}) {
  return (
    <FormControl>
      <label htmlFor="last-name">Last Name</label>
      <Input
        type="text"
        id="last-name"
        {...register(registerName, {
          required: true,
        })}
      />
    </FormControl>
  );
}
