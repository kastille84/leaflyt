import FormControl from "./FormControl";
import Input from "../Input";
import type { UseFormRegister } from "react-hook-form";
import { Link } from "react-router-dom";

export default function AttestationInput({
  register,
}: {
  register: UseFormRegister<any>;
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
          As an anonymous user, I attest that I have read and agree to the terms
          of use, privacy policy, and community guidelines.
        </p>
      </div>
    </FormControl>
  );
}
