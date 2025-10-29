import { renderHook, waitFor } from "@testing-library/react";
import useCreateRegisteredFlyer from "../../../src/features/createFlyer/useCreateRegisteredFlyer";
import * as ReactQuery from "@tanstack/react-query";

import * as GlobalContext from "../../../src/context/GlobalContext";
import * as apiFlyers from "../../../src/services/apiFlyers";

import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";
import { templateMock } from "../../fixtures/template/template";
import { responseData } from "../../fixtures/nearbyPlaces";
import { QueryClientProviderWrapper } from "../../test-utils";

vi.mock("../../../src/context/GlobalContext");
// vi.mock("@tanstack/react-query");
vi.mock("../../../src/services/apiFlyers");

const mockPlace = responseData.places[0];

describe("useCreateRegisteredFlyer", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user: userFromContext,
      selectedPlace: mockPlace,
    }));
    // vi.mocked(ReactQuery.useMutation).mockImplementation(() => ({
    //   mutate: vi.fn(),
    //   error: null,
    // }));
    vi.mocked(apiFlyers.createRegisteredFlyer).mockImplementation(() => {
      return {
        data: mockCreatedFlyer,
        error: null,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a flyer", async () => {
    const { result } = renderHook(() => useCreateRegisteredFlyer(), {
      wrapper: QueryClientProviderWrapper(),
    });
    const { createFlyer } = result.current;
    const prepData = {
      flyer: mockCreatedFlyer,
      template: templateMock,
    };

    await waitFor(() => {
      createFlyer(prepData.flyer);
    });
    expect(createFlyer).toBeDefined();
  });
});
