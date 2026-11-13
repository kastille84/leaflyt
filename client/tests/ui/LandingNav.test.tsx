import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import LandingNav from "../../src/ui/LandingNav";
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

describe("LandingNav", () => {
  const ctx = {
    ...mockUseGlobalContextReturnObj,
    getUserGeo: vi.fn(),
    setShowLoginModal: vi.fn(),
    setIsOpenBottomSlideIn: vi.fn(),
    setBottomSlideInType: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGlobalContext as any).mockReturnValue(ctx);
  });

  it("should get the user's location on Find Boards", async () => {
    render(<LandingNav />);
    await userEvent.setup().click(screen.getByText("Find Boards"));
    expect(ctx.getUserGeo).toHaveBeenCalled();
  });

  it("should navigate to the FAQ and pricing pages", async () => {
    render(<LandingNav />);
    const user = userEvent.setup();
    await user.click(screen.getByText("FAQ"));
    expect(navigate).toHaveBeenCalledWith("/faq");
    await user.click(screen.getByText("Pricing"));
    expect(navigate).toHaveBeenCalledWith("/pricing");
  });

  it("should open the signup slide-in", async () => {
    render(<LandingNav />);
    await userEvent.setup().click(screen.getByText("Sign Up"));
    expect(ctx.setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    expect(ctx.setBottomSlideInType).toHaveBeenCalledWith("signup");
  });

  it("should open the login modal", async () => {
    render(<LandingNav />);
    await userEvent.setup().click(screen.getByText("Login"));
    expect(ctx.setShowLoginModal).toHaveBeenCalledWith(true);
  });
});
