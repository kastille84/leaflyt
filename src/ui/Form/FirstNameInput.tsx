import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";

export default function FirstNameInput({
  register,
  registerName,
}: {
  register: UseFormRegister<any>;
  registerName: string;
}) {
  return (
    <FormControl>
      <label htmlFor="first-name">First Name</label>
      <Input
        type="text"
        id="first-name"
        {...register(registerName, {
          required: { value: true, message: "First Name is required" },
        })}
      />
    </FormControl>
  );
}
