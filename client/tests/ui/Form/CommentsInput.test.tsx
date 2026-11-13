import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CommentsInput from "../../../src/ui/Form/CommentsInput";
import FormHarness from "./FormHarness";
import { getInput } from "../../test-utils";

describe("CommentsInput", () => {
  it("should render the explanation and an unchecked checkbox", () => {
    render(
      <FormHarness>
        {({ register }) => <CommentsInput register={register} />}
      </FormHarness>
    );
    expect(screen.getByText(/Add Comments Section/)).toBeInTheDocument();
    expect(getInput("comments-input").input).not.toBeChecked();
  });

  it("should submit hasComments as the checkbox state", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register }) => <CommentsInput register={register} />}
      </FormHarness>
    );
    const user = userEvent.setup();
    await user.click(getInput("comments-input").input);
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ hasComments: true });
  });
});
