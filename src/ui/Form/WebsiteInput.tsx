import { UseFormRegister } from "react-hook-form";
import Input from "../Input";
import FormControl from "./FormControl";

export default function WebsiteInput({
  register,
  registerName,
}: {
  register: UseFormRegister<any>;
  registerName: string;
}) {
  return (
    <FormControl>
      <label htmlFor="website">Website</label>
      <Input
        type="url"
        id="website"
        {...register(registerName, {
          required: true,
        })}
      />
    </FormControl>
  );
}
