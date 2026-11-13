import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import EditFlyerModal from "../../../src/ui/Modals/EditFlyerModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

describe("EditFlyerModal", () => {
  const setShowEditFlyerModal = vi.fn();
  const setIsOpenFlyerDrawer = vi.fn();
  const setDrawerAction = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showEditFlyerModal: true,
      setShowEditFlyerModal,
      setIsOpenFlyerDrawer,
      setDrawerAction,
    }));
  });

  it("should explain the template warning", () => {
    render(<EditFlyerModal />);
    expect(
      screen.getByText('This flyer was created using a "Template"'),
    ).toBeInTheDocument();
  });

  it("should open the drawer to edit the template", async () => {
    render(<EditFlyerModal />);
    await userEvent.click(
      screen.getByRole("button", { name: "Edit Template" }),
    );
    expect(setShowEditFlyerModal).toHaveBeenCalledWith(false);
    expect(setIsOpenFlyerDrawer).toHaveBeenCalledWith(true);
    expect(setDrawerAction).toHaveBeenCalledWith("editTemplate");
  });

  it("should open the drawer to edit the flyer", async () => {
    render(<EditFlyerModal />);
    await userEvent.click(screen.getByRole("button", { name: "Edit Flyer" }));
    expect(setShowEditFlyerModal).toHaveBeenCalledWith(false);
    expect(setIsOpenFlyerDrawer).toHaveBeenCalledWith(true);
    expect(setDrawerAction).toHaveBeenCalledWith("edit");
  });

  it("should close the drawer on Cancel", async () => {
    render(<EditFlyerModal />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(setShowEditFlyerModal).toHaveBeenCalledWith(false);
    expect(setIsOpenFlyerDrawer).toHaveBeenCalledWith(false);
    expect(setDrawerAction).toHaveBeenCalledWith(null);
  });
});
