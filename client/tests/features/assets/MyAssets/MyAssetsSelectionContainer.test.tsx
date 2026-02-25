import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { QueryClientProviderWrapper } from "../../../test-utils";
import { expect, vi } from "vitest";
// components
import MyAssetsSelectionContainer from "../../../../src/features/assets/MyAssets/MyAssetsSelectionContainer";
import NewAssetContainer from "../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer";
import ExistingAssetsList from "../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsList";
import SelectedAssetsList from "../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsList";
import { useGlobalContext } from "../../../../src/context/GlobalContext";
// context
import * as AssetSelectionContext from "../../../../src/context/AssetSelectionContext";
// hooks
import useGetUserLimits from "../../../../src/hooks/useGetUserLimits";
// services
// fixtures
import {
  mockAssetsList,
  mockTimedAssetsList,
} from "../../../fixtures/assets/assets";

// userEvent

// mocks
vi.mock("../../../../src/context/GlobalContext");
vi.mock("../../../../src/context/AssetSelectionContext");
vi.mock("../../../../src/hooks/useGetUserLimits");

// mock ExistingAssetsList and NewAssetContainer to just render a div with their name for testing purposes
vi.mock(
  "../../../../src/features/assets/AssetSelection/ExistingAssetsList/ExistingAssetsList",
);
vi.mock(
  "../../../../src/features/assets/AssetSelection/NewAsset/NewAssetContainer",
);
vi.mock(
  "../../../../src/features/assets/AssetSelection/SelectedAssetsList/SelectedAssetsList",
);

vi.mocked(ExistingAssetsList).mockImplementation(() => {
  return <div>Mock ExistingAssetsList</div>;
});

vi.mocked(NewAssetContainer).mockImplementation(() => {
  return <div>Mock NewAssetContainer</div>;
});

vi.mocked(SelectedAssetsList).mockImplementation(() => {
  return <div>Selected Assets</div>;
});

describe("MyAssetsSelectionContainer", () => {
  const selectedOption = "existing";
  const setSelectedOption = vi.fn();
  const setAssetsList = vi.fn();

  beforeEach(() => {
    vi.mocked(useGlobalContext).mockImplementation(() => ({
      user: { assets: mockAssetsList },
      setContextImages: vi.fn(),
      setShowDeleteFilesModal: vi.fn(),
    }));
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext,
    ).mockImplementation(() => ({
      selectedOption,
      setSelectedOption,
      assetsList: mockAssetsList,
      setAssetsList,
      timedAssetsList: mockTimedAssetsList,
    }));
    vi.mocked(useGetUserLimits).mockImplementation(() => ({ maxAssets: 10 }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders ExistingAssetsList when selectedOption is 'existing'", async () => {
    render(<MyAssetsSelectionContainer />);
    await waitFor(() => {
      expect(screen.getByText("Mock ExistingAssetsList")).toBeInTheDocument();
    });
  });
  it("renders NewAssetContainer when selectedOption is 'new'", async () => {
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext,
    ).mockImplementation(() => ({
      selectedOption: "new",
      setSelectedOption,
      assetsList: mockAssetsList,
      setAssetsList,
      timedAssetsList: mockTimedAssetsList,
    }));
    render(<MyAssetsSelectionContainer />);
    await waitFor(() => {
      expect(screen.getByText("Mock NewAssetContainer")).toBeInTheDocument();
    });
  });
  it("renders SelectedAssetsList when selectedOption is 'existing'", async () => {
    vi.mocked(
      AssetSelectionContext.useAssetSelectionContext,
    ).mockImplementation(() => ({
      selectedOption: "existing",
      setSelectedOption,
      assetsList: mockAssetsList,
      setAssetsList,
      timedAssetsList: mockTimedAssetsList,
    }));
    render(<MyAssetsSelectionContainer />);

    await waitFor(() => {
      expect(screen.getByText("Selected Assets")).toBeInTheDocument();
    });
  });
  it("should set selectedOption to existing when user assets length is greater than or equal to userLimits maxAssets", async () => {
    vi.mocked(useGlobalContext).mockImplementation(() => ({
      user: { assets: new Array(10).fill({}) },
      setContextImages: vi.fn(),
      setShowDeleteFilesModal: vi.fn(),
    }));

    render(<MyAssetsSelectionContainer />);
    await waitFor(() => {
      expect(setSelectedOption).toHaveBeenCalledWith("existing");
    });
  });
  it("should call setShowDeleteFilesModal with true and setContextImages with assetsList when delete button is clicked", async () => {
    const setShowDeleteFilesModal = vi.fn();
    const setContextImages = vi.fn();
    vi.mocked(useGlobalContext).mockImplementation(() => ({
      user: { assets: mockAssetsList },
      setContextImages,
      setShowDeleteFilesModal,
    }));
    render(<MyAssetsSelectionContainer />);
    await waitFor(() => {
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      userEvent.click(deleteButton);
    });
    await waitFor(() => {
      expect(setShowDeleteFilesModal).toHaveBeenCalledWith(true);
      expect(setContextImages).toHaveBeenCalledWith(mockAssetsList);
    });
  });
  it("should disable new asset button when user assets length is greater than or equal to userLimits maxAssets", async () => {
    vi.mocked(useGlobalContext).mockImplementation(() => ({
      user: { assets: new Array(10).fill({}) },
      setContextImages: vi.fn(),
      setShowDeleteFilesModal: vi.fn(),
    }));
    render(<MyAssetsSelectionContainer />);
    await waitFor(() => {
      const newAssetButton = screen.getByRole("button", {
        name: "+ Add New Asset",
      });
      expect(newAssetButton).toBeDisabled();
    });
  });
  it("should disable new asset button when user assets length is greater than or equal to userLimits maxAssets", async () => {
    vi.mocked(useGlobalContext).mockImplementation(() => ({
      user: { assets: [] },
      setContextImages: vi.fn(),
      setShowDeleteFilesModal: vi.fn(),
    }));
    render(<MyAssetsSelectionContainer />);
    await waitFor(() => {
      const newAssetButton = screen.getByRole("button", {
        name: "+ Add New Asset",
      });
      expect(newAssetButton).not.toBeDisabled();
    });
  });
  it('should set selectedOption to "existing" when View Existing button is clicked', async () => {
    render(<MyAssetsSelectionContainer />);

    const viewExistingButton = screen.getByRole("button", {
      name: "View Existing",
    });

    act(() => {
      userEvent.click(viewExistingButton);
    });
    await waitFor(() => {
      expect(setSelectedOption).toHaveBeenCalledWith("existing");
    });
  });
  it('should set selectedOption to "new" when Add New Asset button is clicked', async () => {
    render(<MyAssetsSelectionContainer />);

    const newAssetButton = screen.getByRole("button", {
      name: "+ Add New Asset",
    });

    act(() => {
      userEvent.click(newAssetButton);
    });
    await waitFor(() => {
      expect(setSelectedOption).toHaveBeenCalledWith("new");
    });
  });
});
