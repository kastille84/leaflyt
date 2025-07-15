import FormControl from "./FormControl";
import Input from "../Input";
import type { RegisterReturn } from "react-hook-form";

export default function AttestationInput({
  register,
}: {
  register: RegisterReturn<any>;
}) {
  return (
    <FormControl
      className="attestation-container"
      testId="attestation-container"
    >
      <div className="attestation">
        <Input
          type="checkbox"
          id="attestation"
          checked
          {...register("attestation", { required: true })}
        />
        <p>
          Anonymous posting has a higher chance of getting flagged due to their
          uncontrolled nature.
          <br />
          Leaflyt relies on the community to help flag inappropiate content.
          <br />
          You agree to "Post Responsibly".
        </p>
      </div>
    </FormControl>
  );
}
