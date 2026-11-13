import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

// components
import SelectedAssetsListItemTimed from "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsListItemTimed";

// context
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";
// hooks
import useAssetMutations from "../../../../../src/features/assets/useAssetMutations";
import useGetUserProfileById from "../../../../../src/hooks/useGetUserProfileById";
// services

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";
import { userFromContext } from "../../../../fixtures/authentication/login";
import { QueryClientProviderWrapperWithBrowserRouter } from "../../../../test-utils";
// userEvent

// mocks
vi.mock("../../../../../src/context/AssetSelectionContext");
vi.mock("../../../../../src/features/assets/useAssetMutations");
vi.mock("../../../../../src/hooks/useGetUserProfileById");
vi.mock("react-hot-toast");

describe("SelectAssetsListItemTimed", () => {
  let mockHandleDeleteAsset = vi.fn();
  beforeEach(() => {
    // vi.useFakeTimers();
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementationOnce(() => ({
      ...mockAssetSelectionContextReturnObj,
    }));
  });
  afterEach(() => {
    // vi.useRealTimers();
    vi.clearAllMocks();
  });
  it("should render video", async () => {
    render(
      <SelectedAssetsListItemTimed
        asset={mockAssetsList[0]}
        idx={0}
        handleDeleteAsset={mockHandleDeleteAsset}
      />,
      { wrapper: QueryClientProviderWrapperWithBrowserRouter() }
    );

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });
  describe("countdown and saving", () => {
    const addAssetFnMock = vi.fn();
    const setTimedAssetsListMock = vi.fn();
    const TOTAL_SECONDS = 8 * 60;

    function mockProfileStatus(status: string) {
      vi.mocked(useGetUserProfileById).mockReturnValue({
        status,
        userProfile: userFromContext,
      } as ReturnType<typeof useGetUserProfileById>);
    }

    function renderItem(asset = mockAssetsList[1]) {
      return render(
        <SelectedAssetsListItemTimed
          asset={asset}
          idx={3}
          handleDeleteAsset={mockHandleDeleteAsset}
        />,
        { wrapper: QueryClientProviderWrapperWithBrowserRouter() },
      );
    }

    function tick(seconds: number) {
      for (let i = 0; i < seconds; i++) {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
      }
    }

    beforeEach(() => {
      vi.useFakeTimers();
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext,
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        setTimedAssetsList: setTimedAssetsListMock,
      }));
      vi.mocked(useAssetMutations).mockReturnValue({
        addAssetFn: addAssetFnMock,
      } as unknown as ReturnType<typeof useAssetMutations>);
      mockProfileStatus("pending");
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should show the image url for images and the thumbnail for videos", () => {
      const { unmount } = renderItem(mockAssetsList[1]);
      expect(screen.getByRole("img").getAttribute("src")).toBe(
        mockAssetsList[1].url,
      );
      unmount();
      renderItem(mockAssetsList[0]);
      expect(screen.getByRole("img").getAttribute("src")).toBe(
        mockAssetsList[0].thumbnail_url,
      );
    });

    it("should count down from 08:00", () => {
      renderItem();
      expect(screen.getByText("08:00")).toBeTruthy();
      tick(1);
      expect(screen.getByText("07:59")).toBeTruthy();
      tick(60);
      expect(screen.getByText("06:59")).toBeTruthy();
    });

    it("should delete the asset by index from the cross", () => {
      renderItem();
      const cross = screen
        .getByTestId("selected-assets-list-item-timed")
        .querySelector("span")!;
      act(() => {
        cross.click();
      });
      expect(mockHandleDeleteAsset).toHaveBeenCalledWith(3);
    });

    it("should not save the asset before the time runs out", () => {
      renderItem();
      tick(TOTAL_SECONDS);
      expect(addAssetFnMock).not.toHaveBeenCalled();
    });

    it("should save the asset to the library when the time runs out", () => {
      renderItem();
      tick(TOTAL_SECONDS + 1);
      expect(addAssetFnMock).toHaveBeenCalledWith(
        mockAssetsList[1],
        expect.any(Object),
      );
      expect(screen.getByText("Added to Assets")).toBeTruthy();
      expect(screen.queryByText(/^\d\d:\d\d$/)).toBeNull();
    });

    it("should toast when saving the asset fails", () => {
      renderItem();
      tick(TOTAL_SECONDS + 1);
      act(() => {
        addAssetFnMock.mock.calls[0][1].onError();
      });
      expect(toast.error).toHaveBeenCalledWith(
        "Could not add asset to assets library. Re-trying again..",
      );
    });

    it("should hide the cross and update the timed list once the asset is saved", () => {
      mockProfileStatus("success");
      renderItem();
      tick(TOTAL_SECONDS + 1);
      expect(
        screen
          .getByTestId("selected-assets-list-item-timed")
          .querySelector("span"),
      ).not.toBeNull();
      expect(setTimedAssetsListMock).not.toHaveBeenCalled();
      act(() => {
        addAssetFnMock.mock.calls[0][1].onSuccess();
      });
      expect(
        screen
          .getByTestId("selected-assets-list-item-timed")
          .querySelector("span"),
      ).toBeNull();
      expect(setTimedAssetsListMock).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
