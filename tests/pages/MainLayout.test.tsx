import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Outlet } from "react-router-dom";
import MainLayout from "../../src/pages/MainLayout";
import ActionMenu from "../../src/ui/ActionMenu";
import Sidebar from "../../src/ui/Sidebar";

//  mocks
vi.mock("../../src/pages/MainLayout");
vi.mock("../../src/ui/ActionMenu");
vi.mock("../../src/ui/Sidebar");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: vi.fn(),
  };
});

describe("MainLayout Page", () => {
  beforeEach(() => {
    // mock out ActionMenu and Sidebar
    vi.mocked(ActionMenu).mockImplementation(() => {
      return <div data-testid="mock-action-menu">Mock ActionMenu</div>;
    });
    vi.mocked(Sidebar).mockImplementation(() => {
      return <div data-testid="mock-sidebar">Mock Sidebar</div>;
    });
    vi.mocked(Outlet).mockImplementation(() => {
      return <div data-testid="mock-outlet">Mock Outlet</div>;
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("should render MainLayout", () => {
    render(<MainLayout />);
    const mainLayout = screen.getByTestId("main-layout");
    const actionMenu = screen.getByTestId("mock-action-menu");
    const sidebar = screen.getByTestId("mock-sidebar");
    const outlet = screen.getByTestId("mock-outlet");
    expect(mainLayout).toBeTruthy();
    expect(actionMenu.textContent).toContain("Mock ActionMenu");
    expect(sidebar.textContent).toContain("Mock Sidebar");
    expect(outlet.textContent).toContain("Mock Outlet");
  });
});
