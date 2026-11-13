import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteFilesModal from "../../../src/ui/Modals/DeleteFilesModal";
import DeleteFlyerTemplateModal from "../../../src/ui/Modals/DeleteFlyerTemplateModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useAssetMutations from "../../../src/features/assets/useAssetMutations";
import useRegisteredFlyer from "../../../src/features/createFlyer/useRegisteredFlyer";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/assets/useAssetMutations");
vi.mock("../../../src/features/createFlyer/useRegisteredFlyer");
vi.mock("react-hot-toast");

function mockContext(overrides: Record<string, unknown>) {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
    ...overrides,
  }));
}

describe("DeleteFilesModal", () => {
  const setShowDeleteFilesModal = vi.fn();
  const setContextImages = vi.fn();
  const setUser = vi.fn();
  const deleteAssetsFn = vi.fn();
  const images = { assetImages: ["a"], assetVideos: [] };

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext({
      showDeleteFilesModal: true,
      setShowDeleteFilesModal,
      setContextImages,
      setUser,
      contextImages: images,
    });
    vi.mocked(useAssetMutations).mockReturnValue({
      deleteAssetsFn,
    } as unknown as ReturnType<typeof useAssetMutations>);
  });

  it("should ask for confirmation", () => {
    render(<DeleteFilesModal />);
    expect(
      screen.getByText("Are you sure you want to delete the file(s)"),
    ).toBeInTheDocument();
  });

  it("should reset state on Cancel", async () => {
    render(<DeleteFilesModal />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(setShowDeleteFilesModal).toHaveBeenCalledWith(false);
    expect(setContextImages).toHaveBeenCalledWith(null);
  });

  it("should update the user and close on successful delete", async () => {
    deleteAssetsFn.mockImplementation((_imgs, opts) =>
      opts.onSuccess({ user: { id: "u1" } }),
    );
    render(<DeleteFilesModal />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteAssetsFn).toHaveBeenCalledWith(images, expect.any(Object));
    expect(setUser).toHaveBeenCalledWith({ id: "u1" });
    expect(toast.success).toHaveBeenCalledWith("Assets deleted!");
    expect(setShowDeleteFilesModal).toHaveBeenCalledWith(false);
  });

  it("should show a spinner while deleting", async () => {
    deleteAssetsFn.mockReset();
    render(<DeleteFilesModal />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Deleting the file(s)...")).toBeInTheDocument();
  });

  it("should toast and hide the spinner when delete fails", async () => {
    deleteAssetsFn.mockImplementation((_imgs, opts) =>
      opts.onError(new Error("nope")),
    );
    render(<DeleteFilesModal />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(toast.error).toHaveBeenCalledWith(
      "Assets deletion failed! Try again.",
    );
    expect(screen.queryByText("Deleting the file(s)...")).not.toBeInTheDocument();
    expect(setUser).not.toHaveBeenCalled();
  });
});

describe("DeleteFlyerTemplateModal", () => {
  const setShowDeleteFlyerTemplateModal = vi.fn();
  const setSelectedTemplate = vi.fn();
  const setSelectedFlyer = vi.fn();
  const setUser = vi.fn();
  const deleteFlyerFn = vi.fn();
  const deleteTemplateFn = vi.fn();
  const template = { id: 1 };
  const flyer = { id: 2 };

  function renderModal(queryClient = new QueryClient()) {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DeleteFlyerTemplateModal />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  }

  function mockModalContext(overrides: Record<string, unknown>) {
    mockContext({
      showDeleteFlyerTemplateModal: true,
      setShowDeleteFlyerTemplateModal,
      setSelectedTemplate,
      setSelectedFlyer,
      setUser,
      ...overrides,
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRegisteredFlyer).mockReturnValue({
      deleteFlyerFn,
      deleteTemplateFn,
    } as unknown as ReturnType<typeof useRegisteredFlyer>);
  });

  it("should ask about a flyer", () => {
    mockModalContext({ selectedFlyer: flyer });
    renderModal();
    expect(
      screen.getByText("Are you sure you want to delete the flyer?"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/standalone/)).not.toBeInTheDocument();
  });

  it("should ask about a template and warn about standalone flyers", () => {
    mockModalContext({ selectedTemplate: template });
    renderModal();
    expect(
      screen.getByText("Are you sure you want to delete the template?"),
    ).toBeInTheDocument();
    expect(screen.getByText(/standalone/)).toBeInTheDocument();
  });

  it("should clear the selection on Cancel", async () => {
    mockModalContext({ selectedFlyer: flyer });
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(setShowDeleteFlyerTemplateModal).toHaveBeenCalledWith(false);
    expect(setSelectedTemplate).toHaveBeenCalledWith(null);
    expect(setSelectedFlyer).toHaveBeenCalledWith(null);
  });

  it("should delete a template and update the user", async () => {
    deleteTemplateFn.mockImplementation((_t, opts) =>
      opts.onSuccess({ user: { id: "u1" } }),
    );
    mockModalContext({ selectedTemplate: template });
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteTemplateFn).toHaveBeenCalledWith(
      template,
      expect.any(Object),
    );
    expect(setUser).toHaveBeenCalledWith({ id: "u1" });
    expect(toast.success).toHaveBeenCalledWith("Template deleted!");
    expect(setShowDeleteFlyerTemplateModal).toHaveBeenCalledWith(false);
  });

  it("should toast when template deletion fails", async () => {
    deleteTemplateFn.mockImplementation((_t, opts) =>
      opts.onError(new Error("nope")),
    );
    mockModalContext({ selectedTemplate: template });
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(toast.error).toHaveBeenCalled();
    expect(screen.queryByText("Deleting...")).not.toBeInTheDocument();
  });

  it("should delete a flyer, update the user and refresh the board", async () => {
    deleteFlyerFn.mockImplementation((_f, opts) =>
      opts.onSuccess({ user: { id: "u1" } }),
    );
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    mockModalContext({ selectedFlyer: flyer });
    renderModal(queryClient);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteFlyerFn).toHaveBeenCalledWith(flyer, expect.any(Object));
    expect(setUser).toHaveBeenCalledWith({ id: "u1" });
    expect(toast.success).toHaveBeenCalledWith("Flyer deleted!");
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["board", undefined] });
    expect(setShowDeleteFlyerTemplateModal).toHaveBeenCalledWith(false);
  });

  it("should toast when flyer deletion fails", async () => {
    deleteFlyerFn.mockImplementation((_f, opts) =>
      opts.onError(new Error("nope")),
    );
    mockModalContext({ selectedFlyer: flyer });
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(toast.error).toHaveBeenCalledWith("Flyer deletion failed! Try again.");
    expect(setUser).not.toHaveBeenCalled();
  });

  it("should show the spinner when nothing is selected to delete", async () => {
    mockModalContext({});
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() =>
      expect(screen.getByText("Deleting...")).toBeInTheDocument(),
    );
    expect(deleteFlyerFn).not.toHaveBeenCalled();
    expect(deleteTemplateFn).not.toHaveBeenCalled();
  });
});
