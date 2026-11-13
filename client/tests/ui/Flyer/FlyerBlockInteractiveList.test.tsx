import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FlyerBlockInteractiveList from "../../../src/ui/Flyer/FlyerBlockInteractiveList";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

vi.mock("../../../src/ui/Flyer/FlyerBlockInteractive", () => ({
  default: () => <div data-testid="flyer-block-interactive" />,
}));

const flyerWith = (extra: any = {}) => ({ ...mockCreatedFlyer, ...extra }) as any;

function getHeader() {
  return screen.getByRole("button", { expanded: false });
}

describe("FlyerBlockInteractiveList", () => {
  it("should show the title, category and subcategory", () => {
    render(<FlyerBlockInteractiveList flyer={flyerWith()} />);
    expect(screen.getByText("Facial Cleanser")).toBeInTheDocument();
    expect(
      screen.getByText("Goods for Sale/Wanted • For Sale"),
    ).toBeInTheDocument();
  });

  it("should omit the subcategory separator when there is none", () => {
    render(
      <FlyerBlockInteractiveList flyer={flyerWith({ subcategory: null })} />,
    );
    expect(screen.getByText("Goods for Sale/Wanted")).toBeInTheDocument();
  });

  it("should handle a missing title", () => {
    render(<FlyerBlockInteractiveList flyer={flyerWith({ title: null })} />);
    expect(screen.getByAltText("flyer")).toBeInTheDocument();
  });

  it("should use the first image as the thumbnail", () => {
    render(<FlyerBlockInteractiveList flyer={flyerWith()} />);
    expect(screen.getByAltText("Facial Cleanser")).toHaveAttribute(
      "src",
      mockCreatedFlyer.fileUrlArr![0].secure_url,
    );
  });

  it("should fall back to the url when there is no secure_url", () => {
    render(
      <FlyerBlockInteractiveList
        flyer={flyerWith({
          fileUrlArr: [{ url: "http://img/x.jpg", resource_type: "image" }],
        })}
      />,
    );
    expect(screen.getByAltText("Facial Cleanser")).toHaveAttribute(
      "src",
      "http://img/x.jpg",
    );
  });

  it("should use the video placeholder for a video", () => {
    render(
      <FlyerBlockInteractiveList
        flyer={flyerWith({
          fileUrlArr: [{ resource_type: "video", secure_url: "v.mp4" }],
        })}
      />,
    );
    expect(screen.getByAltText("Facial Cleanser")).toHaveAttribute(
      "src",
      expect.stringContaining("/images/has_video.png"),
    );
  });

  it.each([[[]], [undefined]])(
    "should use the no-image placeholder when files are %s",
    (fileUrlArr) => {
      render(<FlyerBlockInteractiveList flyer={flyerWith({ fileUrlArr })} />);
      expect(screen.getByAltText("no image")).toHaveAttribute(
        "src",
        expect.stringContaining("/images/no-image-64.png"),
      );
    },
  );

  it("should label an offer cta as Deals", () => {
    render(<FlyerBlockInteractiveList flyer={flyerWith()} />);
    expect(screen.getByText("Deals")).toHaveAttribute(
      "title",
      "20% off for early adopters",
    );
  });

  it("should label a non-offer cta as Request, with a default title", () => {
    render(
      <FlyerBlockInteractiveList
        flyer={flyerWith({ callToAction: { ctaType: "request" } })}
      />,
    );
    expect(screen.getByText("Request")).toHaveAttribute(
      "title",
      "Call to action",
    );
  });

  it.each([
    [{ ctaType: "none" }],
    [null],
    [{ ctaType: "" }],
  ])("should hide the cta badge for %j", (callToAction) => {
    render(<FlyerBlockInteractiveList flyer={flyerWith({ callToAction })} />);
    expect(screen.queryByText("Deals")).toBeNull();
    expect(screen.queryByText("Request")).toBeNull();
  });

  it.each([
    ["#ff0000", "rgba(255, 0, 0, 0.28)"],
    ["#f00", "rgba(255, 0, 0, 0.28)"],
    ["rgb(1, 2, 3)", "rgba(1, 2, 3, 0.28)"],
    ["var(--x)", "rgba(255,165,0,0.28)"],
    [undefined, "rgba(255,165,0,0.28)"],
  ])("should compute the cta glow for %s", (backgroundColor, glow) => {
    const design = {
      ...mockCreatedFlyer.flyerDesign,
      top: { color: "#fff", backgroundColor },
    };
    render(
      <FlyerBlockInteractiveList flyer={flyerWith({ flyerDesign: design })} />,
    );
    const badge = screen.getByText("Deals");
    expect(badge.style.getPropertyValue("--cta-glow").replace(/\s/g, "")).toBe(
      glow.replace(/\s/g, ""),
    );
  });

  it("should use the default design when the flyer has none", () => {
    render(
      <FlyerBlockInteractiveList flyer={flyerWith({ flyerDesign: null })} />,
    );
    expect(screen.getByText("Facial Cleanser")).toBeInTheDocument();
  });

  it("should expand and collapse when the header is clicked", async () => {
    render(<FlyerBlockInteractiveList flyer={flyerWith()} />);
    const header = getHeader();
    const collapsible = screen
      .getByTestId("flyer-block-interactive")
      .closest("[aria-hidden]") as HTMLElement;
    expect(collapsible).toHaveAttribute("aria-hidden", "true");
    expect(collapsible.style.opacity).toBe("0");

    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(collapsible).toHaveAttribute("aria-hidden", "false");
    expect(collapsible.style.opacity).toBe("1");

    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(collapsible.style.opacity).toBe("0");
  });

  it("should fall back to window resize and image load events without ResizeObserver", async () => {
    const original = window.ResizeObserver;
    // @ts-expect-error simulate an environment without ResizeObserver
    delete window.ResizeObserver;
    try {
      const { unmount } = render(
        <FlyerBlockInteractiveList flyer={flyerWith()} />,
      );
      window.dispatchEvent(new Event("resize"));
      await userEvent.click(getHeader());
      expect(screen.getByRole("button", { expanded: true })).toBeInTheDocument();
      unmount();
    } finally {
      window.ResizeObserver = original;
    }
  });

  it("should disconnect the ResizeObserver on unmount", () => {
    const disconnect = vi.fn();
    const original = window.ResizeObserver;
    window.ResizeObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnect;
    } as any;
    try {
      const { unmount } = render(
        <FlyerBlockInteractiveList flyer={flyerWith()} />,
      );
      unmount();
      expect(disconnect).toHaveBeenCalled();
    } finally {
      window.ResizeObserver = original;
    }
  });
});
