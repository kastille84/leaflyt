import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components
import SelectedAssetsListItem from "../../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsListItem";

// context
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";
// hooks

// services

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";

// userEvent

// mocks
// vi.mock("../../../../../src/context/AssetSelectionContext");

describe("SelectedAssetsListItem", () => {
  beforeEach(() => {
    // vi.mock("../../../../../src/context/AssetSelectionContext", () => ({
    //   ...mockAssetSelectionContextReturnObj,
    // }));
  });
  it("should render video", async () => {
    render(<SelectedAssetsListItem asset={mockAssetsList[0]} />);
    await waitFor(() => {
      expect(screen.getByTestId("selected-assets-list-item")).toBeDefined();
    });
  });
  it("should render image", async () => {
    render(<SelectedAssetsListItem asset={mockAssetsList[1]} />);
    await waitFor(() => {
      expect(screen.getByTestId("selected-assets-list-item")).toBeDefined();
    });
  });
});
