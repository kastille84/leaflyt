import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import EmailInput from "../../../src/ui/Form/EmailInput";
import FormHarness from "./FormHarness";
import { getInput, getFieldError } from "../../test-utils";

describe("EmailInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <EmailInput register={register} registerName="a.email" errors={errors} />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should render an email input with a label", () => {
    setup();
    const { label, input } = getInput("email");
    expect(label).toHaveTextContent("Email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("should require a value", async () => {
    setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("email").error).toHaveTextContent("Email is required");
    expect(getInput("email").label).toHaveClass("error");
  });

  it("should reject an invalid address", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("email").input, "nope@x");
    await user.click(screen.getByText("submit"));
    expect(getFieldError("email").error).toHaveTextContent(
      "Invalid email address"
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit a valid address", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("email").input, "me@site.com");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ a: { email: "me@site.com" } });
  });
});
