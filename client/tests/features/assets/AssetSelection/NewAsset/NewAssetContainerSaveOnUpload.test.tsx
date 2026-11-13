import { act, render, screen, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { QueryClientProviderWrapper } from "../../../../test-utils";

// components
import NewAssetContainer from "../../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer";
import AssetUpload from "../../../../../src/features/assets/AssetUpload/AssetUpload";

// context / hooks
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";
import useGetUserLimits from "../../../../../src/hooks/useGetUserLimits";
import useAssetMutations from "../../../../../src/features/assets/useAssetMutations";
import useGetUserProfileById from "../../../../../src/hooks/useGetUserProfileById";

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";
import { planLimitsGarden } from "../../../../fixtures/plan/planlimits";

// mocks
vi.mock("react-hot-toast");
vi.mock("../../../../../src/context/AssetSelectionContext");
vi.mock("../../../../../src/hooks/useGetUserLimits");
vi.mock("../../../../../src/hooks/useGetUserProfileById");
vi.mock("../../../../../src/features/assets/useAssetMutations");
vi.mock("../../../../../src/features/assets/AssetUpload/AssetUpload");

describe("NewAssetContainer with saveOnUpload", () => {
  const addAssetFnMock = vi.fn();
  const setAssetsListMock = vi.fn();
  const setTimedAssetsListMock = vi.fn();

  beforeEach(() => {
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext,
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
      setAssetsList: setAssetsListMock,
      setTimedAssetsList: setTimedAssetsListMock,
    }));
    vi.mocked(useGetUserLimits).mockReturnValue(planLimitsGarden);
    vi.mocked(useAssetMutations).mockReturnValue({
      addAssetFn: addAssetFnMock,
    } as unknown as ReturnType<typeof useAssetMutations>);
    vi.mocked(AssetUpload).mockImplementation(() => (
      <div data-testid="asset-upload" />
    ));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderAndAdd() {
    render(<NewAssetContainer saveOnUpload />, {
      wrapper: QueryClientProviderWrapper(),
    });
    act(() => {
      vi.mocked(AssetUpload).mock.calls[0][0].onAssetAdded(mockAssetsList[0]);
    });
  }

  it("should save the asset to the library instead of the selection lists", () => {
    renderAndAdd();
    expect(addAssetFnMock).toHaveBeenCalledWith(
      mockAssetsList[0],
      expect.any(Object),
    );
    expect(setAssetsListMock).not.toHaveBeenCalled();
    expect(setTimedAssetsListMock).not.toHaveBeenCalled();
  });

  it("should toast and refresh the profile after the asset is saved", async () => {
    renderAndAdd();
    expect(useGetUserProfileById).toHaveBeenLastCalledWith(false);
    act(() => {
      addAssetFnMock.mock.calls[0][1].onSuccess();
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Asset added to assets library!",
    );
    // the flag flips so the profile query runs
    await waitFor(() =>
      expect(useGetUserProfileById).toHaveBeenLastCalledWith(true),
    );
  });

  it("should toast an error when saving the asset fails", () => {
    renderAndAdd();
    act(() => {
      addAssetFnMock.mock.calls[0][1].onError();
    });
    expect(toast.error).toHaveBeenCalledWith(
      "Could not add asset to assets library. Re-trying again..",
    );
  });

  it("should pass the user's level and current asset total to the uploader", () => {
    render(<NewAssetContainer saveOnUpload />, {
      wrapper: QueryClientProviderWrapper(),
    });
    expect(screen.getByTestId("asset-upload")).toBeTruthy();
    expect(vi.mocked(AssetUpload).mock.calls[0][0]).toMatchObject({
      level: planLimitsGarden.level,
      currentTotalAssets: mockAssetSelectionContextReturnObj.timedAssetsList.length,
    });
  });
});
