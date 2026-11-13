import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AttestationInput from "../../../src/ui/Form/AttestationInput";
import BorderRadiusInput from "../../../src/ui/Form/BorderRadiusInput";
import FlaggedReasonInput from "../../../src/ui/Form/FlaggedReasonInput";
import FlyerDesignerInput from "../../../src/ui/Form/FlyerDesignerInput";
import RadioGroupInput from "../../../src/ui/Form/RadioGroupInput";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import FormHarness from "./FormHarness";
import {
  QueryClientProviderWrapperWithBrowserRouter,
  getBorderRadius,
  getFlyerDesigner,
  getInput,
} from "../../test-utils";

vi.mock("../../../src/context/GlobalContext");

describe("AttestationInput", () => {
  it("should render a checked checkbox with the attestation text", () => {
    render(
      <FormHarness>
        {({ register }) => <AttestationInput register={register} />}
      </FormHarness>,
      { wrapper: QueryClientProviderWrapperWithBrowserRouter() },
    );
    const { input } = getInput("attestation");
    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).toBeChecked();
    expect(screen.getByText(/I attest that I have read/)).toBeInTheDocument();
  });
});

describe("BorderRadiusInput", () => {
  it("should switch the corner being edited and register each slider", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness
        onSubmit={onSubmit}
        defaultValues={{ borderTopLeftRadius: "4", borderTopRightRadius: "8" }}
      >
        {({ register, getValues }) => (
          <BorderRadiusInput register={register} getValues={getValues} />
        )}
      </FormHarness>,
    );
    const { label, select, input } = getBorderRadius("border-radius");
    expect(label).toHaveTextContent("Round/Sharpen Corners");
    expect(select.options).toHaveLength(4);
    expect(select).toHaveValue("borderTopLeftRadius");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "20");
    expect(screen.getByText("4px")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.selectOptions(select, "borderTopRightRadius");
    expect(select).toHaveValue("borderTopRightRadius");
    expect(screen.getByText("8px")).toBeInTheDocument();
  });
});

describe("FlaggedReasonInput", () => {
  it("should render a textarea labelled by the register name and submit", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <FlaggedReasonInput
            register={register}
            registerName="reason"
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const container = screen.getByTestId("reason-container");
    expect(container.querySelector("label")).toHaveTextContent("reason");
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    const user = userEvent.setup();
    await user.type(textarea, "spam");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ reason: "spam" });
  });

  it("should show a required error when empty", async () => {
    render(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <FlaggedReasonInput
            register={register}
            registerName="reason"
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    await userEvent.setup().click(screen.getByText("submit"));
    expect(await screen.findByText("reason is required")).toBeInTheDocument();
    expect(
      screen.getByTestId("reason-container").querySelector("label"),
    ).toHaveClass("error");
  });
});

describe("FlyerDesignerInput", () => {
  const setIsOpenBottomSlideIn = vi.fn();
  const setBottomSlideInType = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setIsOpenBottomSlideIn,
      setBottomSlideInType,
    }));
  });
  afterEach(() => vi.clearAllMocks());

  it("should open the flyer designer slide-in when clicked", async () => {
    render(<FlyerDesignerInput canUpgrade={false} />);
    const { label, button, upgrade } = getFlyerDesigner("flyerDesigner");
    expect(label).toHaveTextContent("Flyer Designer");
    expect(upgrade).toBeNull();
    expect(button).toBeEnabled();
    await userEvent.setup().click(button);
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    expect(setBottomSlideInType).toHaveBeenCalledWith("flyerDesigner");
  });

  it("should disable the button and show upgrade text when canUpgrade", () => {
    render(<FlyerDesignerInput canUpgrade />);
    const { button, upgrade } = getFlyerDesigner("flyerDesigner");
    expect(button).toBeDisabled();
    expect(upgrade).toBeInTheDocument();
    expect(
      screen.getByText("Feature available when you upgrade."),
    ).toBeInTheDocument();
  });
});

describe("RadioGroupInput", () => {
  const options = [
    { value: "offer" as const, label: "Offer" },
    { value: "ask" as const, label: "Ask" },
    { value: "none" as const, label: "None" },
  ];

  it("should render a radio per option and submit the chosen one", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register }) => (
          <RadioGroupInput
            groupLabel="Type"
            register={register}
            registerName="kind"
            options={options}
          />
        )}
      </FormHarness>,
    );
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Ask"));
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ kind: "ask" });
  });
});
