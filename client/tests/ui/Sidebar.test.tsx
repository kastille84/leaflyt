import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Sidebar from "../../src/ui/Sidebar";
import { useGlobalContext } from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

const navigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}));
vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../src/ui/MainNav", () => ({
  default: () => <div data-testid="main-nav" />,
}));

function setup(user: any = null) {
  (useGlobalContext as any).mockReturnValue({
    ...mockUseGlobalContextReturnObj,
    user,
  });
  return render(<Sidebar />);
}

describe("Sidebar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the logo and main navigation, open by default", () => {
    const { container } = setup();
    expect(screen.getByAltText("logo")).toBeDefined();
    expect(screen.getByTestId("main-nav")).toBeDefined();
    expect(container.querySelector("aside")!.classList.contains("open")).toBe(
      true,
    );
  });

  it("should send anonymous users to the landing page from the logo", async () => {
    setup();
    await userEvent.setup().click(screen.getByAltText("logo"));
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("should send logged-in users to the dashboard and close the sidebar", async () => {
    const { container } = setup({ id: 1 });
    await userEvent.setup().click(screen.getByAltText("logo"));
    expect(navigate).toHaveBeenCalledWith("/dashboard/home");
    expect(container.querySelector("aside")!.classList.contains("open")).toBe(
      false,
    );
  });

  it("should close when the mouse leaves", async () => {
    const { container } = setup();
    const aside = container.querySelector("aside")!;
    const user = userEvent.setup();
    await user.hover(aside);
    await user.unhover(aside);
    expect(aside.classList.contains("open")).toBe(false);
  });

  it("should toggle open state from the menu button", async () => {
    const { container } = setup();
    const aside = container.querySelector("aside")!;
    const toggle = aside.firstElementChild as HTMLElement;
    const user = userEvent.setup();
    await user.click(toggle);
    expect(aside.classList.contains("open")).toBe(false);
    await user.click(toggle);
    expect(aside.classList.contains("open")).toBe(true);
  });
});
