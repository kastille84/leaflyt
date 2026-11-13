import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TemplateList from "../../../../src/features/template/myTemplates/TemplateList";
import * as GlobalContext from "../../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";

vi.mock("../../../../src/context/GlobalContext");
vi.mock("../../../../src/ui/Flyer/FlyerBlockStatic", () => ({
  default: ({ flyer }: any) => (
    <div data-testid="flyer-block-static">{flyer.templateName}</div>
  ),
}));

const user = userEvent.setup();
const setDrawerAction = vi.fn();
const setIsOpenFlyerDrawer = vi.fn();
const setSelectedTemplate = vi.fn();
const setShowDeleteFlyerTemplateModal = vi.fn();

const templates = [
  { id: 1, templateName: "first template" },
  { id: 2, templateName: "second template" },
] as any[];
// two flyers use template 1, none use template 2
const flyers = [{ template: 1 }, { template: 1 }] as any[];

function mockContext(userValue: any) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    user: userValue,
    setDrawerAction,
    setIsOpenFlyerDrawer,
    setSelectedTemplate,
    setShowDeleteFlyerTemplateModal,
  }));
}

describe("MyTemplates TemplateList", () => {
  beforeEach(() => {
    mockContext({ templates, flyers });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render a block per template with its flyer count", () => {
    render(<TemplateList />);
    expect(screen.getAllByTestId("flyer-block-static")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "first template" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "second template" }),
    ).toBeInTheDocument();
    const counts = screen
      .getAllByText(/Flyer\(s\)/)
      .map((el) => el.textContent);
    expect(counts[0]).toContain("2");
    expect(counts[1]).toContain("0");
  });

  it("should render nothing without a user", () => {
    mockContext(null);
    render(<TemplateList />);
    expect(screen.queryByTestId("flyer-block-static")).not.toBeInTheDocument();
  });

  it("should open the drawer to edit a template", async () => {
    const { container } = render(<TemplateList />);
    const [editIcon] = container.querySelectorAll("svg");
    await user.click(editIcon);
    expect(setSelectedTemplate).toHaveBeenCalledWith(templates[0]);
    expect(setDrawerAction).toHaveBeenCalledWith("editTemplate");
    const updater = setIsOpenFlyerDrawer.mock.calls[0][0];
    expect(updater(false)).toBe(true);
  });

  it("should open the delete modal for a template", async () => {
    const { container } = render(<TemplateList />);
    const icons = container.querySelectorAll("svg");
    await user.click(icons[1]);
    expect(setSelectedTemplate).toHaveBeenCalledWith(templates[0]);
    expect(setShowDeleteFlyerTemplateModal).toHaveBeenCalledWith(true);
  });
});
