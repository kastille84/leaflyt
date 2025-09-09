import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CloseSlideInModal from "../../../src/ui/Modals/CloseSlideInModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

// mocks
vi.mock("../../../src/context/GlobalContext");

const user = userEvent.setup();

describe("CloseSlideInModal", () => {
  const setIsOpenFlyerDrawerMockFn = vi.fn();
  const setDrawerActionMockFn = vi.fn();
  const setShowCloseSlideInModalMockFn = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setIsOpenFlyerDrawer: setIsOpenFlyerDrawerMockFn,
      setDrawerAction: setDrawerActionMockFn,
      setShowCloseSlideInModal: setShowCloseSlideInModalMockFn,
      showCloseSlideInModal: true,
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("should render CloseSlideInModal and stay", async () => {
    render(<CloseSlideInModal />);
    const closeSlideInModal = screen.getByTestId("close-slide-in-modal");
    expect(closeSlideInModal).toBeTruthy();
    const stayButton = screen.getByRole("button", { name: "Stay" });
    expect(stayButton).toBeTruthy();
    await user.click(stayButton);
    await waitFor(() => {
      expect(setShowCloseSlideInModalMockFn).toHaveBeenCalledWith(false);
    });
  });
  it("should render CloseSlideInModal and leave", async () => {
    render(<CloseSlideInModal />);
    const closeSlideInModal = screen.getByTestId("close-slide-in-modal");
    expect(closeSlideInModal).toBeTruthy();
    const leaveButton = screen.getByRole("button", { name: "Leave" });
    expect(leaveButton).toBeTruthy();
    await user.click(leaveButton);
    await waitFor(() => {
      expect(setShowCloseSlideInModalMockFn).toHaveBeenCalledWith(false);
    });
    await waitFor(() => {
      expect(setIsOpenFlyerDrawerMockFn).toHaveBeenCalledWith(false);
    });
    await waitFor(() => {
      expect(setDrawerActionMockFn).toHaveBeenCalledWith(null);
    });
  });
});
