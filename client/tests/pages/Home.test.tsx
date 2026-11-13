import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-hot-toast";
import Home from "../../src/pages/Home";
import * as GlobalContext from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

const sendWelcomeEmailFn = vi.fn();

vi.mock("../../src/context/GlobalContext");
vi.mock("react-hot-toast", () => {
  const toast = { success: vi.fn() };
  return { toast, default: toast };
});
vi.mock("../../src/features/authentication/useSignup", () => ({
  default: () => ({ sendWelcomeEmailFn }),
}));
vi.mock("../../src/ui/Flyer/CreateFlyerButton", () => ({
  default: () => <button data-testid="mock-create-flyer">Create</button>,
}));

function renderHome(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <Home />
    </MemoryRouter>,
  );
}

describe("Home", () => {
  const getUserGeo = vi.fn();
  const setIsOpenBottomSlideIn = vi.fn();
  const setBottomSlideInType = vi.fn();
  const context = {
    ...mockUseGlobalContextReturnObj,
    getUserGeo,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue(context);
  });

  it("renders a plain welcome and the signup CTA for guests", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Welcome",
    );
    expect(screen.getByText("Discover Boards")).toBeTruthy();
    expect(screen.getByText("Get Started in 3 Simple Steps")).toBeTruthy();
    expect(screen.queryByTestId("mock-create-flyer")).toBeNull();
    expect(screen.getByText("Create a Free Account")).toBeTruthy();
    expect(sendWelcomeEmailFn).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("greets a business user by name", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...context,
      user: { name: "Acme" },
    } as any);
    renderHome();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Welcome, Acme",
    );
    expect(screen.queryByText("Create a Free Account")).toBeNull();
  });

  it("greets an individual user by first name", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...context,
      user: { firstName: "Jane" },
    } as any);
    renderHome();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Welcome, Jane",
    );
  });

  it("shows the create flyer button when a place is selected", () => {
    vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
      ...context,
      selectedPlace: { place_id: "abc" },
    } as any);
    renderHome();
    expect(screen.getByTestId("mock-create-flyer")).toBeTruthy();
  });

  it("finds nearby boards and opens the signup slide-in", async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByText("Find Boards Nearby"));
    expect(getUserGeo).toHaveBeenCalled();
    await user.click(screen.getByText("Create a Free Account"));
    expect(setBottomSlideInType).toHaveBeenCalledWith("signup");
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
  });

  it("sends the welcome email after verification", () => {
    renderHome(
      "?verified=true&email=a@b.com&typeOfUser=individual&firstName=Jane&lastName=Doe",
    );
    expect(sendWelcomeEmailFn).toHaveBeenCalledWith({
      email: "a@b.com",
      typeOfUser: "individual",
      name: "",
      firstName: "Jane",
      lastName: "Doe",
    });
  });

  it("toasts after a successful Stripe payment", () => {
    renderHome("?session_id=s&customer_id=c&plan=p");
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining("Payment successful"),
      { duration: 8000 },
    );
  });
});
