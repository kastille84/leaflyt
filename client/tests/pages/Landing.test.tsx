import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import * as routerDom from "react-router-dom";

import Landing from "../../src/pages/Landing";
import * as GlobalContext from "../../src/context/GlobalContext";
import useLoginWithAccessToken from "../../src/features/authentication/useLoginWithAccessToken";
import { supabase } from "../../src/services/supabase";

// fixtures
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

// mocks
vi.mock("react-router-dom");
vi.mock("../../src/context/GlobalContext");
vi.mock("../../src/features/authentication/useLoginWithAccessToken");
vi.mock("../../src/services/supabase", () => ({
  supabase: { auth: { getSession: vi.fn() } },
}));

const user = userEvent.setup();

describe("Landing Page", () => {
  const getUserGeoSpy = vi.fn();
  const navigateSpy = vi.fn();
  const autoLoginSpy = vi.fn();
  const setUserSpy = vi.fn();
  const setShowLoginModalSpy = vi.fn();
  const setIsOpenBottomSlideInSpy = vi.fn();
  const setBottomSlideInTypeSpy = vi.fn();
  const setShowMerchantDisclaimerModalSpy = vi.fn();
  const session = { access_token: "token-123" };

  function mockSession(value: typeof session | null) {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: value },
    } as any);
  }

  async function renderLanding() {
    await act(async () => {
      render(<Landing />);
    });
  }

  beforeEach(() => {
    vi.mocked(routerDom.useNavigate).mockReturnValue(navigateSpy);
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      getUserGeo: getUserGeoSpy,
      setUser: setUserSpy,
      setShowLoginModal: setShowLoginModalSpy,
      setIsOpenBottomSlideIn: setIsOpenBottomSlideInSpy,
      setBottomSlideInType: setBottomSlideInTypeSpy,
      setShowMerchantDisclaimerModal: setShowMerchantDisclaimerModalSpy,
    }));
    vi.mocked(useLoginWithAccessToken).mockReturnValue({
      autoLogin: autoLoginSpy,
      loginError: null,
    } as any);
    mockSession(null);
  });
  afterEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/");
  });

  it("should render the intro sections", async () => {
    await renderLanding();
    expect(
      screen.getByRole("heading", { level: 1, name: "What Is Leaflit?" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "How To Use Leaflit?",
      })
    ).toBeTruthy();
    expect(screen.getByTestId("get-geo-button-section")).toBeTruthy();
  });

  describe("getUserGeo", () => {
    it("should be called when the hero is clicked", async () => {
      await renderLanding();
      await user.click(screen.getByTestId("get-geo-button-section"));
      expect(getUserGeoSpy).toHaveBeenCalled();
    });

    it("should be called when 'Find a Board Near You' is clicked", async () => {
      await renderLanding();
      await user.click(
        screen.getByRole("button", { name: "Find a Board Near You" })
      );
      expect(getUserGeoSpy).toHaveBeenCalled();
    });

    it("should be called on load with the getUserGeo query param", async () => {
      window.history.replaceState({}, "", "/?getUserGeo=true");
      await renderLanding();
      expect(getUserGeoSpy).toHaveBeenCalled();
    });

    it("should not be called on load without the query param", async () => {
      await renderLanding();
      expect(getUserGeoSpy).not.toHaveBeenCalled();
    });
  });

  describe("explainers", () => {
    it("should switch between viewing and posting challenges", async () => {
      await renderLanding();
      expect(screen.getByText("Messy Boards")).toBeTruthy();
      expect(screen.getByText("Organized Boards")).toBeTruthy();
      expect(screen.queryByText("Limited Space")).toBeNull();

      await user.click(screen.getAllByRole("button", { name: "Posting Flyers" })[0]);
      expect(screen.getByText("Limited Space")).toBeTruthy();
      expect(screen.getByText("Ample Space")).toBeTruthy();
      expect(screen.queryByText("Messy Boards")).toBeNull();

      await user.click(screen.getAllByRole("button", { name: "Viewing Flyers" })[0]);
      expect(screen.getByText("Messy Boards")).toBeTruthy();
    });

    it("should switch between on-location and remote steps", async () => {
      await renderLanding();
      expect(
        screen.getByText("Go to a physical establishment.")
      ).toBeTruthy();

      await user.click(screen.getByRole("button", { name: "Remote" }));
      expect(
        screen.getByText(
          "This feature is only available to Registered Leaflit users."
        )
      ).toBeTruthy();
      expect(screen.queryByText("Go to a physical establishment.")).toBeNull();

      await user.click(screen.getByRole("button", { name: "On-Location" }));
      expect(
        screen.getByText("Go to a physical establishment.")
      ).toBeTruthy();
    });
  });

  describe("modals", () => {
    it("should open the merchant disclaimer", async () => {
      await renderLanding();
      await user.click(screen.getByRole("button", { name: "Learn More" }));
      expect(setShowMerchantDisclaimerModalSpy).toHaveBeenCalledWith(true);
    });

    it("should open the signup slide in", async () => {
      await renderLanding();
      await user.click(
        screen.getByRole("button", { name: "create an account for free" })
      );
      expect(setIsOpenBottomSlideInSpy).toHaveBeenCalledWith(true);
      expect(setBottomSlideInTypeSpy).toHaveBeenCalledWith("signup");
    });

    it("should open the signup slide in from the remote steps", async () => {
      await renderLanding();
      await user.click(screen.getByRole("button", { name: "Remote" }));
      await user.click(
        screen.getByRole("button", { name: "create an account for free" })
      );
      expect(setBottomSlideInTypeSpy).toHaveBeenCalledWith("signup");
    });
  });

  describe("auto login", () => {
    it("should not auto login without a session", async () => {
      await renderLanding();
      expect(autoLoginSpy).not.toHaveBeenCalled();
    });

    it("should set the user and go to the dashboard", async () => {
      mockSession(session);
      await renderLanding();
      await waitFor(() => {
        expect(autoLoginSpy).toHaveBeenCalledWith(
          "token-123",
          expect.any(Object)
        );
      });
      autoLoginSpy.mock.calls[0][1].onSuccess({ data: { id: "user-1" } });
      expect(setUserSpy).toHaveBeenCalledWith({ id: "user-1" });
      expect(navigateSpy).toHaveBeenCalledWith("/dashboard/home");
    });

    it("should not navigate away from a full flyer", async () => {
      window.history.replaceState({}, "", "/fullFlyer/1");
      mockSession(session);
      await renderLanding();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onSuccess({ data: { id: "user-1" } });
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should throw the response error after setting the user", async () => {
      mockSession(session);
      await renderLanding();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      expect(() =>
        autoLoginSpy.mock.calls[0][1].onSuccess({
          data: { id: "user-1" },
          error: { message: "unpaid" },
        })
      ).toThrow("unpaid");
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should open the unpaid slide in when the user has not paid", async () => {
      mockSession(session);
      await renderLanding();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onError(new Error("unpaid"));
      expect(setShowLoginModalSpy).toHaveBeenCalledWith(false);
      expect(setIsOpenBottomSlideInSpy).toHaveBeenCalledWith(true);
      expect(setBottomSlideInTypeSpy).toHaveBeenCalledWith("unpaid");
    });

    it("should ignore other login errors", async () => {
      mockSession(session);
      await renderLanding();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onError(new Error("other"));
      expect(setIsOpenBottomSlideInSpy).not.toHaveBeenCalled();
    });
  });

  describe("Explainer toggles", () => {
    beforeEach(() => {
      mockSession(null);
    });

    it("should switch the solution items between viewing and posting", async () => {
      await renderLanding();
      // the solution section is the second set of toggle buttons
      expect(screen.getByText("Organized Boards")).toBeTruthy();
      await user.click(screen.getAllByText("Posting Flyers")[1]);
      expect(screen.queryByText("Organized Boards")).toBeNull();
      expect(screen.getByText("Ample Space")).toBeTruthy();
      await user.click(screen.getAllByText("Viewing Flyers")[1]);
      expect(screen.getByText("Organized Boards")).toBeTruthy();
    });

    it("should switch the problem items between viewing and posting", async () => {
      await renderLanding();
      expect(screen.getByText("Messy Boards")).toBeTruthy();
      await user.click(screen.getAllByText("Posting Flyers")[0]);
      expect(screen.queryByText("Messy Boards")).toBeNull();
      await user.click(screen.getAllByText("Viewing Flyers")[0]);
      expect(screen.getByText("Messy Boards")).toBeTruthy();
    });
  });
});
