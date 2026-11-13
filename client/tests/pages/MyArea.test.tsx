import { render, screen } from "@testing-library/react";
import MyArea from "../../src/pages/MyArea";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";

vi.mock("../../src/hooks/useGetUserLimits");
vi.mock("../../src/features/map/MapContainer", () => ({
  default: () => <div data-testid="mock-map" />,
}));
vi.mock("../../src/ui/UpgradeText", () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe("MyArea", () => {
  it("shows the upgrade text when the user can upgrade", () => {
    vi.mocked(useGetUserLimits).mockReturnValue({ canUpgrade: true } as any);
    render(<MyArea />);
    expect(screen.getByText(/increase your area/)).toBeTruthy();
    expect(screen.getByTestId("mock-map")).toBeTruthy();
  });

  it("hides the upgrade text otherwise", () => {
    vi.mocked(useGetUserLimits).mockReturnValue({ canUpgrade: false } as any);
    render(<MyArea />);
    expect(screen.queryByText(/increase your area/)).toBeNull();
    expect(screen.getByTestId("mock-map")).toBeTruthy();
  });
});
