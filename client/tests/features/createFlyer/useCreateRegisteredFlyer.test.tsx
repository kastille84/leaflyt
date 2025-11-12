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
  describe("flyer", () => {
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

    it("should edit a flyer", async () => {
      const { result } = renderHook(() => useCreateRegisteredFlyer(), {
        wrapper: QueryClientProviderWrapper(),
      });
      const { editFlyer } = result.current;
      const prepData = {
        flyer: mockCreatedFlyer,
        template: templateMock,
      };
      await waitFor(() => {
        editFlyer(prepData.flyer);
      });
      expect(editFlyer).toBeDefined();
    });
    it("should delete a flyer", async () => {
      const { result } = renderHook(() => useCreateRegisteredFlyer(), {
        wrapper: QueryClientProviderWrapper(),
      });
      const { deleteFlyerFn } = result.current;
      await waitFor(() => {
        deleteFlyerFn(mockCreatedFlyer);
      });
      expect(deleteFlyerFn).toBeDefined();
    });
    it("should create a flyer using template", async () => {
      const { result } = renderHook(() => useCreateRegisteredFlyer(), {
        wrapper: QueryClientProviderWrapper(),
      });
      const { createFlyerUsingTemplate } = result.current;
      const prepData = {
        flyer: mockCreatedFlyer,
        template: templateMock,
      };
      await waitFor(() => {
        createFlyerUsingTemplate(prepData.template);
      });
      expect(createFlyerUsingTemplate).toBeDefined();
    });
  });

  describe("template", () => {
    it("should create a template", async () => {
      const { result } = renderHook(() => useCreateRegisteredFlyer(), {
        wrapper: QueryClientProviderWrapper(),
      });
      const { createTemplateFn } = result.current;
      const prepData = {
        flyer: mockCreatedFlyer,
        template: templateMock,
      };
      await waitFor(() => {
        createTemplateFn(prepData.template);
      });
      expect(createTemplateFn).toBeDefined();
    });

    it("should edit a template", async () => {
      const { result } = renderHook(() => useCreateRegisteredFlyer(), {
        wrapper: QueryClientProviderWrapper(),
      });
      const { editTemplate } = result.current;
      const prepData = {
        flyer: mockCreatedFlyer,
        template: templateMock,
      };
      await waitFor(() => {
        editTemplate(prepData.template);
      });
      expect(editTemplate).toBeDefined();
    });

    it("should delete a template", async () => {
      const { result } = renderHook(() => useCreateRegisteredFlyer(), {
        wrapper: QueryClientProviderWrapper(),
      });
      const { deleteTemplateFn } = result.current;
      const prepData = {
        flyer: mockCreatedFlyer,
        template: templateMock,
      };
      await waitFor(() => {
        deleteTemplateFn(prepData.template);
      });
      expect(deleteTemplateFn).toBeDefined();
    });
  });
});
