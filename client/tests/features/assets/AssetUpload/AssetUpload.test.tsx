import { render, screen, fireEvent } from "@testing-library/react";
import { expect, vi } from "vitest";
import toast from "react-hot-toast";
import AssetUpload from "../../../../src/features/assets/AssetUpload/AssetUpload";

// Mock toast
const toastErrorMock = vi.fn();
vi.mock("react-hot-toast");

describe("AssetUpload", () => {
  let createUploadWidgetMock: any;
  let openMock: any;
  let closeMock: any;

  beforeEach(() => {
    openMock = vi.fn();
    closeMock = vi.fn();
    createUploadWidgetMock = vi.fn((_opts, cb) => ({
      open: openMock,
      close: closeMock,
    }));
    (window as any).cloudinary = {
      createUploadWidget: createUploadWidgetMock,
    };
    vi.mocked(toast.error).mockImplementation(toastErrorMock);
    toastErrorMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders container, label, button, and info text", () => {
    render(
      <AssetUpload level={1} onAssetAdded={vi.fn()} currentTotalAssets={0} />,
    );
    expect(screen.getByTestId("assetUpload-container")).toBeInTheDocument();
    expect(screen.getByText("File Upload")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Upload Asset/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Uploaded files can be deleted/i),
    ).toBeInTheDocument();
  });

  it("disables button if currentTotalAssets >= maxFiles", () => {
    render(
      <AssetUpload level={0} onAssetAdded={vi.fn()} currentTotalAssets={1} />,
    );
    const btn = screen.getByRole("button", { name: /Upload Asset/i });
    expect(btn).toBeDisabled();
  });

  it("enables button if currentTotalAssets < maxFiles", () => {
    render(
      <AssetUpload level={2} onAssetAdded={vi.fn()} currentTotalAssets={1} />,
    );
    const btn = screen.getByRole("button", { name: /Upload Asset/i });
    expect(btn).not.toBeDisabled();
  });

  it("calls cloudinary.createUploadWidget and opens widget on button click", () => {
    render(
      <AssetUpload level={1} onAssetAdded={vi.fn()} currentTotalAssets={0} />,
    );
    const btn = screen.getByRole("button", { name: /Upload Asset/i });
    fireEvent.click(btn);
    expect(createUploadWidgetMock).toHaveBeenCalled();
    expect(openMock).toHaveBeenCalled();
  });

  it("calls onAssetAdded and closes widget on successful upload", () => {
    const onAssetAddedMock = vi.fn();
    render(
      <AssetUpload
        level={1}
        onAssetAdded={onAssetAddedMock}
        currentTotalAssets={0}
      />,
    );
    const btn = screen.getByRole("button", { name: /Upload Asset/i });
    // Simulate widget callback
    fireEvent.click(btn);
    const callback = createUploadWidgetMock.mock.calls[0][1];
    const result = { event: "success", info: { url: "mock-url" } };
    callback(null, result);
    expect(onAssetAddedMock).toHaveBeenCalledWith(result.info);
    expect(closeMock).toHaveBeenCalled();
  });

  it("shows toast error if upload widget callback returns error", () => {
    render(
      <AssetUpload level={1} onAssetAdded={vi.fn()} currentTotalAssets={0} />,
    );
    const btn = screen.getByRole("button", { name: /Upload Asset/i });
    fireEvent.click(btn);
    const callback = createUploadWidgetMock.mock.calls[0][1];
    const error = { statusText: "Upload failed" };
    callback(error, null);
    expect(toastErrorMock).toHaveBeenCalledWith("Upload failed");
  });

  it("does not call onAssetAdded if event is not success", () => {
    const onAssetAddedMock = vi.fn();
    render(
      <AssetUpload
        level={1}
        onAssetAdded={onAssetAddedMock}
        currentTotalAssets={0}
      />,
    );
    const btn = screen.getByRole("button", { name: /Upload Asset/i });
    fireEvent.click(btn);
    const callback = createUploadWidgetMock.mock.calls[0][1];
    callback(null, { event: "error", info: {} });
    expect(onAssetAddedMock).not.toHaveBeenCalled();
  });
});
