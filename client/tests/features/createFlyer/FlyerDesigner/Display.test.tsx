import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

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

const user = userEvent.setup();

describe("Display", () => {
  function mockSelectedFlyer(selectedFlyer: any) {
    vi.mocked(FlyerDesignerContext.useFlyerDesignerContext).mockImplementation(
      () => ({
        ...mockFlyerDesignerContextReturnObj,
        selectedFlyer,
      }),
    );
  }

  beforeEach(() => {
    vi.mocked(FlyerBlockConfigurable).mockImplementation(() => {
      return (
        <div data-testid="mock-flyer-block-configurable">
          Mock Flyer Block Configurable
        </div>
      );
    });
  });

  it("should render", async () => {
    mockSelectedFlyer(flyerForDisplayMock);
    render(<Display />, {
      wrapper: QueryClientProviderWrapper(),
    });
    await waitFor(() => {
      const mockFlyerBlockConfigurable = screen.getByTestId(
        "mock-flyer-block-configurable",
      );
      expect(mockFlyerBlockConfigurable).toBeTruthy();
    });
  });

  it("should not render the flyer block without a selected flyer", () => {
    mockSelectedFlyer(null);
    render(<Display />, {
      wrapper: QueryClientProviderWrapper(),
    });
    expect(screen.getByText("Customize Flyer")).toBeTruthy();
    expect(screen.queryByTestId("mock-flyer-block-configurable")).toBeNull();
  });

  it("should start open and close when the opener is clicked", async () => {
    mockSelectedFlyer(flyerForDisplayMock);
    const { container } = render(<Display />, {
      wrapper: QueryClientProviderWrapper(),
    });
    expect(container.firstElementChild?.className).toContain("open");
    await user.click(screen.getByText("Preview"));
    expect(container.firstElementChild?.className).not.toContain("open");
  });

  it("should reopen when the opener is clicked again", async () => {
    mockSelectedFlyer(flyerForDisplayMock);
    const { container } = render(<Display />, {
      wrapper: QueryClientProviderWrapper(),
    });
    await user.click(screen.getByText("Preview"));
    await user.click(screen.getByText("Preview"));
    expect(container.firstElementChild?.className).toContain("open");
  });

  it("should close when the canvas is clicked", async () => {
    mockSelectedFlyer(flyerForDisplayMock);
    const { container } = render(<Display />, {
      wrapper: QueryClientProviderWrapper(),
    });
    await user.click(screen.getByTestId("mock-flyer-block-configurable"));
    expect(container.firstElementChild?.className).not.toContain("open");
  });
});
