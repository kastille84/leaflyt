import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components
import AssetsPreviewListItem from "../../../../../src/features/assets/AssetSelection/AssetsPreview/AssetsPreviewListItem";

// context

// hooks

// services

// fixtures
import { mockAssetsList } from "../../../../fixtures/assets/assets";

// userEvent

// mocks

describe("AssetsPreviewListItem", () => {
  it("should render video", async () => {
    render(<AssetsPreviewListItem asset={mockAssetsList[0]} />);
    await waitFor(() => {
      expect(screen.getByTestId("assets-preview-list-item")).toBeDefined();
    });
  });
  it("should render image", async () => {
    render(<AssetsPreviewListItem asset={mockAssetsList[1]} />);
    await waitFor(() => {
      expect(screen.getByTestId("assets-preview-list-item")).toBeDefined();
    });
  });
});
