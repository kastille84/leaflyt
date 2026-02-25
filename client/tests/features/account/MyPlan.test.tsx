import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components
import MyPlan from "../../../src/features/account/MyPlan";
import { expect, vi } from "vitest";
// context

// hooks
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { useGlobalContext } from "../../../src/context/GlobalContext";
// services

// fixtures
import { authUserProfileResponse } from "../../fixtures/authentication/login";
// userEvent

// mocks
vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../../src/hooks/useGetUserLimits", () => ({
  default: vi.fn(),
}));

describe("MyPlan", () => {
  beforeEach(() => {
    (useGetUserLimits as any).mockReturnValue({
      canUpgrade: true,
    });
    (useGlobalContext as any).mockReturnValue({
      user: authUserProfileResponse,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component", async () => {
    render(<MyPlan />);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Seed Plan" }),
      ).toBeInTheDocument();
    });
  });
});
