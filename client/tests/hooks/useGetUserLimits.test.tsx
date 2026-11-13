import { renderHook } from "@testing-library/react";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";
import { useGlobalContext } from "../../src/context/GlobalContext";

vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));

const plan = {
  name: "Pro",
  level: 2,
  hasAnalytics: true,
  templateLimit: 2,
  numOfMedia: 5,
  remotePostingLimit: 1,
  onLocationPostingLimit: 2,
  virtualPostingDistance: 10,
  hasBulkPosting: true,
  lifespan: 4,
  maxAssets: 20,
};

describe("useGetUserLimits", () => {
  it("falls back to the default plan without a user", () => {
    (useGlobalContext as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useGetUserLimits());
    const limits = result.current;
    expect(limits.level).toBe(0);
    expect(limits.registered).toBe(false);
    expect(limits.paid).toBe(false);
    expect(limits.canUpgrade).toBe(true);
    expect(limits.analytics.isAllowed).toBe(false);
    expect(limits.templates.isAllowed).toBe(false);
    expect(limits.onLocationPosting).toEqual({ isAllowed: true, limit: 10 });
    expect(limits.remotePosting.isAllowed).toBe(false);
    expect(limits.design.isAllowed).toBe(false);
    expect(limits.maxAssets).toBe(4);
  });

  it("derives limits from the plan on the user", () => {
    (useGlobalContext as any).mockReturnValue({
      user: {
        plan,
        templates: [{}],
        flyers: [{ postingMethod: "onLocation" }],
      },
    });
    const { result } = renderHook(() => useGetUserLimits());
    const limits = result.current;
    expect(limits.name).toBe("Pro");
    expect(limits.registered).toBe(true);
    expect(limits.paid).toBe(true);
    expect(limits.design.isAllowed).toBe(true);
    expect(limits.mapInteractive.isAllowed).toBe(true);
    expect(limits.analytics).toEqual({ isAllowed: true, limit: true });
    expect(limits.templates.isAllowed).toBe(true);
    expect(limits.remotePosting.isAllowed).toBe(true);
    expect(limits.onLocationPosting.isAllowed).toBe(true);
    expect(limits.bulkPosting.isAllowed).toBe(true);
    expect(limits.distance.limit).toBe(10);
    expect(limits.lifeSpan.limit).toBe(4);
    expect(limits.media.limit).toBe(5);
  });

  it("disallows posting and templates once limits are reached", () => {
    (useGlobalContext as any).mockReturnValue({
      user: {
        plan: { ...plan, level: 4 },
        templates: [{}, {}],
        flyers: [
          { postingMethod: "remote" },
          { postingMethod: "onLocation" },
          { postingMethod: "onLocation" },
        ],
      },
    });
    const { result } = renderHook(() => useGetUserLimits());
    expect(result.current.templates.isAllowed).toBe(false);
    expect(result.current.remotePosting.isAllowed).toBe(false);
    expect(result.current.onLocationPosting.isAllowed).toBe(false);
    expect(result.current.canUpgrade).toBe(false);
  });
});
