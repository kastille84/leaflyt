import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import PlansInputContainer from "../../../src/ui/Plan/PlansInputContainer";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useGetPlans from "../../../src/hooks/useGetPlans";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetPlans");

const plans = [
  { id: 3, name: "Grove", level: 3 },
  { id: 1, name: "Seed", level: 1 },
  { id: 2, name: "Sprout", level: 2 },
];

const setShowPlansModal = vi.fn();
const setCurrentFormOptions = vi.fn();

function Wrapper(props: {
  isUpgrade?: boolean;
  currentPlanId?: number;
  isAnyPaidPlan?: boolean;
}) {
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm();
  return (
    <PlansInputContainer
      register={register}
      setValue={setValue}
      getValues={getValues}
      clearErrors={clearErrors}
      errors={errors}
      {...props}
    />
  );
}

const optionLabels = () =>
  screen.getAllByRole("option").map((option) => option.textContent);

describe("PlansInputContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      showPlansModal: false,
      setShowPlansModal,
      setCurrentFormOptions,
    } as any);
    vi.mocked(useGetPlans).mockReturnValue({
      isLoading: false,
      plans: { data: plans },
      error: null,
    } as any);
  });

  it("should show a spinner while loading", () => {
    vi.mocked(useGetPlans).mockReturnValue({
      isLoading: true,
      plans: undefined,
      error: null,
    } as any);
    render(<Wrapper />);
    expect(screen.getByText("Getting Plans")).toBeInTheDocument();
  });

  it("should show an error message when plans fail to load", () => {
    vi.mocked(useGetPlans).mockReturnValue({
      isLoading: false,
      plans: undefined,
      error: new Error("boom"),
    } as any);
    render(<Wrapper />);
    expect(
      screen.getByText("Oops, could not get plans. Try again."),
    ).toBeInTheDocument();
  });

  it("should list every plan sorted by level by default", () => {
    render(<Wrapper />);
    expect(optionLabels()).toEqual(["Seed", "Sprout", "Grove"]);
  });

  it("should only list higher plans on upgrade", () => {
    render(<Wrapper isUpgrade currentPlanId={1} />);
    expect(optionLabels()).toEqual(["Sprout", "Grove"]);
  });

  it("should list paid plans except the current one", () => {
    render(<Wrapper isAnyPaidPlan currentPlanId={2} />);
    expect(optionLabels()).toEqual(["Grove"]);
  });

  it("should open the plans modal with the form options", async () => {
    render(<Wrapper />);
    await userEvent.click(
      screen.getByRole("button", { name: "View All Plans" }),
    );
    expect(setCurrentFormOptions).toHaveBeenCalledWith({
      setValue: expect.any(Function),
      getValues: expect.any(Function),
      clearErrors: expect.any(Function),
    });
    expect(setShowPlansModal).toHaveBeenCalledWith(true);
  });

  it("should close the plans modal when it is already open", async () => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...mockUseGlobalContextReturnObj,
      showPlansModal: true,
      setShowPlansModal,
      setCurrentFormOptions,
    } as any);
    render(<Wrapper />);
    await userEvent.click(
      screen.getByRole("button", { name: "View All Plans" }),
    );
    expect(setShowPlansModal).toHaveBeenCalledWith(false);
  });
});
