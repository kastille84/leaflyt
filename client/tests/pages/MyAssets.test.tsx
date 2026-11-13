import { render, screen } from "@testing-library/react";
import MyAssets from "../../src/pages/MyAssets";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";
import * as GlobalContext from "../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

vi.mock("../../src/hooks/useGetUserLimits");
vi.mock("../../src/context/GlobalContext");
vi.mock("../../src/context/AssetSelectionContext", () => ({
  AssetSelectionContextProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>,
}));
vi.mock(
  "../../src/features/assets/MyAssets/MyAssetsSelectionContainer",
  () => ({
    default: () => <div data-testid="mock-selection" />,
  }),
);
vi.mock("../../src/ui/UpgradeText", () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));
vi.mock("../../src/ui/LimitExceededWarning", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="mock-limit-warning">{text}</div>
  ),
}));

function setup(opts: {
  canUpgrade: boolean;
  maxAssets: number;
  assets?: unknown[];
  noUser?: boolean;
}) {
  vi.mocked(useGetUserLimits).mockReturnValue({
    canUpgrade: opts.canUpgrade,
    maxAssets: opts.maxAssets,
  } as any);
  vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
    ...mockUseGlobalContextReturnObj,
    user: opts.noUser ? null : { assets: opts.assets },
  } as any);
  return render(<MyAssets />);
}

describe("MyAssets", () => {
  it("shows the limit warning when assets reach the max", () => {
    setup({ canUpgrade: false, maxAssets: 2, assets: [1, 2] });
    expect(screen.getByTestId("mock-limit-warning")).toBeTruthy();
    expect(screen.getByTestId("mock-selection")).toBeTruthy();
    expect(screen.queryByText("Need more assets?")).toBeNull();
  });

  it("shows upgrade text and no warning under the limit", () => {
    setup({ canUpgrade: true, maxAssets: 5, assets: [1] });
    expect(screen.queryByTestId("mock-limit-warning")).toBeNull();
    expect(screen.getByText("Need more assets?")).toBeTruthy();
    expect(screen.getByText("Manage Your Assets")).toBeTruthy();
  });

  it("treats a missing user as zero assets", () => {
    setup({ canUpgrade: false, maxAssets: 0, noUser: true });
    expect(screen.getByTestId("mock-limit-warning")).toBeTruthy();
  });
});
