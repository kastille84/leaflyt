import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components
import ExistingAssetsList from "../../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsList";
import ExistingAssetListItem from "../../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsListItem";

// context
import * as GlobalContext from "../../../../../src/context/GlobalContext";
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";

// hooks

// services

// fixture
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { userFromContext } from "../../../../fixtures/authentication/login";
import { mockUseGlobalContextReturnObj } from "../../../../fixtures/context/globalContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";

// userEvent

//mocks
vi.mock("../../../../../src/context/GlobalContext");
vi.mock("../../../../../src/context/AssetSelectionContext");
vi.mock(
  "../../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsListItem"
);

describe("ExistingAssetsList", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
    }));
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
      assetsList: mockAssetsList,
    }));
    vi.mocked(ExistingAssetListItem).mockImplementation(() => {
      return <div data-testid="existing-asset-list-item" />;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render existing assets list", async () => {
    // assemble
    // act
    render(<ExistingAssetsList />);
    // assert
    await waitFor(() => {
      expect(screen.getAllByTestId("existing-asset-list-item")).toBeDefined();
    });
  });
});
