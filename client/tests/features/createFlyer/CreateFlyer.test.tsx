import { render, screen } from "@testing-library/react";
import CreateFlyer from "../../../src/features/createFlyer/CreateFlyer";
import useGetUserLimits from "../../../src/hooks/useGetUserLimits";
import { planLimitsGarden } from "../../fixtures/plan/planlimits";

vi.mock("../../../src/hooks/useGetUserLimits");
vi.mock("../../../src/features/createFlyer/Anonymous", () => ({
  default: () => <div data-testid="anonymous" />,
}));
vi.mock("../../../src/features/createFlyer/Registered", () => ({
  default: () => <div data-testid="registered" />,
}));

describe("CreateFlyer", () => {
  it("should show the anonymous form for unregistered users", () => {
    vi.mocked(useGetUserLimits).mockReturnValue(planLimitsGarden as any);
    render(<CreateFlyer />);
    expect(screen.getByTestId("anonymous")).toBeInTheDocument();
    expect(screen.queryByTestId("registered")).not.toBeInTheDocument();
  });

  it("should show the registered form for registered users", () => {
    vi.mocked(useGetUserLimits).mockReturnValue({
      ...planLimitsGarden,
      registered: true,
    } as any);
    render(<CreateFlyer />);
    expect(screen.getByTestId("registered")).toBeInTheDocument();
    expect(screen.queryByTestId("anonymous")).not.toBeInTheDocument();
  });
});
