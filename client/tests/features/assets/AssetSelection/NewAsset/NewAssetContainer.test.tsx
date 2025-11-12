import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components
import NewAssetContainer from "../../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer";
import AssetUpload from "../../../../../src/features/assets/AssetUpload/AssetUpload";

// context
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";

// hooks
import useGetUserLimits from "../../../../../src/hooks/useGetUserLimits";

// services

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import {
  mockAssetsList,
  mockTimedAssetsList,
} from "../../../../fixtures/assets/assets";
import { planLimitsGarden } from "../../../../fixtures/plan/planlimits";
import { set } from "react-hook-form";

// userEvent

// mocks
vi.mock("../../../../../src/context/AssetSelectionContext");
vi.mock("../../../../../src/hooks/useGetUserLimits");
vi.mock("../../../../../src/features/assets/AssetUpload/AssetUpload");

describe("NewAssetContainer", () => {
  let setAssetsListMock = vi.fn();
  let setTimedAssetsListMock = vi.fn();
  beforeEach(() => {
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
      setAssetsList: setAssetsListMock,
      setTimedAssetsList: setTimedAssetsListMock,
    }));
    vi.mocked(useGetUserLimits).mockImplementation(() => planLimitsGarden);
    vi.mocked(AssetUpload).mockImplementation(() => {
      return <div data-testid="asset-upload">Asset Uploadzz</div>;
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render new asset container", async () => {
    // assemble
    // act
    render(<NewAssetContainer />);
    // assert
    await waitFor(() => {
      expect(screen.getByTestId("new-asset-container")).toBeDefined();
    });
    // console.log('assetUpload', AssetUpload.mock.calls[0][0].onAssetAdded);
    // console.log("assetUpload", AssetUpload.mock.calls[0][0]);
    AssetUpload.mock.calls[0][0].onAssetAdded(mockAssetsList[0]);
    await waitFor(() => {
      expect(setAssetsListMock).toHaveBeenCalled();
      expect(setTimedAssetsListMock).toHaveBeenCalled();
    });
  });
});
