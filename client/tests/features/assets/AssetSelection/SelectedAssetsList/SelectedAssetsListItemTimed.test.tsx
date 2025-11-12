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
});
