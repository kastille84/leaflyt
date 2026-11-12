import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainNav from "../../src/ui/MainNav";
import { useGlobalContext } from "../../src/context/GlobalContext";
import useGetUserLimits from "../../src/hooks/useGetUserLimits";
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

vi.mock("../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("../../src/hooks/useGetUserLimits", () => ({ default: vi.fn() }));

function setup({ registered = true, selectedPlace = null as any } = {}) {
  (useGlobalContext as any).mockReturnValue({
    ...mockUseGlobalContextReturnObj,
    selectedPlace,
  });
  (useGetUserLimits as any).mockReturnValue({ registered, level: 1 });
  render(
    <MemoryRouter>
      <MainNav />
    </MemoryRouter>,
  );
}

const registeredLinks = [
  ["My Area", "/dashboard/my-area"],
  ["Templates", "/dashboard/templates"],
  ["Saved Flyers", "/dashboard/saved-flyers"],
  ["Assets", "/dashboard/assets"],
  ["Stats & Data", "/dashboard/statistics"],
  ["Account", "/dashboard/account"],
];

describe("MainNav", () => {
  it("should always link to Home", () => {
    setup({ registered: false });
    const home = screen.getByText("Home").closest("a")!;
    expect(home.getAttribute("href")).toBe("/dashboard/home");
    expect(home.classList.contains("disabled")).toBe(false);
  });

  it("should hide Current Board without a selected place", () => {
    setup();
    expect(screen.queryByText("Current Board")).toBeNull();
  });

  it("should link to the selected place's board", () => {
    setup({ selectedPlace: { id: "abc" } });
    expect(
      screen.getByText("Current Board").closest("a")!.getAttribute("href"),
    ).toBe("/dashboard/board/abc");
  });

  it.each(registeredLinks)(
    "should enable %s for registered users",
    (name, href) => {
      setup();
      const link = screen.getByText(name).closest("a")!;
      expect(link.getAttribute("href")).toBe(href);
      expect(link.classList.contains("disabled")).toBe(false);
    },
  );

  it.each(registeredLinks)(
    "should disable %s for unregistered users",
    (name) => {
      setup({ registered: false });
      expect(
        screen.getByText(name).closest("a")!.classList.contains("disabled"),
      ).toBe(true);
    },
  );
});
