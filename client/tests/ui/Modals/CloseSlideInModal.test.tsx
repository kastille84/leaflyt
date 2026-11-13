import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CloseSlideInModal from "../../../src/ui/Modals/CloseSlideInModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import * as cloudinary from "../../../src/services/cloudinary";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/services/cloudinary.ts");

const user = userEvent.setup();

describe("CloseSlideInModal", () => {
  const setIsOpenFlyerDrawerMockFn = vi.fn();
  const setDrawerActionMockFn = vi.fn();
  const setShowCloseSlideInModalMockFn = vi.fn();
  const getValuesMockFn = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setIsOpenFlyerDrawer: setIsOpenFlyerDrawerMockFn,
      setDrawerAction: setDrawerActionMockFn,
      setShowCloseSlideInModal: setShowCloseSlideInModalMockFn,
      showCloseSlideInModal: true,
      currentFormOptions: {
        getValues: getValuesMockFn,
      },
      selectedFlyer: mockCreatedFlyer,
    }));
    vi.mocked(cloudinary.deleteFileOverTime).mockImplementation(() =>
      Promise.resolve()
    );
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
    getValuesMockFn.mockReturnValue([]);
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
  describe("leaving with different state", () => {
    const setSelectedFlyerMockFn = vi.fn();
    const setSelectedTemplateMockFn = vi.fn();
    function mockContext(overrides: Record<string, unknown>) {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        setIsOpenFlyerDrawer: setIsOpenFlyerDrawerMockFn,
        setDrawerAction: setDrawerActionMockFn,
        setShowCloseSlideInModal: setShowCloseSlideInModalMockFn,
        setSelectedFlyer: setSelectedFlyerMockFn,
        setSelectedTemplate: setSelectedTemplateMockFn,
        showCloseSlideInModal: true,
        currentFormOptions: { getValues: getValuesMockFn },
        selectedFlyer: null,
        selectedTemplate: null,
        ...overrides,
      }));
    }
    beforeEach(() => {
      getValuesMockFn.mockReturnValue([]);
    });

    it("should clear the selected flyer and template", async () => {
      mockContext({
        selectedFlyer: mockCreatedFlyer,
        selectedTemplate: { id: 1 },
      });
      render(<CloseSlideInModal />);
      await user.click(screen.getByRole("button", { name: "Leave" }));
      await waitFor(() => {
        expect(setSelectedFlyerMockFn).toHaveBeenCalledWith(null);
      });
      expect(setSelectedTemplateMockFn).toHaveBeenCalledWith(null);
    });

    it("should not clear the selection when nothing is selected", async () => {
      mockContext({});
      render(<CloseSlideInModal />);
      await user.click(screen.getByRole("button", { name: "Leave" }));
      await waitFor(() => {
        expect(setShowCloseSlideInModalMockFn).toHaveBeenCalledWith(false);
      });
      expect(setSelectedFlyerMockFn).not.toHaveBeenCalled();
      expect(setSelectedTemplateMockFn).not.toHaveBeenCalled();
    });

    it("should keep uploaded assets when the user is logged in", async () => {
      getValuesMockFn.mockReturnValue(["https://google.com"]);
      mockContext({ user: { id: "u1" } });
      render(<CloseSlideInModal />);
      await user.click(screen.getByRole("button", { name: "Leave" }));
      await waitFor(() => {
        expect(setShowCloseSlideInModalMockFn).toHaveBeenCalledWith(false);
      });
      expect(cloudinary.deleteFileOverTime).not.toHaveBeenCalled();
    });
  });
  it("should delete any assets that were uploaded while not logged in", async () => {
    getValuesMockFn.mockReturnValue(["https://google.com"]);
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
