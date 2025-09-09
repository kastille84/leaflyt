import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Configuration from "../../../../src/features/createFlyer/FlyerDesigner/Configuration";
import { getSelect, QueryClientProviderWrapper } from "../../../test-utils";
import * as FlyerDesignerContext from "../../../../src/context/FlyerDesignerContext";
import * as GlobalContext from "../../../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";
import { mockFlyerDesignerContextReturnObj } from "../../../fixtures/context/flyerDesignerContext";
import { flyerForDisplayMock } from "../../../fixtures/flyerDesigner";

// mocks
vi.mock("../../../../src/context/GlobalContext");
vi.mock("../../../../src/context/FlyerDesignerContext");

const user = userEvent.setup();

describe("Configuration", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
    }));
    vi.mocked(FlyerDesignerContext.useFlyerDesignerContext).mockImplementation(
      () => ({
        ...mockFlyerDesignerContextReturnObj,
        selectedFlyer: flyerForDisplayMock,
      })
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("should interact with the inputs", async () => {
    // assemble

    // act
    render(<Configuration />, {
      wrapper: QueryClientProviderWrapper(),
    });
    const { select: fontSelect } = getSelect("font");
    await user.selectOptions(fontSelect, "Serif");
    // assert
    await waitFor(() => {
      const configuration = screen.getByTestId("configuration");
      expect(configuration).toBeTruthy();
    });
  });
});
