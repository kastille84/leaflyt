import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";
export default function FullNameInput({
  register,
  registerName,
  name,
}: {
  register: UseFormRegister<any>;
  registerName: string;
  name: string;
}) {
  return (
    <FormControl>
      <label htmlFor="name">{name} Name</label>
      <Input
        type="text"
        id="name"
        {...register(registerName, {
          required: { value: true, message: `${name} Name is required` },
        })}
      />
    </FormControl>
  );
}
