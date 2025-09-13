import { render, screen, waitFor } from "@testing-library/react";
import TemplateSelectionContainer from "../../../src/features/template/TemplateSelectionContainer";
import { QueryClientProviderWrapper } from "../../test-utils";
import WhichTemplate from "../../../src/features/template/WhichTemplate";
import TemplateDisplay from "../../../src/features/template/TemplateDisplay";

// fixtures

// mocks
vi.mock("../../../src/features/template/WhichTemplate");
vi.mock("../../../src/features/template/TemplateDisplay");

describe("TemplateSelectionContainer", () => {
  beforeEach(() => {
    vi.mocked(WhichTemplate).mockImplementation(() => {
      return <div data-testid="mock-which-template">Mock WhichTemplate</div>;
    });
    vi.mocked(TemplateDisplay).mockImplementation(() => {
      return (
        <div data-testid="mock-template-display">Mock TemplateDisplay</div>
      );
    });
  });

  it("should render", () => {
    render(<TemplateSelectionContainer />, {
      wrapper: QueryClientProviderWrapper(),
    });
    const templateSelectionContainer = screen.getByTestId(
      "template-selection-container"
    );
    expect(templateSelectionContainer).toBeTruthy();

    const mockWhichTemplate = screen.getByTestId("mock-which-template");
    const mockTemplateDisplay = screen.getByTestId("mock-template-display");
    expect(mockWhichTemplate).toBeTruthy();
    expect(mockTemplateDisplay).toBeTruthy();
  });
});
