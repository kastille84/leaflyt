import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

import Configuration from "../../../../src/features/createFlyer/FlyerDesigner/Configuration";
import {
  getSelect,
  getColorInput,
  QueryClientProviderWrapper,
  getBorderRadius,
  getActionButtons,
} from "../../../test-utils";
import * as FlyerDesignerContext from "../../../../src/context/FlyerDesignerContext";
import * as GlobalContext from "../../../../src/context/GlobalContext";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";
import { mockFlyerDesignerContextReturnObj } from "../../../fixtures/context/flyerDesignerContext";
import {
  configurationSubmitGetValuesMock,
  flyerForDisplayMock,
} from "../../../fixtures/flyerDesigner";

// mocks
vi.mock("../../../../src/context/GlobalContext");
vi.mock("../../../../src/context/FlyerDesignerContext");
vi.mock("react-hot-toast");
// vi.mock("react-hot-toast", async () => {
//   const module = await vi.importActual("react-hot-toast");
//   return {
//     ...module,
//     toast: {
//       ...module,
//       success: vi.fn(),
//       error: vi.fn(),
//     },
//   };
// });

const user = userEvent.setup();
const getValuesMock = vi.fn();

describe("Configuration", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      flyerDesignOptions: {
        getValues: getValuesMock.mockReturnValue(
          configurationSubmitGetValuesMock
        ),
        setValue: vi.fn(),
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
    vi.clearAllMocks();
  });

  it("should interact with the inputs and submit", async () => {
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
    const { submit, cancel: reset } = getActionButtons();
    await user.click(submit);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
  it("should interact with the inputs and reset", async () => {
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
    const { submit, cancel: reset } = getActionButtons();
    await user.click(reset);
    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
