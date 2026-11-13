import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TagsInput from "../../../src/ui/Form/TagsInput";
import FormHarness from "./FormHarness";

describe("TagsInput", () => {
  it("should render the label and a tag box", () => {
    render(
      <FormHarness>
        {({ control, getValues, formState: { errors } }) => (
          <TagsInput control={control} errors={errors} getValues={getValues} />
        )}
      </FormHarness>,
    );
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Add tags...")).toBeInTheDocument();
  });

  it("should add a tag on Enter and submit it", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ control, getValues, formState: { errors } }) => (
          <TagsInput control={control} errors={errors} getValues={getValues} />
        )}
      </FormHarness>,
    );
    const user = userEvent.setup();
    const input = screen
      .getByTestId("tags-container")
      .querySelector("input") as HTMLInputElement;
    await user.type(input, "music{Enter}");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0].tags).toContain("music");
  });

  it("should flag the label when there is a tags error", () => {
    render(
      <FormHarness>
        {({ control, getValues }) => (
          <TagsInput
            control={control}
            errors={{ tags: { type: "x", message: "bad" } }}
            getValues={getValues}
          />
        )}
      </FormHarness>,
    );
    expect(screen.getByText("Tags")).toHaveClass("error");
  });
});
