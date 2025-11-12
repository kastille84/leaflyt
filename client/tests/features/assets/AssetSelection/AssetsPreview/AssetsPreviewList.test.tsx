import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

// components
import AssetsPreviewList from "../../../../../src/features/assets/AssetSelection/AssetsPreview/AssetsPreviewList";
import AssetsPreviewListItem from "../../../../../src/features/assets/AssetSelection/AssetsPreview/AssetsPreviewListItem";

// context

// hooks

// services

// fixtures
import { mockFileUrlArr } from "../../../../fixtures/assets/assets";
// userEvent

// mocks
vi.mock(
  "../../../../../src/features/assets/AssetSelection/AssetsPreview/AssetsPreviewListItem"
);

describe("AssetsPreviewList", () => {
  beforeEach(() => {
    vi.mocked(AssetsPreviewListItem).mockImplementation(() => {
      return <div data-testid="assets-preview-list-item" />;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render assets preview list", async () => {
    // assemble
    // act
    render(<AssetsPreviewList fileUrlArr={mockFileUrlArr} />);
    // assert
    await waitFor(() => {
      expect(screen.getAllByTestId("assets-preview-list-item")).toBeDefined();
    });
  });

  it("should not render assets preview list", async () => {
    // assemble
    // act
    render(<AssetsPreviewList fileUrlArr={[]} />);
    // assert
    await waitFor(() => {
      expect(screen.queryByTestId("assets-preview-list-item")).toBeFalsy();
    });
    await waitFor(() => {
      expect(screen.getByText("No assets selected")).toBeDefined();
    });
  });
});
