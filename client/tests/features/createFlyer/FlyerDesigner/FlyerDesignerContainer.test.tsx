import { render, screen, waitFor } from "@testing-library/react";
import FlyerDesignerContainer from "../../../../src/features/createFlyer/FlyerDesigner/FlyerDesignerContainer";
import { QueryClientProviderWrapper } from "../../../test-utils";
import * as GlobalContext from "../../../../src/context/GlobalContext";
import * as FlyerDesignerContext from "../../../../src/context/FlyerDesignerContext";
import { flyerForDisplayMock } from "../../../fixtures/flyerDesigner";
import Display from "../../../../src/features/createFlyer/FlyerDesigner/Display";
import Configuration from "../../../../src/features/createFlyer/FlyerDesigner/Configuration";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";
import { mockFlyerDesignerContextReturnObj } from "../../../fixtures/context/flyerDesignerContext";

// mocks
vi.mock("../../../../src/context/GlobalContext.tsx");
vi.mock("../../../../src/context/FlyerDesignerContext");
vi.mock("../../../../src/features/createFlyer/FlyerDesigner/Display");
vi.mock("../../../../src/features/createFlyer/FlyerDesigner/Configuration");

const getValuesMock = vi.fn();

describe("FlyerDesignerContainer", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      flyerDesignOptions: {
        getValues: getValuesMock,
      },
    }));
    vi.mocked(FlyerDesignerContext.useFlyerDesignerContext).mockImplementation(
      () => ({
        ...mockFlyerDesignerContextReturnObj,
        selectedFlyer: flyerForDisplayMock,
        setSelectedFlyer: () => flyerForDisplayMock,
      })
    );
    vi.mocked(Display).mockImplementation(() => {
      return <div data-testid="mock-display">Mock Display</div>;
    });
    vi.mocked(Configuration).mockImplementation(() => {
      return <div data-testid="mock-configuration">Mock Configuration</div>;
    });
  });

  it("should render", async () => {
    // assemble
    getValuesMock.mockReturnValue(flyerForDisplayMock);
    // act
    render(<FlyerDesignerContainer />, {
      wrapper: QueryClientProviderWrapper(),
    });
    const mockDisplay = screen.getByTestId("mock-display");
    const mockConfiguration = screen.getByTestId("mock-configuration");
    // assert
    expect(mockDisplay).toBeTruthy();
    expect(mockConfiguration).toBeTruthy();
  });
});
