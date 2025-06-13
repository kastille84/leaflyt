import Input from "../Input";
import { UseFormRegister } from "react-hook-form";
import FormControl from "./FormControl";

export default function TitleInput({
  register,
}: {
  register: UseFormRegister<any>;
}) {
  return (
    <FormControl className="title">
      <label htmlFor="title">Title</label>
      <Input
        type="text"
        id="title"
        {...register("title", {
          required: { value: true, message: "Title is required" },
        })}
      />
    </FormControl>
  );
}
