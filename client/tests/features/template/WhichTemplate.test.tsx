import { act, render, screen, waitFor } from "@testing-library/react";
import { getActionButtons, QueryClientProviderWrapper } from "../../test-utils";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

import WhichTemplate from "../../../src/features/template/WhichTemplate";

import * as GlobalContext from "../../../src/context/GlobalContext";
import useCreateRegisteredFlyer from "../../../src/features/createFlyer/useCreateRegisteredFlyer";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { responseData } from "../../fixtures/nearbyPlaces";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/createFlyer/useCreateRegisteredFlyer");
vi.mock("react-hot-toast");

const user = userEvent.setup();
const setSelectedTemplateMock = vi.fn();
const createFlyerUsingTemplateSpy = vi.fn();
const mockPlace = responseData.places[0];
const contrivedTemplate = userFromContext.templates[0];
contrivedTemplate.id = "contrived-template-id";

describe("WhichTemplate", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
      selectedPlace: mockPlace,
    }));
    vi.mocked(useCreateRegisteredFlyer).mockImplementation(() => {
      return {
        createFlyer: vi.fn(),
        createFlyerError: null,
        createFlyerUsingTemplate: createFlyerUsingTemplateSpy,
        createFlyerUsingTemplateError: null,
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a template", async () => {
    render(
      <WhichTemplate
        setSelectedTemplate={setSelectedTemplateMock}
        selectedTemplate={userFromContext.templates[0]}
      />,
      {
        wrapper: QueryClientProviderWrapper(),
      }
    );
    const whichTemplate = screen.getByTestId("which-template-container");
    expect(whichTemplate).toBeTruthy();
    // select a template
    const templateList = screen.getByTestId("template-list-container");
    const templateListItems = templateList.querySelectorAll("li");
    const templateListItem = templateListItems[0];
    expect(templateListItem).toBeTruthy();
    await act(async () => {
      await user.click(templateListItem);
    });
    const { cancel: doneButton } = getActionButtons();
    await act(async () => {
      await user.click(doneButton);
    });
    await waitFor(() => {
      expect(createFlyerUsingTemplateSpy).toHaveBeenCalled();
    });
    await act(async () => {
      // trigger toast success
      await createFlyerUsingTemplateSpy.mock.calls[0][1].onSuccess();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Flyer created!");
    });
  });
  it("should fail to create a template", async () => {
    render(
      <WhichTemplate
        setSelectedTemplate={setSelectedTemplateMock}
        selectedTemplate={userFromContext.templates[0]}
      />,
      {
        wrapper: QueryClientProviderWrapper(),
      }
    );
    const whichTemplate = screen.getByTestId("which-template-container");
    expect(whichTemplate).toBeTruthy();
    // select a template
    const templateList = screen.getByTestId("template-list-container");
    const templateListItems = templateList.querySelectorAll("li");
    const templateListItem = templateListItems[0];
    expect(templateListItem).toBeTruthy();
    await act(async () => {
      await user.click(templateListItem);
    });
    const { cancel: doneButton } = getActionButtons();
    await act(async () => {
      await user.click(doneButton);
    });
    await waitFor(() => {
      expect(createFlyerUsingTemplateSpy).toHaveBeenCalled();
    });
    await act(async () => {
      // trigger toast success
      await createFlyerUsingTemplateSpy.mock.calls[0][1].onError();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Flyer creation failed! Try again."
      );
    });
  });

  it("should create a flyer, if no template is selected", async () => {
    render(
      <WhichTemplate
        setSelectedTemplate={setSelectedTemplateMock}
        selectedTemplate={null}
      />,
      {
        wrapper: QueryClientProviderWrapper(),
      }
    );
    const whichTemplate = screen.getByTestId("which-template-container");
    expect(whichTemplate).toBeTruthy();
    const { cancel: doneButton } = getActionButtons();
    await act(async () => {
      await user.click(doneButton);
    });
    await waitFor(() => {
      expect(createFlyerUsingTemplateSpy).not.toHaveBeenCalled();
    });
  });
});
