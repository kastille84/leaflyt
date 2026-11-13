import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import MyAccount from "../../src/pages/MyAccount";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";

vi.mock("../../src/hooks/useGetUserLimits");
vi.mock("../../src/features/account/AccountInfo", () => ({
  default: () => <div data-testid="mock-account-info" />,
}));
vi.mock("../../src/features/account/MyPlan", () => ({
  default: () => <div data-testid="mock-my-plan" />,
}));
vi.mock("../../src/features/account/MyBilling", () => ({
  default: () => <div data-testid="mock-my-billing" />,
}));

describe("MyAccount", () => {
  function setPaid(paid: boolean) {
    vi.mocked(useGetUserLimits).mockReturnValue({ paid } as any);
  }

  it("shows account info by default and hides billing for unpaid users", () => {
    setPaid(false);
    render(<MyAccount />);
    expect(screen.getByTestId("mock-account-info")).toBeTruthy();
    expect(screen.queryByText("Billing")).toBeNull();
  });

  it("switches between account, plan and billing tabs", async () => {
    setPaid(true);
    const user = userEvent.setup();
    render(<MyAccount />);

    await user.click(screen.getByText("Plan"));
    expect(screen.getByTestId("mock-my-plan")).toBeTruthy();
    expect(screen.queryByTestId("mock-account-info")).toBeNull();

    await user.click(screen.getByText("Billing"));
    expect(screen.getByTestId("mock-my-billing")).toBeTruthy();

    await user.click(
      screen.getAllByText("Account").find((el) => el.tagName === "DIV")!,
    );
    expect(screen.getByTestId("mock-account-info")).toBeTruthy();
  });
});
