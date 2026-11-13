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

  describe("Selection limits", () => {
    const existingButton = () =>
      screen.getByRole("button", {
        name: "Select From Existing",
      }) as HTMLButtonElement;
    const newButton = () =>
      screen.getByRole("button", {
        name: "+ Add New Asset",
      }) as HTMLButtonElement;

    it("should enable both buttons when under the limits", () => {
      vi.mocked(useGetUserLimits).mockReturnValue({
        ...planLimitsGarden,
        media: { limit: 5 },
        maxAssets: 10,
      });
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      expect(existingButton().disabled).toBe(false);
      expect(newButton().disabled).toBe(false);
      expect(screen.getByText("5 remaining per flyer")).toBeTruthy();
    });

    it("should disable both buttons when the flyer media limit is reached", () => {
      vi.mocked(useGetUserLimits).mockReturnValue({
        ...planLimitsGarden,
        media: { limit: 2 },
        maxAssets: 10,
      });
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext,
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        assetsList: mockAssetsList.slice(0, 2),
      }));
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      expect(existingButton().disabled).toBe(true);
      expect(newButton().disabled).toBe(true);
      expect(screen.getByText("0 remaining per flyer")).toBeTruthy();
    });

    it("should only disable adding a new asset when the user's asset library is full", () => {
      vi.mocked(useGetUserLimits).mockReturnValue({
        ...planLimitsGarden,
        media: { limit: 5 },
        maxAssets: 2,
      });
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user: { ...userFromContext, assets: [{}, {}] as any },
        currentFormOptions: {
          getValues: getValuesMock,
          setValue: setValueMock,
        },
      }));
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      expect(existingButton().disabled).toBe(false);
      expect(newButton().disabled).toBe(true);
    });

    it("should count timed assets towards the asset library limit", () => {
      vi.mocked(useGetUserLimits).mockReturnValue({
        ...planLimitsGarden,
        media: { limit: 5 },
        maxAssets: 1,
      });
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user: { ...userFromContext, assets: undefined as any },
        currentFormOptions: {
          getValues: getValuesMock,
          setValue: setValueMock,
        },
      }));
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext,
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        timedAssetsList: mockTimedAssetsList,
      }));
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      expect(newButton().disabled).toBe(true);
    });

    it("should switch to the selected option when a button is clicked", async () => {
      const setSelectedOptionMock = vi.fn();
      vi.mocked(useGetUserLimits).mockReturnValue({
        ...planLimitsGarden,
        media: { limit: 5 },
        maxAssets: 10,
      });
      vi.mocked(
        AssetSelectionContext.useAssetSelectionContext,
      ).mockImplementation(() => ({
        ...mockAssetSelectionContextReturnObj,
        setSelectedOption: setSelectedOptionMock,
      }));
      render(<AssestSelectionContainer />, {
        wrapper: QueryClientProviderWrapper(),
      });
      await user.click(newButton());
      expect(setSelectedOptionMock).toHaveBeenCalledWith("new");
      await user.click(existingButton());
      expect(setSelectedOptionMock).toHaveBeenCalledWith("existing");
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
