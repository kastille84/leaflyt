import { render, screen } from "@testing-library/react";
import FullCarouselContainer from "../../../src/ui/Flyer/FullCarouselContainer";

vi.mock("../../../src/ui/Flyer/SubComponents/ImageCarousel", () => ({
  default: () => <div data-testid="image-carousel" />,
}));

describe("FullCarouselContainer", () => {
  it("should render the image carousel inside a figure", () => {
    render(<FullCarouselContainer />);
    const carousel = screen.getByTestId("image-carousel");
    expect(carousel.closest("figure")).not.toBeNull();
  });
});
