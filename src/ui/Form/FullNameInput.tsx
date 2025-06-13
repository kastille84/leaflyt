import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";
export default function FullNameInput({
  register,
  registerName,
}: {
  register: UseFormRegister<any>;
  registerName: string;
}) {
  return (
    <FormControl>
      <label htmlFor="name">Business Name</label>
      <Input
        type="text"
        id="name"
        {...register(registerName, {
          required: true,
        })}
      />
    </FormControl>
  );
}
