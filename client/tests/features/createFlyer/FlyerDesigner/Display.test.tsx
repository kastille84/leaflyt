import { render, screen, waitFor } from "@testing-library/react";

import Display from "../../../../src/features/createFlyer/FlyerDesigner/Display";
import { QueryClientProviderWrapper } from "../../../test-utils";
import * as FlyerDesignerContext from "../../../../src/context/FlyerDesignerContext";
import FlyerBlockConfigurable from "../../../../src/ui/Flyer/FlyerBlockConfigurable";

// fixtures
import { mockFlyerDesignerContextReturnObj } from "../../../fixtures/context/flyerDesignerContext";
import { flyerForDisplayMock } from "../../../fixtures/flyerDesigner";

// mocks
vi.mock("../../../../src/context/FlyerDesignerContext");
vi.mock("../../../../src/ui/Flyer/FlyerBlockConfigurable");

describe("Display", () => {
  it("should render", async () => {
    // assemble
    vi.mocked(FlyerDesignerContext.useFlyerDesignerContext).mockImplementation(
      () => ({
        ...mockFlyerDesignerContextReturnObj,
        selectedFlyer: flyerForDisplayMock,
      })
    );
    vi.mocked(FlyerBlockConfigurable).mockImplementation(() => {
      return (
        <div data-testid="mock-flyer-block-configurable">
          Mock Flyer Block Configurable
        </div>
      );
    });
    // act
    render(<Display />, {
      wrapper: QueryClientProviderWrapper(),
    });
    // assert
    await waitFor(() => {
      const mockFlyerBlockConfigurable = screen.getByTestId(
        "mock-flyer-block-configurable"
      );
      expect(mockFlyerBlockConfigurable).toBeTruthy();
    });
  });
});
