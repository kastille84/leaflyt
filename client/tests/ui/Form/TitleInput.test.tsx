import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TitleInput from "../../../src/ui/Form/TitleInput";
import FormHarness from "./FormHarness";
import { getInput, getFieldError } from "../../test-utils";

describe("TitleInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <TitleInput register={register} errors={errors} />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should render the label and placeholder", () => {
    setup();
    const { label, input } = getInput("title");
    expect(label).toHaveTextContent("Title");
    expect(input).toHaveAttribute("placeholder", "Something Eye Catching...");
  });

  it("should require a title", async () => {
    const onSubmit = setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("title").error).toHaveTextContent("Title is required");
    expect(getInput("title").label).toHaveClass("error");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit the title", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.type(getInput("title").input, "Sale");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ title: "Sale" });
  });
});
