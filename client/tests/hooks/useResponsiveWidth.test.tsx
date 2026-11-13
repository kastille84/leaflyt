import { renderHook, act } from "@testing-library/react";
import { useResponsiveWidth } from "../../src/hooks/useResponsiveWidth";

const originalWidth = window.innerWidth;

function setWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
}

describe("useResponsiveWidth", () => {
  afterEach(() => {
    setWidth(originalWidth);
  });

  it.each([
    [300, "s_mobile"],
    [375, "s_mobile"],
    [500, "l_mobile"],
    [700, "s_tablet"],
    [900, "m_tablet"],
    [1100, "l_tablet"],
    [1300, "s_desktop"],
    [1500, "l_desktop"],
  ])("returns the device type for width %i", (width, expected) => {
    setWidth(width);
    const { result } = renderHook(() => useResponsiveWidth());
    expect(result.current).toBe(expected);
  });

  it("updates on window resize and removes the listener on unmount", () => {
    setWidth(300);
    const { result, unmount } = renderHook(() => useResponsiveWidth());
    expect(result.current).toBe("s_mobile");

    act(() => {
      setWidth(1500);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe("l_desktop");

    const removeSpy = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });
});
