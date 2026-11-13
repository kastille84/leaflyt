import { render } from "@testing-library/react";
import { useMap } from "@vis.gl/react-google-maps";
import MyRectangle from "../../../src/features/map/MyRectangle";

vi.mock("@vis.gl/react-google-maps");

const setMapMock = vi.fn();
const rectangleCtor = vi.fn();
const bounds = { north: 1, south: 0, east: 1, west: 0 };

describe("MyRectangle", () => {
  beforeEach(() => {
    (globalThis as any).google = {
      maps: {
        Rectangle: class {
          constructor(opts: any) {
            rectangleCtor(opts);
          }
          setMap = setMapMock;
        },
      },
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
    delete (globalThis as any).google;
  });

  it("should render nothing and skip the rectangle without a map", () => {
    vi.mocked(useMap).mockReturnValue(null);
    const { container } = render(<MyRectangle bounds={bounds} />);
    expect(container).toBeEmptyDOMElement();
    expect(rectangleCtor).not.toHaveBeenCalled();
  });

  it("should draw a rectangle with default and override options", () => {
    const map = {} as any;
    vi.mocked(useMap).mockReturnValue(map);
    render(<MyRectangle bounds={bounds} options={{ strokeColor: "#000" }} />);
    expect(rectangleCtor).toHaveBeenCalledWith(
      expect.objectContaining({
        bounds,
        map,
        strokeColor: "#000",
        fillColor: "#226e33",
        strokeWeight: 3,
      }),
    );
  });

  it("should remove the rectangle on unmount", () => {
    vi.mocked(useMap).mockReturnValue({} as any);
    const { unmount } = render(<MyRectangle bounds={bounds} />);
    unmount();
    expect(setMapMock).toHaveBeenCalledWith(null);
  });
});
