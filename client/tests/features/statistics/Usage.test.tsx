import { render, screen } from "@testing-library/react";
import Usage from "../../../src/features/statistics/usage/Usage";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { planLimitsGrove } from "../../fixtures/plan/planlimits";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useGetUserLimits");
vi.mock("../../../src/ui/Statistics/DoughnutStat", () => ({
  default: ({ data }: any) => (
    <div data-testid="doughnut-stat">{`${data.title}:${data.statNum}`}</div>
  ),
}));
vi.mock("../../../src/ui/Statistics/NumberStat", () => ({
  default: ({ data }: any) => (
    <div data-testid="number-stat">{`${data.title}:${data.statNum}`}</div>
  ),
}));

function mockUser(userValue: any) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    user: userValue,
  }));
}

describe("Usage", () => {
  beforeEach(() => {
    vi.mocked(useGetUserLimits).mockReturnValue(planLimitsGrove as any);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should show usage against plan limits and totals", () => {
    mockUser({
      flyers: [
        { postingMethod: "onLocation", likes: 2 },
        { postingMethod: "onLocation", likes: 1 },
        { postingMethod: "remote", likes: 0 },
      ],
      templates: [{ id: 1 }],
    });
    render(<Usage />);
    const limits = planLimitsGrove;
    expect(
      screen.getAllByTestId("doughnut-stat").map((d) => d.textContent),
    ).toEqual([
      `On-location:2/${limits.onLocationPosting.limit}`,
      `Remote:1/${limits.remotePosting.limit}`,
      `Templates:1/${limits.templates.limit}`,
    ]);
    expect(
      screen.getAllByTestId("number-stat").map((n) => n.textContent),
    ).toEqual(["Total Flyers:3", "Total Likes:3"]);
  });

  it("should hide the likes stat when there are no likes", () => {
    mockUser({
      flyers: [{ postingMethod: "remote", likes: 0 }],
      templates: [],
    });
    render(<Usage />);
    const numbers = screen.getAllByTestId("number-stat");
    expect(numbers).toHaveLength(1);
    expect(numbers[0]).toHaveTextContent("Total Flyers:1");
  });

  it("should fall back to zero when there is no user", () => {
    mockUser(null);
    render(<Usage />);
    expect(screen.getByText(/^On-location:0\//)).toBeInTheDocument();
    expect(screen.getByText(/^Remote:0\//)).toBeInTheDocument();
    expect(screen.getByText(/^Templates:0\//)).toBeInTheDocument();
    expect(screen.getByText("Total Flyers:0")).toBeInTheDocument();
  });

  it("should fall back to zero when the user has no templates", () => {
    mockUser({ flyers: [] });
    render(<Usage />);
    expect(screen.getByText(/^Templates:0\//)).toBeInTheDocument();
  });
});
