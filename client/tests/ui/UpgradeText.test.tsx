import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import UpgradeText from "../../src/ui/UpgradeText";
import * as GlobalContext from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

vi.mock("../../src/context/GlobalContext");

describe("UpgradeText", () => {
  const setBottomSlideInType = vi.fn();
  const setIsOpenBottomSlideIn = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setBottomSlideInType,
      setIsOpenBottomSlideIn,
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the default text and button text", () => {
    render(<UpgradeText />);
    expect(
      screen.getByText("Upgrade to get more features")
    ).toBeInTheDocument();
    expect(screen.getByText(/Learn more/)).toBeInTheDocument();
  });

  it("should render custom text and button text", () => {
    render(<UpgradeText text="Custom" btnText="Go" />);
    expect(screen.getByText(/Custom/)).toBeInTheDocument();
    expect(screen.getByText(/Go/)).toBeInTheDocument();
  });

  it("should render children instead of text", () => {
    render(
      <UpgradeText text="ignored">
        <span>child text</span>
      </UpgradeText>
    );
    expect(screen.getByText("child text")).toBeInTheDocument();
    expect(screen.queryByText(/ignored/)).not.toBeInTheDocument();
  });

  it("should open the bottom slide-in with the default type", async () => {
    render(<UpgradeText />);
    await userEvent.setup().click(screen.getByText(/Learn more/));
    expect(setBottomSlideInType).toHaveBeenCalledWith("upgrade");
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
  });

  it("should open the bottom slide-in with a custom type from children", async () => {
    render(
      <UpgradeText type="signup">
        <span>child</span>
      </UpgradeText>
    );
    await userEvent.setup().click(screen.getByText(/Learn more/));
    expect(setBottomSlideInType).toHaveBeenCalledWith("signup");
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
  });
});
