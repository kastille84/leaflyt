import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CreateFlyerButton from "../../../src/ui/Flyer/CreateFlyerButton";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

describe("CreateFlyerButton", () => {
  const setIsOpenFlyerDrawer = vi.fn();
  const setDrawerAction = vi.fn();
  const setIsOpenBottomSlideIn = vi.fn();
  const setBottomSlideInType = vi.fn();

  function mockContext(user: any = null) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user,
      setIsOpenFlyerDrawer,
      setDrawerAction,
      setIsOpenBottomSlideIn,
      setBottomSlideInType,
    }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should open the create drawer when there is no user", async () => {
    mockContext(null);
    render(<CreateFlyerButton />);
    await userEvent.click(screen.getByRole("button", { name: "Create Flyer" }));
    expect(setDrawerAction).toHaveBeenCalledWith("create");
    expect(setIsOpenFlyerDrawer).toHaveBeenCalledWith(true);
    expect(setIsOpenBottomSlideIn).not.toHaveBeenCalled();
  });

  it("should open the create drawer when the user has no templates", async () => {
    mockContext({ templates: [] });
    render(<CreateFlyerButton size="small" />);
    await userEvent.click(screen.getByRole("button", { name: "Create Flyer" }));
    expect(setDrawerAction).toHaveBeenCalledWith("create");
    expect(setIsOpenFlyerDrawer).toHaveBeenCalledWith(true);
  });

  it("should open the templates slide-in when the user has templates", async () => {
    mockContext({ templates: [{ id: 1 }] });
    render(<CreateFlyerButton />);
    await userEvent.click(screen.getByRole("button", { name: "Create Flyer" }));
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    expect(setBottomSlideInType).toHaveBeenCalledWith("hasTemplates");
    expect(setIsOpenFlyerDrawer).not.toHaveBeenCalled();
  });

  it("should be disabled when disabled is true", () => {
    mockContext(null);
    render(<CreateFlyerButton disabled />);
    expect(screen.getByRole("button", { name: "Create Flyer" })).toBeDisabled();
  });
});
