import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import BoardWelcomeModal from "../../../src/ui/Modals/BoardWelcomeModal";
import DcmaModal from "../../../src/ui/Modals/DcmaModal";
import MerchantDisclaimerModal from "../../../src/ui/Modals/MerchantDisclaimerModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

function mockContext(overrides: Record<string, unknown>) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    ...overrides,
  }));
}

describe("BoardWelcomeModal", () => {
  const setShowBoardWelcomeModal = vi.fn();
  const setBottomSlideInType = vi.fn();
  const setIsOpenBottomSlideIn = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    mockContext({
      showBoardWelcomeModal: true,
      setShowBoardWelcomeModal,
      setBottomSlideInType,
      setIsOpenBottomSlideIn,
      selectedPlace: { displayName: { text: "Joe's Diner" } },
    });
  });

  it("should show the place name", () => {
    render(<BoardWelcomeModal />);
    expect(screen.getByText("Joe's Diner")).toBeInTheDocument();
  });

  it("should fall back to a generic title without a place", () => {
    mockContext({ showBoardWelcomeModal: true, selectedPlace: null });
    render(<BoardWelcomeModal />);
    expect(screen.getByText("This Location")).toBeInTheDocument();
  });

  it("should render nothing when closed", () => {
    mockContext({ showBoardWelcomeModal: false });
    render(<BoardWelcomeModal />);
    expect(screen.queryByText("Welcome, Neighbor!")).not.toBeInTheDocument();
  });

  it("should close on Close", async () => {
    render(<BoardWelcomeModal />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(setShowBoardWelcomeModal).toHaveBeenCalledWith(false);
  });

  it("should open the signup slide-in and close on Create a Free Account", async () => {
    render(<BoardWelcomeModal />);
    await userEvent.click(
      screen.getByRole("button", { name: "Create a Free Account" }),
    );
    expect(setBottomSlideInType).toHaveBeenCalledWith("signup");
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    expect(setShowBoardWelcomeModal).toHaveBeenCalledWith(false);
  });
});

describe("DcmaModal", () => {
  const setShowDcmaModal = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    mockContext({ showDcmaModal: true, setShowDcmaModal });
  });

  it("should render the policy", () => {
    render(<DcmaModal />);
    expect(screen.getByText("DMCA COPYRIGHT POLICY")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "support@leaflit.us" }),
    ).toBeInTheDocument();
  });

  it("should close on Close", async () => {
    render(<DcmaModal />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(setShowDcmaModal).toHaveBeenCalledWith(false);
  });

  it("should render nothing when closed", () => {
    mockContext({ showDcmaModal: false });
    render(<DcmaModal />);
    expect(screen.queryByText("DMCA COPYRIGHT POLICY")).not.toBeInTheDocument();
  });
});

describe("MerchantDisclaimerModal", () => {
  const setShowMerchantDisclaimerModal = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    mockContext({
      showMerchantDisclaimerModal: true,
      setShowMerchantDisclaimerModal,
    });
  });

  it("should render the disclaimer", () => {
    render(<MerchantDisclaimerModal />);
    expect(screen.getByText("Merchant Disclaimer")).toBeInTheDocument();
  });

  it("should close on Close", async () => {
    render(<MerchantDisclaimerModal />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(setShowMerchantDisclaimerModal).toHaveBeenCalledWith(false);
  });

  it("should render nothing when closed", () => {
    mockContext({ showMerchantDisclaimerModal: false });
    render(<MerchantDisclaimerModal />);
    expect(screen.queryByText("Merchant Disclaimer")).not.toBeInTheDocument();
  });
});
