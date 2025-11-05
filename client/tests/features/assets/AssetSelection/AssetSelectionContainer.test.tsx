import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import AssestSelectionContainer from "../../../../src/features/assets/AssetSelection/AssestSelectionContainer";
import * as GlobalContext from "../../../../src/context/GlobalContext";
import * as AssetsContext from "../../../../src/context/AssetSelectionContext";
import useGetUserLimits from "../../../../src/hooks/useGetUserLimits";
import useGetUserProfileById from "../../../../src/hooks/useGetUserProfileById";
import useAssetMutations from "../../../../src/features/assets/useAssetMutations";
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";
import { userFromContext } from "../../../fixtures/authentication/login";
import { mockAssetSelectionContextReturnObj } from "../../../fixtures/context/assetSelectionContext";
import { planLimitsGarden } from "../../../fixtures/plan/planlimits";

import ExistingAssetsList from "../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsList";
import NewAssetContainer from "../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer";
import { QueryClientProviderWrapper } from "../../../test-utils";
import { mockFileUrlArr } from "../../../fixtures/assets/assets";

const user = userEvent.setup();

// mocks
vi.mock("../../../../src/context/GlobalContext");
vi.mock("../../../../src/context/AssetSelectionContext");
vi.mock("../../../../src/hooks/useGetUserLimits");
vi.mock("../../../../src/hooks/useGetUserProfileById");
vi.mock("../../../../src/features/assets/useAssetMutations");
vi.mock(
  "../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsList"
);
vi.mock(
  "../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer"
);

// fixtures

describe("AssetSelectionContainer", () => {
  let getValuesMock = vi.fn();
  let setValueMock = vi.fn();

  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
      currentFormOptions: {
        getValues: getValuesMock,
        setValue: setValueMock,
      },
    }));
    vi.mocked(AssetsContext.useAssetSelectionContext).mockImplementation(
      () => ({
        ...mockAssetSelectionContextReturnObj,
      })
    );
    vi.mocked(useAssetMutations).mockImplementation(() => ({
      addAssetFn: vi.fn(),
      addAssetFnError: null,
      updateAsset: vi.fn(),
      updateAssetError: null,
      deleteAsset: vi.fn(),
      deleteAssetError: null,
    }));
    vi.mocked(useGetUserLimits).mockImplementation(() => planLimitsGarden);
    vi.mocked(ExistingAssetsList).mockImplementation(() => {
      return <div data-testid="existing-assets-list" />;
    });
    vi.mocked(NewAssetContainer).mockImplementation(() => {
      return <div data-testid="new-asset-container" />;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Display", () => {
    it("should display existing assets list", async () => {
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      await waitFor(() => {
        expect(screen.getByTestId("existing-assets-list")).toBeDefined();
      });
    });
    it("should display new asset container", async () => {
      vi.mocked(AssetsContext.useAssetSelectionContext).mockImplementation(
        () => ({
          ...mockAssetSelectionContextReturnObj,
          selectedOption: "new",
        })
      );
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      const addNewAssetButton = screen.getByRole("button", {
        name: "+ Add New Asset",
      });
      expect(addNewAssetButton).toBeTruthy();
      act(() => {
        user.click(addNewAssetButton);
      });
      await waitFor(async () => {
        expect(await screen.findByTestId("new-asset-container")).toBeDefined();
      });
    });
  });

  describe("AssetsList and TimedAssetsList", () => {
    beforeEach(() => {
      getValuesMock.mockReturnValue(mockFileUrlArr);
    });
    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should add timedAssets on handleDone", async () => {});
    it("should delete timedAssets on handleCancel", async () => {});
  });
});
