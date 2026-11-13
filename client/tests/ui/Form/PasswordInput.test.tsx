import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PasswordInput from "../../../src/ui/Form/PasswordInput";
import FormHarness from "./FormHarness";
import { getInput, getFieldError } from "../../test-utils";

describe("PasswordInput", () => {
  function setup(shouldShow?: boolean, onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <PasswordInput
            register={register}
            registerName="password"
            errors={errors}
            shouldShow={shouldShow}
          />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should hide the password by default and toggle it", async () => {
    setup();
    const user = userEvent.setup();
    expect(getInput("password").input).toHaveAttribute("type", "password");
    await user.click(screen.getByText("Show"));
    expect(getInput("password").input).toHaveAttribute("type", "text");
    await user.click(screen.getByText("Hide"));
    expect(getInput("password").input).toHaveAttribute("type", "password");
  });

  it("should start visible when shouldShow is true", () => {
    setup(true);
    expect(getInput("password").input).toHaveAttribute("type", "text");
    expect(screen.getByText("Hide")).toBeInTheDocument();
  });

  it("should require a password", async () => {
    setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("password").error).toHaveTextContent(
      "Password is required"
    );
    expect(getInput("password").label).toHaveClass("error");
  });

  it("should enforce a minimum length of 8", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("password").input, "short");
    await user.click(screen.getByText("submit"));
    expect(getFieldError("password").error).toHaveTextContent(
      "Password must be at least 8 characters"
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit a valid password", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("password").input, "longenough1");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ password: "longenough1" });
  });
});
