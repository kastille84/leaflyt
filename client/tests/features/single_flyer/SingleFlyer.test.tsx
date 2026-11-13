import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SingleFlyer from "../../../src/features/single_flyer/SingleFlyer";
import * as GlobalContext from "../../../src/context/GlobalContext";
import * as apiFlyers from "../../../src/services/apiFlyers";
import { QueryClientProviderWrapper } from "../../test-utils";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/services/apiFlyers");
vi.mock("../../../src/ui/Flyer/FlyerBlockInteractive", () => ({
  default: ({ flyer }: any) => (
    <div data-testid="flyer-block-interactive">{flyer.title}</div>
  ),
}));

const user = userEvent.setup();
const getUserGeo = vi.fn();
const setIsSelectingNewPlace = vi.fn();
const setBottomSlideInType = vi.fn();
const setIsOpenBottomSlideIn = vi.fn();

function mockUser(userValue: any) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    user: userValue,
    getUserGeo,
    setIsSelectingNewPlace,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
  }));
}

function renderSingleFlyer() {
  const Wrapper = QueryClientProviderWrapper();
  return render(
    <Wrapper>
      <MemoryRouter initialEntries={["/flyer/abc"]}>
        <Routes>
          <Route path="/flyer/:id" element={<SingleFlyer />} />
        </Routes>
      </MemoryRouter>
    </Wrapper>,
  );
}

describe("SingleFlyer", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should show a spinner while loading", () => {
    mockUser(null);
    vi.mocked(apiFlyers.getFlyerById).mockReturnValue(new Promise(() => {}));
    renderSingleFlyer();
    expect(screen.getByText("Getting the flyer")).toBeInTheDocument();
  });

  it("should fetch the flyer by route id and show it", async () => {
    mockUser({ id: 1 });
    vi.mocked(apiFlyers.getFlyerById).mockResolvedValue(mockCreatedFlyer);
    renderSingleFlyer();
    expect(
      await screen.findByTestId("flyer-block-interactive"),
    ).toHaveTextContent(mockCreatedFlyer.title);
    expect(apiFlyers.getFlyerById).toHaveBeenCalledWith("abc");
    expect(screen.queryByText("Have something to say?")).not.toBeInTheDocument();
  });

  it("should offer guided actions to logged-out visitors", async () => {
    mockUser(null);
    vi.mocked(apiFlyers.getFlyerById).mockResolvedValue(mockCreatedFlyer);
    renderSingleFlyer();
    await screen.findByTestId("flyer-block-interactive");

    await user.click(screen.getByRole("button", { name: /Sign up for Free/ }));
    expect(setBottomSlideInType).toHaveBeenCalledWith("signup");
    expect(setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);

    await user.click(
      screen.getByRole("button", { name: /Find a Board Near you/ }),
    );
    expect(setIsSelectingNewPlace).toHaveBeenCalledWith(true);
    expect(getUserGeo).toHaveBeenCalled();
  });

  it("should show an error message when the flyer cannot be loaded", async () => {
    mockUser({ id: 1 });
    vi.mocked(apiFlyers.getFlyerById).mockRejectedValue(new Error("nope"));
    renderSingleFlyer();
    await waitFor(() =>
      expect(
        screen.getByText(/Could not retrieve the flyer/),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByTestId("flyer-block-interactive"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Have something to say?")).not.toBeInTheDocument();
  });

  it("should offer guided actions alongside the error for logged-out visitors", async () => {
    mockUser(null);
    vi.mocked(apiFlyers.getFlyerById).mockRejectedValue(new Error("nope"));
    renderSingleFlyer();
    await screen.findByText(/Could not retrieve the flyer/);
    expect(screen.getByText("Have something to say?")).toBeInTheDocument();
  });
});
