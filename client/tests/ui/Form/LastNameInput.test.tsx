import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import LastNameInput from "../../../src/ui/Form/LastNameInput";
import FormHarness from "./FormHarness";
import { getInput, getFieldError } from "../../test-utils";

describe("LastNameInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <LastNameInput register={register} registerName="nested.field" errors={errors}x />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should render the label and input", () => {
    setup();
    const { label, input } = getInput("lastName");
    expect(label).toHaveTextContent("Last Name");
    expect(input).toHaveAttribute("id", "last-name");
    expect(label).toHaveAttribute("for", "last-name");
  });

  it("should show a required error and mark the field invalid", async () => {
    const onSubmit = setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("lastName").error).toHaveTextContent("Last Name is required");
    expect(getInput("lastName").label).toHaveClass("error");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit the nested value once filled", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("lastName").input, "Lee");
    await user.click(screen.getByText("submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ nested: { field: "Lee" } });
  });
});
