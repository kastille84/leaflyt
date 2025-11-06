import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

// components
import ExistingAssetsList from "../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsList";
import AssestSelectionContainer from "../../../../src/features/assets/AssetSelection/AssestSelectionContainer";
import NewAssetContainer from "../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer";

// context
import * as GlobalContext from "../../../../src/context/GlobalContext";
import * as AssetSelectionContext from "../../../../src/context/AssetSelectionContext";

// hooks
import useGetUserLimits from "../../../../src/hooks/useGetUserLimits";
import useAssetMutations from "../../../../src/features/assets/useAssetMutations";

// services
import * as cloudinaryServices from "../../../../src/services/cloudinary";

// fixtures
import { planLimitsGarden } from "../../../fixtures/plan/planlimits";
import { mockAssetSelectionContextReturnObj } from "../../../fixtures/context/assetSelectionContext";
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";
import { userFromContext } from "../../../fixtures/authentication/login";
import {
  mockAssetsList,
  mockFileUrlArr,
  mockTimedAssetsList,
} from "../../../fixtures/assets/assets";

// utils
import { QueryClientProviderWrapper } from "../../../test-utils";

// userEvent
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
vi.mock("react-hot-toast");
vi.mock("../../../../src/services/cloudinary");

describe("AssetSelectionContainer", () => {
  let getValuesMock = vi.fn();
  let setValueMock = vi.fn();
  let addAssetFnMock = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
      currentFormOptions: {
        getValues: getValuesMock,
        setValue: setValueMock,
      },
    }));
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
    }));
    vi.mocked(useAssetMutations).mockImplementation(() => ({
      addAssetFn: addAssetFnMock,
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
    vi.mocked(cloudinaryServices.deleteFileOverTime).mockImplementation(() => {
      return {};
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
      const existingAssetsButton = screen.getByRole("button", {
        name: "Select From Existing",
      });
      expect(existingAssetsButton).toBeTruthy();
      act(() => {
        user.click(existingAssetsButton);
      });
    });
    it("should display new asset container", async () => {
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        selectedOption: "new",
      }));
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
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        assetsList: mockAssetsList,
        timedAssetsList: mockTimedAssetsList,
      }));
    });
    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should add timedAssets and set all assets to form on handleDone", async () => {
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      const doneButton = screen.getByRole("button", {
        name: "Done",
      });
      expect(doneButton).toBeTruthy();
      act(() => {
        user.click(doneButton);
      });
      await waitFor(async () => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it("should reject timedAssets on handleDone", async () => {
      addAssetFnMock.mockRejectedValue(new Error("error"));
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      const doneButton = screen.getByRole("button", {
        name: "Done",
      });
      expect(doneButton).toBeTruthy();
      act(() => {
        user.click(doneButton);
      });
      await waitFor(async () => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it("should delete timedAssets on handleCancel", async () => {
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      const cancelButton = screen.getByRole("button", {
        name: "Cancel",
      });
      expect(cancelButton).toBeTruthy();
      act(() => {
        user.click(cancelButton);
      });
      await waitFor(async () => {
        expect(cloudinaryServices.deleteFileOverTime).toHaveBeenCalled();
      });
    });
  });
});
