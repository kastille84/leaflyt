import { cleanup, render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ImageCarousel from "../../../../src/ui/Flyer/SubComponents/ImageCarousel";
import * as GlobalContext from "../../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";

vi.mock("../../../../src/context/GlobalContext");

const image = (n: number) =>
  ({
    secure_url: `https://example.com/img-${n}.jpg`,
    resource_type: "image",
  }) as any;
const video = (n: number) =>
  ({
    secure_url: `https://example.com/vid-${n}.mp4`,
    resource_type: "video",
  }) as any;

function setup(props: any = {}, contextImages: any = null) {
  vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
    ...mockUseGlobalContextReturnObj,
    contextImages,
  } as any);
  return render(<ImageCarousel {...props} />);
}

const fullscreenButton = (container: HTMLElement) =>
  container.querySelector(".image-gallery-fullscreen-button") as HTMLElement;

describe("ImageCarousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  // the component finds the fullscreen button with document.querySelector, so
  // a leftover gallery from a previous test would receive its class toggles
  afterEach(cleanup);

  it("should use the provided images from a flyer block", () => {
    const { container } = setup({ fromFlyerBlock: true, images: [image(1)] }, [
      image(9),
    ]);
    expect(container.querySelector("img[src$='img-1.jpg']")).not.toBeNull();
    expect(container.querySelector("img[src$='img-9.jpg']")).toBeNull();
  });

  it("should use the context images otherwise", () => {
    const { container } = setup({ images: [image(1)] }, [image(9)]);
    expect(container.querySelector("img[src$='img-9.jpg']")).not.toBeNull();
    expect(container.querySelector("img[src$='img-1.jpg']")).toBeNull();
  });

  it("should render a video slide with controls", () => {
    const { container } = setup({ fromFlyerBlock: true, images: [video(1)] });
    const el = container.querySelector("video") as HTMLVideoElement;
    expect(el).not.toBeNull();
    expect(el.controls).toBe(true);
    expect(el.src).toContain("vid-1.mp4");
  });

  it("should show the fullscreen button when the first slide is an image", () => {
    const { container } = setup({ fromFlyerBlock: true, images: [image(1)] });
    expect(fullscreenButton(container)).not.toHaveClass("hide");
  });

  it("should hide the fullscreen button when the first slide is a video", () => {
    const { container } = setup({
      fromFlyerBlock: true,
      images: [video(1), image(2)],
    });
    expect(fullscreenButton(container)).toHaveClass("hide");
  });

  it("should toggle the fullscreen button as slides change", async () => {
    const { container } = setup({
      fromFlyerBlock: true,
      images: [image(1), video(2), image(3)],
    });
    expect(fullscreenButton(container)).not.toHaveClass("hide");

    await userEvent.click(
      container.querySelector(".image-gallery-right-nav") as HTMLElement,
    );
    await waitFor(() => expect(fullscreenButton(container)).toHaveClass("hide"));
    // the gallery ignores clicks until its slide transition ends
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await userEvent.click(
      container.querySelector(".image-gallery-right-nav") as HTMLElement,
    );
    await waitFor(() => expect(fullscreenButton(container)).not.toHaveClass("hide"));
  });

  it("should show bullets only for more than one slide", () => {
    const { container, rerender } = setup({
      fromFlyerBlock: true,
      images: [image(1)],
    });
    expect(container.querySelector(".image-gallery-bullets")).toBeNull();

    rerender(<ImageCarousel fromFlyerBlock images={[image(1), image(2)]} />);
    expect(container.querySelector(".image-gallery-bullets")).not.toBeNull();
    expect(container.querySelectorAll(".image-gallery-bullet")).toHaveLength(2);
  });
});
