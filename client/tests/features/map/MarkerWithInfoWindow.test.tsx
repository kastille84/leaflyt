import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import MarkerWithInfoWindow from "../../../src/features/map/MarkerWithInfoWindow";

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));
vi.mock("@vis.gl/react-google-maps", () => ({
  useAdvancedMarkerRef: () => [vi.fn(), {}],
  AdvancedMarker: ({ onClick }: any) => (
    <button data-testid="marker" onClick={onClick} />
  ),
  InfoWindow: ({ children, onClose }: any) => (
    <div data-testid="info-window">
      {children}
      <button data-testid="info-close" onClick={onClose} />
    </div>
  ),
}));

const user = userEvent.setup();
const position = { lat: 41.5, lng: -74.04 };
const makeFlyer = (extra: any = {}) =>
  ({
    title: "Test Product",
    likes: 3,
    postingMethod: "onLocation",
    created_at: "2025-08-13T12:37:44.903456+00:00",
    place: { name: "Cool Cafe", placeId: "place-1" },
    ...extra,
  }) as any;

describe("MarkerWithInfoWindow", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should hide the info window until the marker is clicked", async () => {
    render(<MarkerWithInfoWindow position={position} flyer={makeFlyer()} />);
    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("marker"));
    expect(screen.getByTestId("info-window")).toBeInTheDocument();
    expect(screen.getByText("Cool Cafe")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("3 Likes")).toBeInTheDocument();
    expect(screen.getByText("Posted On-Location")).toBeInTheDocument();
    expect(screen.getByText("on: 08/13/2025")).toBeInTheDocument();
  });

  it("should toggle the info window off on a second marker click", async () => {
    render(<MarkerWithInfoWindow position={position} flyer={makeFlyer()} />);
    await user.click(screen.getByTestId("marker"));
    await user.click(screen.getByTestId("marker"));
    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();
  });

  it("should close the info window when the maps api closes it", async () => {
    render(<MarkerWithInfoWindow position={position} flyer={makeFlyer()} />);
    await user.click(screen.getByTestId("marker"));
    await user.click(screen.getByTestId("info-close"));
    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();
  });

  it("should say Remotely for remote flyers", async () => {
    render(
      <MarkerWithInfoWindow
        position={position}
        flyer={makeFlyer({ postingMethod: "remote" })}
      />,
    );
    await user.click(screen.getByTestId("marker"));
    expect(screen.getByText("Posted Remotely")).toBeInTheDocument();
  });

  it("should navigate to the board", async () => {
    render(<MarkerWithInfoWindow position={position} flyer={makeFlyer()} />);
    await user.click(screen.getByTestId("marker"));
    // fireEvent: a real click would first blur the marker and close the window
    fireEvent.click(screen.getByRole("button", { name: "Go to Board" }));
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/board/place-1?&pt=r");
  });

  it("should close the info window when focus leaves the container", async () => {
    render(<MarkerWithInfoWindow position={position} flyer={makeFlyer()} />);
    await user.click(screen.getByTestId("marker"));
    expect(screen.getByTestId("info-window")).toBeInTheDocument();
    fireEvent.blur(screen.getByTestId("marker"));
    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();
  });
});
