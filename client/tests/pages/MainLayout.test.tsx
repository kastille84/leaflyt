import { act, render, screen, waitFor } from "@testing-library/react";
import * as routerDom from "react-router-dom";

import MainLayout from "../../src/pages/MainLayout";
import * as GlobalContext from "../../src/context/GlobalContext";
import * as Responsive from "../../src/hooks/useResponsiveWidth";
import useLoginWithAccessToken from "../../src/features/authentication/useLoginWithAccessToken";
import { supabase } from "../../src/services/supabase";

// fixtures
import { mockUseGlobalContextReturnObj } from "../fixtures/context/globalContext";

// mocks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
    useLocation: vi.fn(),
    Outlet: () => <div data-testid="mock-outlet" />,
  };
});
vi.mock("../../src/context/GlobalContext");
vi.mock("../../src/hooks/useResponsiveWidth");
vi.mock("../../src/features/authentication/useLoginWithAccessToken");
vi.mock("../../src/services/supabase", () => ({
  supabase: { auth: { getSession: vi.fn() } },
}));
vi.mock("../../src/ui/ActionMenu", () => ({
  default: () => <div data-testid="mock-action-menu" />,
}));
vi.mock("../../src/ui/ActionMenuMobile", () => ({
  default: () => <div data-testid="mock-action-menu-mobile" />,
}));
vi.mock("../../src/ui/Sidebar", () => ({
  default: () => <div data-testid="mock-sidebar" />,
}));
vi.mock("../../src/ui/Modals/CloseSlideInModal", () => ({ default: () => null }));
vi.mock("../../src/ui/Modals/EditFlyerModal", () => ({ default: () => null }));
vi.mock("../../src/ui/Modals/DeleteFlyerTemplateModal", () => ({
  default: () => null,
}));
vi.mock("../../src/ui/Modals/DeleteFilesModal", () => ({ default: () => null }));
vi.mock("../../src/ui/Modals/FlaggedModal", () => ({ default: () => null }));

describe("MainLayout Page", () => {
  const navigateSpy = vi.fn();
  const autoLoginSpy = vi.fn();
  const setUserSpy = vi.fn();
  const setShowLoginModalSpy = vi.fn();
  const setIsOpenBottomSlideInSpy = vi.fn();
  const setBottomSlideInTypeSpy = vi.fn();
  const session = { access_token: "token-123" };

  function mockSession(value: typeof session | null) {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: value },
    } as any);
  }

  beforeEach(() => {
    vi.mocked(routerDom.useNavigate).mockReturnValue(navigateSpy);
    vi.mocked(routerDom.useParams).mockReturnValue({});
    vi.mocked(routerDom.useLocation).mockReturnValue({
      pathname: "/dashboard",
    } as any);
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setUser: setUserSpy,
      setShowLoginModal: setShowLoginModalSpy,
      setIsOpenBottomSlideIn: setIsOpenBottomSlideInSpy,
      setBottomSlideInType: setBottomSlideInTypeSpy,
    }));
    vi.mocked(Responsive.useResponsiveWidth).mockReturnValue("desktop" as any);
    vi.mocked(useLoginWithAccessToken).mockReturnValue({
      autoLogin: autoLoginSpy,
      loginError: null,
    } as any);
    mockSession(null);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  async function renderLayout() {
    await act(async () => {
      render(<MainLayout />);
    });
  }

  it("should render MainLayout with the desktop action menu", async () => {
    await renderLayout();
    expect(screen.getByTestId("main-layout")).toBeTruthy();
    expect(screen.getByTestId("mock-action-menu")).toBeTruthy();
    expect(screen.queryByTestId("mock-action-menu-mobile")).toBeNull();
    expect(screen.getByTestId("mock-sidebar")).toBeTruthy();
    expect(screen.getByTestId("mock-outlet")).toBeTruthy();
  });

  it.each(["s_tablet", "l_mobile", "s_mobile"])(
    "should render the mobile action menu on %s",
    async (width) => {
      vi.mocked(Responsive.useResponsiveWidth).mockReturnValue(width as any);
      await renderLayout();
      expect(screen.getByTestId("mock-action-menu-mobile")).toBeTruthy();
      expect(screen.queryByTestId("mock-action-menu")).toBeNull();
    }
  );

  describe("auto login", () => {
    it("should not look for a session on the password page", async () => {
      vi.mocked(routerDom.useLocation).mockReturnValue({
        pathname: "/password/reset",
      } as any);
      await renderLayout();
      expect(supabase.auth.getSession).not.toHaveBeenCalled();
    });

    it("should not auto login without a session", async () => {
      await renderLayout();
      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(autoLoginSpy).not.toHaveBeenCalled();
    });

    it("should set the user and go to the dashboard home", async () => {
      mockSession(session);
      await renderLayout();
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

    it("should go to the board from the url", async () => {
      vi.mocked(routerDom.useParams).mockReturnValue({ id: "place-1" });
      mockSession(session);
      await renderLayout();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onSuccess({ data: { id: "user-1" } });
      expect(navigateSpy).toHaveBeenCalledWith("/dashboard/board/place-1");
    });

    it("should not navigate away from a full flyer", async () => {
      vi.mocked(routerDom.useLocation).mockReturnValue({
        pathname: "/dashboard/fullFlyer/1",
      } as any);
      mockSession(session);
      await renderLayout();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onSuccess({ data: { id: "user-1" } });
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should throw the response error after setting the user", async () => {
      mockSession(session);
      await renderLayout();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      expect(() =>
        autoLoginSpy.mock.calls[0][1].onSuccess({
          data: { id: "user-1" },
          error: { message: "unpaid" },
        })
      ).toThrow("unpaid");
      expect(setUserSpy).toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should open the unpaid slide in when the user has not paid", async () => {
      mockSession(session);
      await renderLayout();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onError(new Error("unpaid"));
      expect(setShowLoginModalSpy).toHaveBeenCalledWith(false);
      expect(setIsOpenBottomSlideInSpy).toHaveBeenCalledWith(true);
      expect(setBottomSlideInTypeSpy).toHaveBeenCalledWith("unpaid");
    });

    it("should ignore other login errors", async () => {
      mockSession(session);
      await renderLayout();
      await waitFor(() => expect(autoLoginSpy).toHaveBeenCalled());
      autoLoginSpy.mock.calls[0][1].onError(new Error("other"));
      expect(setIsOpenBottomSlideInSpy).not.toHaveBeenCalled();
    });
  });
});
