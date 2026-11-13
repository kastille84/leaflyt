import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components

// context

// hooks
import * as AssetSelectionContext from "../../../../../src/context/AssetSelectionContext";
import * as GlobalContext from "../../../../../src/context/GlobalContext";
// services

// fixtures
import { mockAssetSelectionContextReturnObj } from "../../../../fixtures/context/assetSelectionContext";
import { mockAssetsList } from "../../../../fixtures/assets/assets";
import { mockUseGlobalContextReturnObj } from "../../../../fixtures/context/globalContext";
import ExistingAssetsListItem from "../../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsListItem";
import { UploadApiResponse } from "cloudinary";
import { set } from "react-hook-form";

// userEvent

// mocks
vi.mock("../../../../../src/context/AssetSelectionContext");
vi.mock("../../../../../src/context/GlobalContext");

describe("ExistingAssetsListItem", () => {
  let setAssetsListMock = vi.fn();
  const setContextImagesMock = vi.fn();
  const setBottomSlideInTypeMock = vi.fn();
  const setIsOpenBottomSlideInMock = vi.fn();
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setContextImages: setContextImagesMock,
      setBottomSlideInType: setBottomSlideInTypeMock,
      setIsOpenBottomSlideIn: setIsOpenBottomSlideInMock,
    }));
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext
    ).mockImplementation(() => ({
      ...mockAssetSelectionContextReturnObj,
      assetsList: mockAssetsList,
      setAssetsList: setAssetsListMock,
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
  it("should select existing asset", async () => {
    // assemble
    // act
    render(<ExistingAssetsListItem asset={mockAssetsList[0]} />);
    const checkbox = screen.getByRole("checkbox");
    // assert
    await waitFor(() => {
      expect(checkbox).toBeDefined();
    });
    act(() => {
      userEvent.click(checkbox);
    });
    await waitFor(() => {
      expect(setAssetsListMock).toHaveBeenCalled();
    });
  });
  it("should filter asset from existing assets", async () => {
    // assemble
    // act
    render(<ExistingAssetsListItem asset={mockAssetsList[0]} preChecked />);
    const checkbox = screen.getByRole("checkbox");
    // assert
    await waitFor(() => {
      expect(checkbox).toBeDefined();
    });
    act(() => {
      userEvent.click(checkbox);
    });
    await waitFor(() => {
      expect(setAssetsListMock).toHaveBeenCalled();
    });
  });

  describe("image", () => {
    it("should show the secure url for images and the thumbnail for videos", () => {
      const { unmount } = render(
        <ExistingAssetsListItem asset={mockAssetsList[1]} preChecked={false} />,
      );
      expect(screen.getByRole("img").getAttribute("src")).toBe(
        mockAssetsList[1].secure_url,
      );
      unmount();
      render(
        <ExistingAssetsListItem asset={mockAssetsList[0]} preChecked={false} />,
      );
      expect(screen.getByRole("img").getAttribute("src")).toBe(
        mockAssetsList[0].thumbnail_url,
      );
    });

    it("should open the carousel with the asset when preview is enabled", async () => {
      const user = userEvent.setup();
      render(
        <ExistingAssetsListItem
          asset={mockAssetsList[1]}
          preChecked={false}
          enablePreview
        />,
      );
      await user.click(screen.getByRole("img"));
      expect(setContextImagesMock).toHaveBeenCalledWith([mockAssetsList[1]]);
      expect(setBottomSlideInTypeMock).toHaveBeenCalledWith("carousel");
      expect(setIsOpenBottomSlideInMock).toHaveBeenCalledWith(true);
    });

    it("should do nothing when the image is clicked and preview is disabled", async () => {
      const user = userEvent.setup();
      render(
        <ExistingAssetsListItem asset={mockAssetsList[1]} preChecked={false} />,
      );
      await user.click(screen.getByRole("img"));
      expect(setContextImagesMock).not.toHaveBeenCalled();
      expect(setIsOpenBottomSlideInMock).not.toHaveBeenCalled();
    });
  });

  describe("selection", () => {
    it("should add the asset to the list when checked", async () => {
      const user = userEvent.setup();
      render(
        <ExistingAssetsListItem asset={mockAssetsList[1]} preChecked={false} />,
      );
      await user.click(screen.getByRole("checkbox"));
      const updater = setAssetsListMock.mock.calls[0][0];
      expect(updater([mockAssetsList[0]])).toEqual([
        mockAssetsList[0],
        mockAssetsList[1],
      ]);
    });

    it("should remove only this asset from the list when unchecked", async () => {
      const user = userEvent.setup();
      render(<ExistingAssetsListItem asset={mockAssetsList[1]} preChecked />);
      expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(
        true,
      );
      await user.click(screen.getByRole("checkbox"));
      const updater = setAssetsListMock.mock.calls[0][0];
      expect(updater([mockAssetsList[0], mockAssetsList[1]])).toEqual([
        mockAssetsList[0],
      ]);
    });
  });

  describe("safe delete mode", () => {
    it("should hide the checkbox for an asset that is being used", () => {
      render(
        <ExistingAssetsListItem
          asset={mockAssetsList[1]}
          preChecked={false}
          showCheckboxOnSafeDelete
          isBeingUsed
        />,
      );
      expect(screen.queryByRole("checkbox")).toBeNull();
    });

    it("should show the checkbox for an asset that is not being used", () => {
      render(
        <ExistingAssetsListItem
          asset={mockAssetsList[1]}
          preChecked={false}
          showCheckboxOnSafeDelete
        />,
      );
      expect(screen.getByRole("checkbox")).toBeTruthy();
    });

    it("should show the checkbox for a used asset when safe delete mode is off", () => {
      render(
        <ExistingAssetsListItem
          asset={mockAssetsList[1]}
          preChecked={false}
          isBeingUsed
        />,
      );
      expect(screen.getByRole("checkbox")).toBeTruthy();
    });
  });
});
