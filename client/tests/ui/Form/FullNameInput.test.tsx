import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FullNameInput from "../../../src/ui/Form/FullNameInput";
import FormHarness from "./FormHarness";
import { getInput, getFieldError } from "../../test-utils";

describe("FullNameInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <FullNameInput
            register={register}
            registerName="org.name"
            name="Business"
            errors={errors}
          />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should build the label from the name prop", () => {
    setup();
    expect(getInput("fullName").label).toHaveTextContent("Business Name");
  });

  it("should require a value using the name prop in the message", async () => {
    setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("fullName").error).toHaveTextContent(
      "Business Name is required"
    );
    expect(getInput("fullName").label).toHaveClass("error");
  });

  it("should submit the nested value", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("fullName").input, "Acme");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ org: { name: "Acme" } });
  });

  it("should enforce textLimit when provided", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <FullNameInput
            register={register}
            registerName="name"
            name="Business"
            errors={errors}
            textLimit={5}
          />
        )}
      </FormHarness>
    );
    const user = userEvent.setup();
    await user.type(getInput("fullName").input, "toolongname");
    await user.click(screen.getByText("submit"));
    expect(getFieldError("fullName").error).toHaveTextContent(
      "Business Name must be less than 5 characters"
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
