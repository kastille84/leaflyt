import { act, render, screen, waitFor } from "@testing-library/react";
import TemplateDisplay from "../../../src/features/template/TemplateDisplay";
import { QueryClientProviderWrapper } from "../../test-utils";
import { userFromContext } from "../../fixtures/authentication/login";
import * as GlobalContext from "../../../src/context/GlobalContext";

// mocks
vi.mock("../../../src/context/GlobalContext");

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

// the API returns templates with their user joined in (`templates(*, user(*))`)
const templateWithUser: any = {
  ...userFromContext.templates[0],
  user: userFromContext,
};

describe("TemplateDisplay", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => {
      return { ...mockUseGlobalContextReturnObj, user: userFromContext };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render without template", () => {
    render(<TemplateDisplay selectedTemplate={null} />, {
      wrapper: QueryClientProviderWrapper(),
    });
    const templateDisplay = screen.getByTestId("template-display");
    expect(templateDisplay).toBeTruthy();
    expect(templateDisplay.textContent).toBe("Select a template to display.");
  });

  it("should render with template", () => {
    render(
      <TemplateDisplay selectedTemplate={templateWithUser} />,
      {
        wrapper: QueryClientProviderWrapper(),
      }
    );
    const templateDisplay = screen.getByTestId("template-display");
    expect(templateDisplay).toBeTruthy();
  });
});
