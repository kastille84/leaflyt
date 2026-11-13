import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TermsModal from "../../../src/ui/Modals/TermsModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

describe("TermsModal", () => {
  const setShowTermsModal = vi.fn();
  const setTermsModalType = vi.fn();
  function mockContext(
    termsModalType: "terms" | "privacy" | "guidelines" | null,
  ) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showTermsModal: true,
      setShowTermsModal,
      setTermsModalType,
      termsModalType,
    }));
  }
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["terms", "TERMS OF USE FOR LEAFLIT"],
    ["privacy", "PRIVACY POLICY FOR LEAFLIT"],
    ["guidelines", "LEAFLIT COMMUNITY GUIDELINES"],
  ] as const)("should render the %s document", (type, heading) => {
    mockContext(type);
    render(<TermsModal />);
    expect(screen.getByText(heading)).toBeInTheDocument();
  });

  it("should render no document without a type", () => {
    mockContext(null);
    render(<TermsModal />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("should close and reset the type on Close", async () => {
    mockContext("terms");
    render(<TermsModal />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(setShowTermsModal).toHaveBeenCalledWith(false);
    expect(setTermsModalType).toHaveBeenCalledWith(null);
  });
});
