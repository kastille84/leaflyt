import { render, screen } from "@testing-library/react";
import FlyerSlideIn from "../../../src/ui/Flyer/FlyerSlideIn";
import * as GlobalContext from "../../../src/context/GlobalContext";
import * as Responsive from "../../../src/hooks/useResponsiveWidth";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useResponsiveWidth");
vi.mock("../../../src/features/createFlyer/CreateFlyer", () => ({
  default: () => <div data-testid="create-flyer" />,
}));
const registeredProps = vi.fn();
vi.mock("../../../src/features/createFlyer/Registered", () => ({
  default: (props: any) => {
    registeredProps(props);
    return <div data-testid="registered" />;
  },
}));
const drawerProps = vi.fn();
vi.mock("react-modern-drawer", () => ({
  default: (props: any) => {
    drawerProps(props);
    return props.open ? <div data-testid="drawer">{props.children}</div> : null;
  },
}));

describe("FlyerSlideIn", () => {
  const setShowCloseSlideInModal = vi.fn();

  function mockContext(overrides: any = {}) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      isOpenFlyerDrawer: true,
      setShowCloseSlideInModal,
      selectedPlace: { displayName: { text: "Cafe" } } as any,
      ...overrides,
    }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Responsive.useResponsiveWidth).mockReturnValue(
      "l_desktop" as any,
    );
  });

  it("should render CreateFlyer for the create action", () => {
    mockContext({ drawerAction: "create" });
    render(<FlyerSlideIn />);
    expect(screen.getByTestId("create-flyer")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Create Flyer near Cafe",
    );
  });

  it("should render Registered for the edit action with the selected flyer", () => {
    const selectedFlyer = { id: "f1" };
    mockContext({ drawerAction: "edit", selectedFlyer });
    render(<FlyerSlideIn />);
    expect(registeredProps).toHaveBeenCalledWith({
      flyerToEdit: selectedFlyer,
      type: "edit",
    });
  });

  it("should render Registered for createTemplate", () => {
    mockContext({ drawerAction: "createTemplate" });
    render(<FlyerSlideIn />);
    expect(registeredProps).toHaveBeenCalledWith({ type: "createTemplate" });
  });

  it("should edit the selected template when no flyer is selected", () => {
    const selectedTemplate = { id: 9 };
    mockContext({ drawerAction: "editTemplate", selectedTemplate });
    render(<FlyerSlideIn />);
    expect(registeredProps).toHaveBeenCalledWith({
      type: "editTemplate",
      templateToEdit: selectedTemplate,
    });
  });

  it("should edit the template that the selected flyer belongs to", () => {
    const template = { id: 2 };
    mockContext({
      drawerAction: "editTemplate",
      selectedFlyer: { id: "f1", template: 2 },
      selectedTemplate: { id: 9 },
      user: { templates: [{ id: 1 }, template] },
    });
    render(<FlyerSlideIn />);
    expect(registeredProps).toHaveBeenCalledWith({
      type: "editTemplate",
      templateToEdit: template,
    });
  });

  it("should fall back to the selected template when the flyer template is not found", () => {
    const selectedTemplate = { id: 9 };
    mockContext({
      drawerAction: "editTemplate",
      selectedFlyer: { id: "f1", template: 2 },
      selectedTemplate,
      user: { templates: [{ id: 1 }] },
    });
    render(<FlyerSlideIn />);
    expect(registeredProps).toHaveBeenCalledWith({
      type: "editTemplate",
      templateToEdit: selectedTemplate,
    });
  });

  it("should render no content without a drawer action", () => {
    mockContext({ drawerAction: null });
    render(<FlyerSlideIn />);
    expect(screen.queryByTestId("create-flyer")).toBeNull();
    expect(screen.queryByTestId("registered")).toBeNull();
  });

  it("should not render the drawer when closed", () => {
    mockContext({ isOpenFlyerDrawer: false, drawerAction: "create" });
    render(<FlyerSlideIn />);
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  it("should ask to close the slide-in when the drawer closes", () => {
    mockContext({ drawerAction: "create" });
    render(<FlyerSlideIn />);
    drawerProps.mock.calls[0][0].onClose();
    expect(setShowCloseSlideInModal).toHaveBeenCalledWith(true);
  });

  it.each([
    ["s_mobile", "100%"],
    ["l_mobile", "100%"],
    ["m_tablet", "80%"],
    ["s_tablet", "80%"],
    ["l_tablet", "70%"],
    ["s_desktop", "70%"],
    ["l_desktop", "50vw"],
  ])("should size the drawer for %s", (width, size) => {
    vi.mocked(Responsive.useResponsiveWidth).mockReturnValue(width as any);
    mockContext({ drawerAction: "create" });
    render(<FlyerSlideIn />);
    expect(drawerProps.mock.calls[0][0].size).toBe(size);
  });
});
