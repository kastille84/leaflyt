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

  describe("list items", () => {
    const makeAsset = (
      id: number,
      info: (typeof mockAssetsList)[number],
      flyers: number[] = [],
      templates: number[] = [],
    ) => ({
      id,
      user: 3,
      asset_info: info,
      used_by_flyers: flyers,
      used_by_templates: templates,
    });
    const assets = [
      makeAsset(1, mockAssetsList[0]),
      makeAsset(2, mockAssetsList[1], [10]),
      makeAsset(3, mockAssetsList[2], [], [20]),
    ];

    function mockUser(user: any) {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user,
      }));
    }

    function itemProps() {
      return vi
        .mocked(ExistingAssetListItem)
        .mock.calls.map((call) => call[0]);
    }

    it("should render nothing when there is no user", () => {
      mockUser(null);
      render(<ExistingAssetsList />);
      expect(screen.queryAllByTestId("existing-asset-list-item")).toHaveLength(
        0,
      );
    });

    it("should render an item per asset and pre-check the selected ones", () => {
      mockUser({ ...userFromContext, assets });
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext,
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        assetsList: [mockAssetsList[1]],
      }));
      render(<ExistingAssetsList enablePreview />);
      const props = itemProps();
      expect(props).toHaveLength(3);
      expect(props.map((p) => p.preChecked)).toEqual([false, true, false]);
      expect(props.every((p) => p.enablePreview)).toBe(true);
      expect(props[0].asset).toBe(mockAssetsList[0]);
    });

    it("should not pass usage props by default", () => {
      mockUser({ ...userFromContext, assets });
      render(<ExistingAssetsList />);
      for (const props of itemProps()) {
        expect(props.showCheckboxOnSafeDelete).toBeUndefined();
        expect(props.isBeingUsed).toBeUndefined();
      }
    });

    it("should flag assets used by flyers or templates when only safe to delete", () => {
      mockUser({ ...userFromContext, assets });
      render(<ExistingAssetsList onlySafeToDelete />);
      const props = itemProps();
      expect(props.every((p) => p.showCheckboxOnSafeDelete)).toBe(true);
      expect(props.map((p) => p.isBeingUsed)).toEqual([false, true, true]);
    });
  });
});
