import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";
import ImagePreview from "../../../src/ui/Form/ImagePreview";
import ImagePreviewItem from "../../../src/ui/Form/ImagePreviewItem";
import ImagePreviewItemTimed from "../../../src/ui/Form/ImagePreviewItemTimed";
import { deleteFileOverTime } from "../../../src/services/cloudinary";
import { getImagePreview, getImagePreviewItem } from "../../test-utils";
import { resultInfo } from "../../fixtures/cloudinary/responses";

vi.mock("react-hot-toast");
vi.mock("../../../src/services/cloudinary");

const second = { ...resultInfo, public_id: "second-image" };

// React batches state updates inside a single act, so tick one second per act
async function advanceSeconds(seconds: number) {
  for (let i = 0; i < seconds; i++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
  }
}

describe("ImagePreviewItem", () => {
  it("should render the thumbnail and call handleDeleteImage with its index", async () => {
    const handleDeleteImage = vi.fn();
    render(
      <ImagePreviewItem
        imageUrl={resultInfo as any}
        idx={3}
        handleDeleteImage={handleDeleteImage}
      />,
    );
    const { imagePreviewItem, deleteButton } = getImagePreviewItem(3);
    expect(imagePreviewItem.querySelector("img")).toHaveAttribute(
      "src",
      resultInfo.thumbnail_url,
    );
    await userEvent.setup().click(deleteButton!);
    expect(handleDeleteImage).toHaveBeenCalledWith(3);
  });
});

describe("ImagePreviewItemTimed", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it("should show the countdown in MM:SS and delete on click", async () => {
    const handleDeleteImage = vi.fn();
    render(
      <ImagePreviewItemTimed
        imageUrl={resultInfo as any}
        idx={0}
        handleDeleteImage={handleDeleteImage}
      />,
    );
    expect(screen.getByText("08:00")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(screen.getByText("07:59")).toBeInTheDocument();
    getImagePreviewItem(0).deleteButton!.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(handleDeleteImage).toHaveBeenCalledWith(0);
  });

  it("should switch to the auto-delete warning in the last minute", async () => {
    render(
      <ImagePreviewItemTimed
        imageUrl={resultInfo as any}
        idx={0}
        handleDeleteImage={vi.fn()}
      />,
    );
    await advanceSeconds(7 * 60);
    expect(screen.getByText(/Auto delete/)).toBeInTheDocument();
    expect(screen.getByText(/in 0\d:\d\d/)).toBeInTheDocument();
  });

  it("should delete itself when the time runs out", async () => {
    const handleDeleteImage = vi.fn();
    render(
      <ImagePreviewItemTimed
        imageUrl={resultInfo as any}
        idx={2}
        handleDeleteImage={handleDeleteImage}
      />,
    );
    await advanceSeconds(8 * 60 + 2);
    expect(handleDeleteImage).toHaveBeenCalledWith(2);
  });
});

describe("ImagePreview", () => {
  afterEach(() => vi.clearAllMocks());

  it("should render one timed item per file with the cleanup notice", () => {
    render(
      <ImagePreview
        fileUrlArr={[resultInfo, second] as any}
        setValue={vi.fn()}
      />,
    );
    expect(getImagePreview().imagePreview).toBeInTheDocument();
    expect(getImagePreviewItem(0).imagePreviewItem).toBeInTheDocument();
    expect(getImagePreviewItem(1).imagePreviewItem).toBeInTheDocument();
    expect(screen.getByText(/deleted after 8 minutes/)).toBeInTheDocument();
  });

  it("should delete from cloudinary and update the form value", async () => {
    vi.mocked(deleteFileOverTime).mockResolvedValue(undefined);
    const setValue = vi.fn();
    render(
      <ImagePreview
        fileUrlArr={[resultInfo, second] as any}
        setValue={setValue}
      />,
    );
    await userEvent.setup().click(getImagePreviewItem(0).deleteButton!);
    await waitFor(() => expect(setValue).toHaveBeenCalled());
    expect(deleteFileOverTime).toHaveBeenCalledWith(resultInfo);
    expect(setValue).toHaveBeenCalledWith("fileUrlArr", [second]);
  });

  it("should toast an error when the cloudinary delete fails", async () => {
    vi.mocked(deleteFileOverTime).mockRejectedValue(new Error("nope"));
    const setValue = vi.fn();
    render(
      <ImagePreview fileUrlArr={[resultInfo] as any} setValue={setValue} />,
    );
    await userEvent.setup().click(getImagePreviewItem(0).deleteButton!);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error deleting image"),
    );
    expect(setValue).not.toHaveBeenCalled();
  });
});
