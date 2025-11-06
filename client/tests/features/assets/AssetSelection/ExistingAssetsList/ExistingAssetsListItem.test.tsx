import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components

// context

// hooks
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";
// services

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";
import ExistingAssetsListItem from "../../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsListItem";
import { UploadApiResponse } from "cloudinary";

// userEvent

// mocks
vi.mock("../../../../../src/context/AssetSelectionContext");

describe("ExistingAssetsListItem", () => {
  beforeEach(() => {
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
      assetsList: mockAssetsList,
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("should render existing asset list item", async () => {
    // assemble
    // act
    render(<ExistingAssetsListItem asset={mockAssetsList[0]} />);
    // assert
    await waitFor(() => {
      expect(screen.getByTestId("existing-asset-list-item")).toBeDefined();
    });
  });
});
