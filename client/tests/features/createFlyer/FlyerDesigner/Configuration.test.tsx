import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Configuration from "../../../../src/features/createFlyer/FlyerDesigner/Configuration";
import {
  getSelect,
  getColorInput,
  QueryClientProviderWrapper,
  getBorderRadius,
} from "../../../test-utils";
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
const getValuesMock = vi.fn();

describe("Configuration", () => {
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
    const { input: colorInput } = getColorInput("color-input");
    console.log("colorInput", colorInput);
    await user.type(colorInput, "#ff0000");
    const { select: borderRadiusSelect, input: radiusInput } =
      getBorderRadius("border-radius");
    await user.selectOptions(borderRadiusSelect, "borderTopLeftRadius");
    await user.type(radiusInput, "10");
    // assert
    await waitFor(() => {
      const configuration = screen.getByTestId("configuration-container");
      expect(configuration).toBeTruthy();
    });
    // #TODO: HANDLE Done & Reset buttons
  });
});
