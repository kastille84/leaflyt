import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import DeleteAccountModal from "../../../src/ui/Modals/DeleteAccountModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useAssetMutations from "../../../src/features/assets/useAssetMutations";
import useStripe from "../../../src/hooks/useStripe";
import useSignup from "../../../src/features/authentication/useSignup";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/assets/useAssetMutations");
vi.mock("../../../src/hooks/useStripe");
vi.mock("../../../src/features/authentication/useSignup");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => mockNavigate,
}));

describe("DeleteAccountModal", () => {
  const setShowDeleteAccountModal = vi.fn();
  const deleteAllAssetsAsync = vi.fn();
  const deleteCustomerAsync = vi.fn();
  const deleteUserAsyncFn = vi.fn();
  const sendDeletedUserEmailAsyncFn = vi.fn();

  const baseUser = {
    id: "u1",
    email: "a@b.com",
    name: "Biz",
    firstName: "Ann",
    lastName: "Lee",
    customers: [{ customerId: "cus_1" }],
    assets: [
      { asset_info: { resource_type: "video", public_id: "v1" } },
      { asset_info: { resource_type: "image", public_id: "i1" } },
      { asset_info: { resource_type: "image", public_id: "i2" } },
    ],
  };

  function mockUser(user: unknown) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showDeleteAccountModal: true,
      setShowDeleteAccountModal,
      user,
    }));
  }

  function renderModal() {
    return render(
      <BrowserRouter>
        <DeleteAccountModal />
      </BrowserRouter>,
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    deleteAllAssetsAsync.mockResolvedValue(undefined);
    deleteCustomerAsync.mockResolvedValue(undefined);
    deleteUserAsyncFn.mockResolvedValue(undefined);
    sendDeletedUserEmailAsyncFn.mockResolvedValue(undefined);
    vi.mocked(useAssetMutations).mockReturnValue({
      deleteAllAssetsAsync,
    } as unknown as ReturnType<typeof useAssetMutations>);
    vi.mocked(useStripe).mockReturnValue({
      deleteCustomerAsync,
    } as unknown as ReturnType<typeof useStripe>);
    vi.mocked(useSignup).mockReturnValue({
      deleteUserAsyncFn,
      sendDeletedUserEmailAsyncFn,
    } as unknown as ReturnType<typeof useSignup>);
    mockUser(baseUser);
  });

  it("should warn before deleting", () => {
    renderModal();
    expect(screen.getByText("STOP!")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete your Account?"),
    ).toBeInTheDocument();
  });

  it("should close on Stay with Account", async () => {
    renderModal();
    await userEvent.click(
      screen.getByRole("button", { name: "Stay with Account" }),
    );
    expect(setShowDeleteAccountModal).toHaveBeenCalledWith(false);
  });

  it("should delete assets, customer and user, email them, and go home", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete Account" }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    expect(deleteAllAssetsAsync).toHaveBeenCalledWith({
      assetVideos: ["v1"],
      assetImages: ["i1", "i2"],
    });
    expect(deleteCustomerAsync).toHaveBeenCalledWith({ customerId: "cus_1" });
    expect(deleteUserAsyncFn).toHaveBeenCalled();
    expect(sendDeletedUserEmailAsyncFn).toHaveBeenCalledWith({
      email: "a@b.com",
      name: "Biz",
      firstName: "Ann",
      lastName: "Lee",
    });
    expect(setShowDeleteAccountModal).toHaveBeenCalledWith(false);
  });

  it("should skip Stripe when there is no customer and default missing names", async () => {
    mockUser({
      ...baseUser,
      customers: [],
      assets: undefined,
      name: undefined,
      firstName: undefined,
      lastName: undefined,
    });
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete Account" }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    expect(deleteAllAssetsAsync).toHaveBeenCalledWith({
      assetVideos: [],
      assetImages: [],
    });
    expect(deleteCustomerAsync).not.toHaveBeenCalled();
    expect(sendDeletedUserEmailAsyncFn).toHaveBeenCalledWith({
      email: "a@b.com",
      name: "",
      firstName: "",
      lastName: "",
    });
  });

  it("should show an error and stay when a step fails", async () => {
    deleteUserAsyncFn.mockRejectedValue(new Error("boom"));
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete Account" }));
    expect(
      await screen.findByText("Error: Something went wrong. Please try again."),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(sendDeletedUserEmailAsyncFn).not.toHaveBeenCalled();
    expect(
      screen.queryByText("Deleting your account, this may take a while..."),
    ).not.toBeInTheDocument();
  });
});
