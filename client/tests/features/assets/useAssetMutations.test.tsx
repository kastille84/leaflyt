import { act, renderHook, waitFor } from "@testing-library/react";
import useAssetMutations from "../../../src/features/assets/useAssetMutations";
import * as GlobalContext from "../../../src/context/GlobalContext";
import * as apiAssets from "../../../src/services/apiAssets";
import { QueryClientProviderWrapper } from "../../test-utils";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { resultInfo } from "../../fixtures/cloudinary/responses";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/services/apiAssets");

describe("useAssetMutation", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
    }));
    vi.mocked(apiAssets.addAsset).mockResolvedValue({
      data: null,
      error: null,
    } as any);
    vi.mocked(apiAssets.deleteAssets).mockResolvedValue({
      data: null,
      error: null,
    } as any);
    vi.mocked(apiAssets.deleteAllAssets).mockResolvedValue({
      data: null,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderMutations() {
    return renderHook(() => useAssetMutations(), {
      wrapper: QueryClientProviderWrapper(),
    });
  }

  it("should return the mutation functions and no errors", () => {
    const { result } = renderMutations();
    expect(typeof result.current.addAssetFn).toBe("function");
    expect(typeof result.current.updateAsset).toBe("function");
    expect(typeof result.current.deleteAssetsFn).toBe("function");
    expect(typeof result.current.deleteAllAssetsAsync).toBe("function");
    expect(result.current.addAssetFnError).toBeNull();
    expect(result.current.updateAssetError).toBeNull();
    expect(result.current.deleteAssetsFnError).toBeNull();
    expect(result.current.deleteAllAssetsAsyncError).toBeNull();
  });

  it("should add an asset for the user", async () => {
    const { result } = renderMutations();
    act(() => result.current.addAssetFn(resultInfo));
    await waitFor(() =>
      expect(apiAssets.addAsset).toHaveBeenCalledWith(
        resultInfo,
        userFromContext.id,
      ),
    );
  });

  it("should delete assets for the user", async () => {
    const { result } = renderMutations();
    act(() => result.current.deleteAssetsFn([resultInfo]));
    await waitFor(() =>
      expect(apiAssets.deleteAssets).toHaveBeenCalledWith(
        [resultInfo],
        userFromContext.id,
      ),
    );
  });

  it("should delete all assets by video and image ids", async () => {
    const { result } = renderMutations();
    await act(async () => {
      await result.current.deleteAllAssetsAsync({
        assetVideos: ["v1"],
        assetImages: ["i1", "i2"],
      });
    });
    expect(apiAssets.deleteAllAssets).toHaveBeenCalledWith(["v1"], ["i1", "i2"]);
  });
});
