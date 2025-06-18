import { render, screen } from "@testing-library/react";
import NoFlyers from "../../../src/features/board/NoFlyers";

import * as GlobalContext from "../../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/globalContext";

// mocks
vi.mock("../../../src/context/GlobalContext");

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

  it("should render NoFlyers", () => {
    render(<NoFlyers />);
    const noFlyers = screen.getByTestId("no-flyers-container");
    expect(noFlyers).toBeTruthy();
  });
});
