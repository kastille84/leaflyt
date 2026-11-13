import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import toast from "react-hot-toast";
import FlaggedModal from "../../../src/ui/Modals/FlaggedModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useCreateUnregisteredFlyer from "../../../src/features/createFlyer/useCreateUnregisteredFlyer";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/createFlyer/useCreateUnregisteredFlyer");
vi.mock("react-hot-toast");

describe("FlaggedModal", () => {
  const setShowFlaggedModal = vi.fn();
  const setSelectedFlyer = vi.fn();
  const flagFlyerFn = vi.fn();

  function mockContext(user: unknown = null) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showFlaggedModal: true,
      setShowFlaggedModal,
      setSelectedFlyer,
      selectedFlyer: mockCreatedFlyer,
      selectedPlace: { displayName: { text: "Joe's Diner" } },
      user,
    }));
  }

  function renderModal(queryClient = new QueryClient()) {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FlaggedModal />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  }

  async function submitReason(text = "spam") {
    const user = userEvent.setup();
    await user.type(screen.getByRole("textbox"), text);
    await user.click(screen.getByRole("button", { name: "Report" }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext();
    vi.mocked(useCreateUnregisteredFlyer).mockReturnValue({
      flagFlyerFn,
    } as unknown as ReturnType<typeof useCreateUnregisteredFlyer>);
  });

  it("should ask for a reason", () => {
    renderModal();
    expect(
      screen.getByText(/You are proceeding to flag this flyer/),
    ).toBeInTheDocument();
  });

  it("should clear the selection on Cancel", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(setShowFlaggedModal).toHaveBeenCalledWith(false);
    expect(setSelectedFlyer).toHaveBeenCalledWith(null);
  });

  it("should not report without a reason", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Report" }));
    expect(flagFlyerFn).not.toHaveBeenCalled();
  });

  it("should flag as an anonymous user and refresh the board", async () => {
    flagFlyerFn.mockImplementation((_arg, opts) => opts.onSuccess());
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    renderModal(queryClient);
    await submitReason("spam");
    expect(flagFlyerFn).toHaveBeenCalledWith(
      {
        flyer: mockCreatedFlyer,
        reason: "spam",
        userId: null,
        placeName: "Joe's Diner",
      },
      expect.any(Object),
    );
    expect(toast.success).toHaveBeenCalledWith("Flyer Flagged!");
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["board", undefined] });
    expect(setShowFlaggedModal).toHaveBeenCalledWith(false);
  });

  it("should send the user id when logged in", async () => {
    mockContext({ id: "u1" });
    flagFlyerFn.mockImplementation((_arg, opts) => opts.onSuccess());
    renderModal();
    await submitReason();
    expect(flagFlyerFn.mock.calls[0][0].userId).toBe("u1");
  });

  it("should toast and hide the spinner when flagging fails", async () => {
    flagFlyerFn.mockImplementation((_arg, opts) =>
      opts.onError(new Error("nope")),
    );
    renderModal();
    await submitReason();
    expect(toast.error).toHaveBeenCalledWith(
      "Flyer flagging failed! Try again.",
    );
    expect(screen.queryByText("Flagging the flyer...")).not.toBeInTheDocument();
    expect(setShowFlaggedModal).not.toHaveBeenCalled();
  });

  it("should show the spinner while flagging", async () => {
    flagFlyerFn.mockReset();
    renderModal();
    await submitReason();
    expect(screen.getByText("Flagging the flyer...")).toBeInTheDocument();
  });
});
