import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CtaInput from "../../../src/ui/Form/CtaInput";
import FormHarness from "./FormHarness";

describe("CtaInput", () => {
  function setup(onSubmit = vi.fn()) {
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, watch, setValue, control, formState: { errors } }) => (
          <CtaInput
            register={register}
            watch={watch}
            setValue={setValue}
            control={control}
            errors={errors as any}
          />
        )}
      </FormHarness>
    );
    return onSubmit;
  }

  function getInstructionsEditor() {
    return screen
      .getByTestId("cta-input-container")
      .querySelector(".ql-editor") as HTMLDivElement;
  }

  it("should render the radio options and no detail fields initially", () => {
    setup();
    expect(screen.getByTestId("cta-container")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.queryByTestId("cta-input-container")).not.toBeInTheDocument();
  });

  it("should show headline and instructions after choosing an offer", async () => {
    setup();
    await userEvent.setup().click(screen.getByLabelText(/Offer/));
    expect(screen.getByTestId("cta-input-container")).toBeInTheDocument();
    expect(screen.getByLabelText("Headline")).toBeInTheDocument();
    expect(screen.getByText("Instructions")).toBeInTheDocument();
  });

  it("should require headline and instructions", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/Ask/));
    await user.click(screen.getByText("submit"));
    expect(screen.getByText("Headline is required")).toBeInTheDocument();
    expect(screen.getByText("Instructions is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should limit the headline to 75 characters", async () => {
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/Offer/));
    await user.click(screen.getByLabelText("Headline"));
    await user.paste("a".repeat(76));
    await user.click(screen.getByText("submit"));
    expect(
      screen.getByText("Headline must be less than 75 chars")
    ).toBeInTheDocument();
  });

  it("should submit valid offer details", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/Offer/));
    await user.type(screen.getByLabelText("Headline"), "BOGO");
    await user.click(getInstructionsEditor());
    await user.keyboard("Show this flyer");
    await user.click(screen.getByText("submit"));
    const data = onSubmit.mock.calls[0][0].callToAction;
    expect(data.ctaType).toBe("offer");
    expect(data.headline).toBe("BOGO");
    expect(data.instructions).toContain("Show this flyer");
  });

  it("should clear the details when switching to no call to action", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/Offer/));
    await user.type(screen.getByLabelText("Headline"), "BOGO");
    await user.click(screen.getByLabelText(/No Call To Action/));
    expect(screen.queryByTestId("cta-input-container")).not.toBeInTheDocument();
    await user.click(screen.getByText("submit"));
    const data = onSubmit.mock.calls[0][0].callToAction;
    expect(data.ctaType).toBe("none");
    expect(data.headline).toBe("");
  });

  it("should treat emptied instructions as missing", async () => {
    const onSubmit = setup();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/Offer/));
    await user.type(screen.getByLabelText("Headline"), "BOGO");
    const editor = getInstructionsEditor();
    await user.click(editor);
    await user.keyboard("a");
    editor.innerHTML = "<p><br></p>";
    await new Promise((resolve) => setTimeout(resolve, 50));
    await user.click(screen.getByText("submit"));
    expect(screen.getByText("Instructions is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
