import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import NoFlyers from "../../../src/features/board/NoFlyers";

import * as GlobalContext from "../../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { act } from "react";

// mocks
vi.mock("../../../src/context/GlobalContext");

const user = userEvent.setup();

describe("NoFlyers", () => {
  const setIsOpenFlyerDrawerMockFn = vi.fn();
  const setDrawerActionMockFn = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      // setIsOpenFlyerDrawer, setDrawerAction --> spy on these
      setIsOpenFlyerDrawer: setIsOpenFlyerDrawerMockFn,
      setDrawerAction: setDrawerActionMockFn,
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render NoFlyers", async () => {
    render(<NoFlyers />);
    const noFlyers = screen.getByTestId("no-flyers-container");
    expect(noFlyers).toBeTruthy();
    const button = screen.getByRole("button", { name: "Create Flyer" });
    await act(async () => {
      await user.click(button);
    });
    await waitFor(() => {
      expect(setIsOpenFlyerDrawerMockFn).toHaveBeenCalledWith(true);
      expect(setDrawerActionMockFn).toHaveBeenCalledWith("create");
    });
  });
});
