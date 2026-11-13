import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TemplateNameInput from "../../../src/ui/Form/TemplatenameInput";
import FormHarness from "./FormHarness";
import { getInput, getFieldError } from "../../test-utils";

describe("TemplatenameInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <TemplateNameInput register={register} registerName="nested.field" errors={errors} name="Flyer" />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should render the label and input", () => {
    setup();
    const { label, input } = getInput("templateName");
    expect(label).toHaveTextContent("Flyer Name");
    expect(input).toHaveAttribute("id", "name");
    expect(label).toHaveAttribute("for", "name");
  });

  it("should show a required error and mark the field invalid", async () => {
    const onSubmit = setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("templateName").error).toHaveTextContent("Flyer Name is required");
    expect(getInput("templateName").label).toHaveClass("error");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit the nested value once filled", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("templateName").input, "Promo");
    await user.click(screen.getByText("submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ nested: { field: "Promo" } });
  });
});
