import { renderHook, waitFor } from "@testing-library/react";
import useAssetMutations from "../../../src/features/assets/useAssetMutations";
import * as GlobalContext from "../../../src/context/GlobalContext";
import * as ReactQuery from "@tanstack/react-query";
import * as apiAssets from "../../../src/services/apiAssets";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { resultInfo } from "../../fixtures/cloudinary/responses";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("@tanstack/react-query");
vi.mock("../../../src/services/apiAssets");

describe("useAssetMutation", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
    }));
    vi.mocked(ReactQuery.useMutation).mockImplementation(() => ({
      mutate: vi.fn(),
      error: null,
    }));
    vi.mocked(apiAssets.addAsset).mockImplementation(() => {
      return {
        data: null,
        error: null,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation functions", () => {
    const { result } = renderHook(() => useAssetMutations());
    console.log(result.current);
    expect(result.current).toBeTruthy();
    result.current.addAssetFn(resultInfo);
  });
});
