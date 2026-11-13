import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Statistics from "../../src/pages/Statistics";

vi.mock("../../src/features/statistics/usage/Usage", () => ({
  default: () => <div data-testid="mock-usage" />,
}));

describe("Statistics", () => {
  it("shows usage by default and switches to analytics and back", async () => {
    const user = userEvent.setup();
    render(<Statistics />);
    expect(screen.getByTestId("mock-usage")).toBeTruthy();

    await user.click(screen.getByText("Analytics"));
    expect(screen.getByText("Analytics Coming Soon.")).toBeTruthy();
    expect(screen.queryByTestId("mock-usage")).toBeNull();

    await user.click(screen.getByText("Usage"));
    expect(screen.getByTestId("mock-usage")).toBeTruthy();
  });
});
