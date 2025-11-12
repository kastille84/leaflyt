import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

// components
import SelectedAssetsList from "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsList";
import SelectedAssetsListItem from "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsListItem";
import SelectedAssetsListItemTimed from "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsListItemTimed";

// context
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";

// hooks

// services
import * as cloudinaryServices from "../../../../../src/services/cloudinary";

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";
import { mockTimedAssetsList } from "../../../../fixtures/assets/assets";
import { set } from "react-hook-form";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

// userEvent

// mocks
vi.mock("../../../../../src/context/AssetSelectionContext");
vi.mock(
  "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsListItem"
);
vi.mock(
  "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsListItemTimed"
);
vi.mock("react-hot-toast");
vi.mock("../../../../../src/services/cloudinary");

describe("SelectedAssetsList", () => {
  let setAssetsListMock = vi.fn();
  let setTimedAssetsListMock = vi.fn();
  beforeEach(() => {
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
      assetsList: [...mockTimedAssetsList, ...mockAssetsList],
      timedAssetsList: mockTimedAssetsList,
      setAssetsList: setAssetsListMock,
      setTimedAssetsList: setTimedAssetsListMock,
    }));

    vi.mocked(SelectedAssetsListItem).mockImplementation(() => {
      return <div data-testid="selected-assets-list-item" />;
    });

    vi.mocked(SelectedAssetsListItemTimed).mockImplementation(() => {
      return <div data-testid="selected-assets-list-item-timed" />;
    });
    vi.mocked(cloudinaryServices.deleteFileOverTime).mockImplementation(() => {
      return Promise.resolve({});
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render selected assets list", async () => {
    // assemble
    // act
    render(
      <SelectedAssetsList
        selectedAssets={[...mockTimedAssetsList, ...mockAssetsList]}
      />
    );
    // assert
    await waitFor(() => {
      expect(screen.getAllByTestId("selected-assets-list-item")).toBeDefined();
    });
    await waitFor(() => {
      expect(
        screen.getAllByTestId("selected-assets-list-item-timed")
      ).toBeDefined();
    });
    // trigger handleDeleteAsset
    await act(async () => {
      SelectedAssetsListItemTimed.mock.calls[0][0].handleDeleteAsset(
        // mockTimedAssetsList[0].public_id
        0
      );
    });
    // purposely trigger setting asset list
    await act(async () => {
      setAssetsListMock.mock.calls[0][0]([]);
    });
    await waitFor(() => {
      expect(setAssetsListMock).toHaveBeenCalled();
    });
    // purposely trigger setting timed asset list
    await act(async () => {
      setTimedAssetsListMock.mock.calls[0][0]([]);
    });
    await waitFor(() => {
      expect(setTimedAssetsListMock).toHaveBeenCalled();
    });
  });

  it("should fail delete timed asset", async () => {
    // assemble
    vi.mocked(cloudinaryServices.deleteFileOverTime).mockImplementation(() => {
      return Promise.reject({});
    });
    // act
    render(
      <SelectedAssetsList
        selectedAssets={[...mockTimedAssetsList, ...mockAssetsList]}
      />
    );
    // assert
    await waitFor(() => {
      expect(screen.getAllByTestId("selected-assets-list-item")).toBeDefined();
    });
    await waitFor(() => {
      expect(
        screen.getAllByTestId("selected-assets-list-item-timed")
      ).toBeDefined();
    });
    // trigger handleDeleteAsset
    await act(async () => {
      SelectedAssetsListItemTimed.mock.calls[0][0].handleDeleteAsset(
        // mockTimedAssetsList[0].public_id
        0
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("should not render selected assets list", async () => {
    // assemble
    // act
    render(<SelectedAssetsList selectedAssets={[]} />);
    // assert
    await waitFor(() => {
      expect(screen.queryByTestId("selected-assets-list-item")).toBeFalsy();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("selected-assets-list-item-timed")
      ).toBeFalsy();
    });
  });
});
