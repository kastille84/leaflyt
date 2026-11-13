import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TemplateList from "../../../src/features/template/TemplateList";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

const user = userEvent.setup();
const setSelectedTemplate = vi.fn();
const templates = [
  { id: 1, templateName: "first template" },
  { id: 2, templateName: "second template" },
] as any[];

describe("TemplateList", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: { templates } as any,
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should list every template by name", () => {
    render(
      <TemplateList
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={null}
      />,
    );
    expect(screen.getByTestId("template-list-container")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("first template")).toBeInTheDocument();
    expect(screen.getByText("second template")).toBeInTheDocument();
  });

  it("should mark only the selected template", () => {
    render(
      <TemplateList
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={templates[1]}
      />,
    );
    expect(screen.getByText("first template")).not.toHaveClass("selected");
    expect(screen.getByText("second template")).toHaveClass("selected");
  });

  it("should select the clicked template", async () => {
    render(
      <TemplateList
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={null}
      />,
    );
    await user.click(screen.getByText("first template"));
    expect(setSelectedTemplate).toHaveBeenCalledTimes(1);
    const updater = setSelectedTemplate.mock.calls[0][0];
    expect(updater(null)).toBe(templates[0]);
  });
});
