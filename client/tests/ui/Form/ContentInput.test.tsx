import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ContentInput from "../../../src/ui/Form/ContentInput";
import FormHarness from "./FormHarness";
import { getQuill, getFieldError } from "../../test-utils";

describe("ContentInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ control, formState: { errors } }) => (
          <ContentInput control={control} errors={errors} />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  it("should render the label and editor", () => {
    setup();
    const { label, quill } = getQuill();
    expect(label).toHaveTextContent("Content");
    expect(quill).toBeInTheDocument();
  });

  it("should require content", async () => {
    const onSubmit = setup();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(getFieldError("content").error).toHaveTextContent(
      "Content is required"
    );
    expect(getQuill().label).toHaveClass("error");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit typed content", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.click(getQuill().quill);
    await user.keyboard("Hello");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0].content).toContain("Hello");
  });

  it("should treat an emptied editor as missing content", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    const editor = getQuill().quill;
    await user.click(editor);
    await user.keyboard("a");
    editor.innerHTML = "<p><br></p>";
    await new Promise((resolve) => setTimeout(resolve, 50));
    await user.click(screen.getByText("submit"));
    expect(getFieldError("content").error).toHaveTextContent(
      "Content is required"
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
