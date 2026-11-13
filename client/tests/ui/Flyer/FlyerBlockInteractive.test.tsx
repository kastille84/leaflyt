import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import toast from "react-hot-toast";
import FlyerBlockInteractive from "../../../src/ui/Flyer/FlyerBlockInteractive";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useRegisteredFlyer from "../../../src/features/createFlyer/useRegisteredFlyer";
import useCreateUnregisteredFlyer from "../../../src/features/createFlyer/useCreateUnregisteredFlyer";
import { useLikeFlyers } from "../../../src/hooks/useLikeFlyers";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/createFlyer/useRegisteredFlyer");
vi.mock("../../../src/features/createFlyer/useCreateUnregisteredFlyer");
vi.mock("../../../src/hooks/useLikeFlyers");
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => mockNavigate,
}));
vi.mock("../../../src/ui/Flyer/SubComponents/ImageCarousel", () => ({
  default: () => <div data-testid="image-carousel" />,
}));
vi.mock("../../../src/ui/Flyer/SubComponents/Info", () => ({
  default: () => <div data-testid="info" />,
}));
vi.mock("../../../src/ui/Flyer/SubComponents/Contact", () => ({
  default: () => <div data-testid="contact" />,
}));
const ctaProps = vi.fn();
vi.mock("../../../src/ui/Flyer/SubComponents/CTA", () => ({
  default: (props: any) => {
    ctaProps(props);
    return <div data-testid="cta" />;
  },
}));

const businessOwner = {
  id: "u1",
  typeOfUser: "business",
  name: "Acme",
  saved_flyers: [],
};
const individualOwner = {
  id: "u1",
  typeOfUser: "individual",
  firstName: "Jane",
  lastName: "Doe",
};
const flyerBy = (owner: any, extra: any = {}) =>
  ({ ...mockCreatedFlyer, user: owner, ...extra }) as any;
const anonymousFlyer = (extra: any = {}) =>
  ({ ...mockCreatedFlyer, user: null, ...extra }) as any;

describe("FlyerBlockInteractive", () => {
  const ctx = {
    setSelectedFlyer: vi.fn(),
    setShowEditFlyerModal: vi.fn(),
    setUser: vi.fn(),
    setIsOpenFlyerDrawer: vi.fn(),
    setDrawerAction: vi.fn(),
    setShowDeleteFlyerTemplateModal: vi.fn(),
    setBottomSlideInType: vi.fn(),
    setIsOpenBottomSlideIn: vi.fn(),
    setShowFlaggedModal: vi.fn(),
    setShowDcmaModal: vi.fn(),
  };
  const saveFlyerFn = vi.fn();
  const removeSavedFlyerFn = vi.fn();
  const likeFlyerFn = vi.fn();
  const setLikedFlyer = vi.fn();

  function setup(
    flyer: any,
    {
      user = null,
      liked = null,
      listView,
    }: { user?: any; liked?: string[] | null; listView?: boolean } = {},
  ) {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      ...ctx,
      user,
      likedContextSessionFlyers: liked,
    }));
    return render(
      <BrowserRouter>
        <FlyerBlockInteractive flyer={flyer} listView={listView} />
      </BrowserRouter>,
    );
  }

  async function openMenu() {
    // the dropdown icon is the first svg in the top bar
    const bars = document.querySelectorAll("svg");
    const icon = Array.from(bars).find((svg) => !svg.closest("[data-tooltip-id]"));
    await userEvent.click(icon!);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/");
    vi.mocked(useRegisteredFlyer).mockReturnValue({
      saveFlyerFn,
      removeSavedFlyerFn,
    } as any);
    vi.mocked(useCreateUnregisteredFlyer).mockReturnValue({
      likeFlyerFn,
    } as any);
    vi.mocked(useLikeFlyers).mockReturnValue({ setLikedFlyer });
  });

  describe("avatar and name", () => {
    it("should show Anonymous", () => {
      setup(anonymousFlyer({ typeOfUser: "anonymous" }));
      expect(screen.getByText("Anonymous")).toBeInTheDocument();
    });

    it("should show an unregistered individual", () => {
      setup(
        anonymousFlyer({
          typeOfUser: "individual",
          individual: { name: { firstName: "Sam", lastName: "Lee" } },
        }),
      );
      expect(screen.getByText(/Sam/)).toBeInTheDocument();
    });

    it("should show an unregistered organization", () => {
      setup(
        anonymousFlyer({
          typeOfUser: "organization",
          organization: { name: "Club" },
        }),
      );
      expect(screen.getByText("Club")).toBeInTheDocument();
    });

    it("should show an unregistered business", () => {
      setup(
        anonymousFlyer({ typeOfUser: "business", business: { name: "Shop" } }),
      );
      expect(screen.getByText("Shop")).toBeInTheDocument();
    });

    it("should show a registered individual", () => {
      setup(flyerBy(individualOwner));
      expect(screen.getByText(/Jane/)).toBeInTheDocument();
      expect(screen.getByText(/Doe/)).toBeInTheDocument();
    });

    it("should show a registered business", () => {
      setup(flyerBy(businessOwner));
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });
  });

  describe("badges", () => {
    it("should show pioneer, power user and fire badges", () => {
      const { container } = setup(
        flyerBy({ ...businessOwner, pioneer: true, powerUser: true }, { likes: 6 }),
      );
      expect(container.querySelector("[data-tooltip-id='pioneer']")).not.toBeNull();
      expect(container.querySelector("[data-tooltip-id='powerUser']")).not.toBeNull();
      expect(container.querySelector("[data-tooltip-id='fire']")).not.toBeNull();
    });

    it("should hide the badges by default", () => {
      const { container } = setup(flyerBy(businessOwner, { likes: 5 }));
      expect(container.querySelector("[data-tooltip-id='pioneer']")).toBeNull();
      expect(container.querySelector("[data-tooltip-id='powerUser']")).toBeNull();
      expect(container.querySelector("[data-tooltip-id='fire']")).toBeNull();
    });

    it("should handle a flyer without a likes count", () => {
      const { container } = setup(flyerBy(businessOwner, { likes: undefined }));
      expect(container.querySelector("[data-tooltip-id='fire']")).toBeNull();
    });
  });

  describe("content tabs", () => {
    const flyer = flyerBy(businessOwner);

    it("should show the carousel and info by default", () => {
      setup(flyer);
      expect(screen.getByTestId("image-carousel")).toBeInTheDocument();
      expect(screen.getByTestId("info")).toBeInTheDocument();
    });

    it("should skip the carousel when there are no files", () => {
      setup({ ...flyer, fileUrlArr: [] });
      expect(screen.queryByTestId("image-carousel")).toBeNull();
    });

    it("should skip the carousel when fileUrlArr is missing", () => {
      setup({ ...flyer, fileUrlArr: undefined });
      expect(screen.queryByTestId("image-carousel")).toBeNull();
    });

    it("should switch to contact and back", async () => {
      setup(flyer);
      await userEvent.click(screen.getByText("contact"));
      expect(screen.getByTestId("contact")).toBeInTheDocument();
      await userEvent.click(screen.getByText("main"));
      expect(screen.getByTestId("info")).toBeInTheDocument();
    });

    it("should hide the contact pill for anonymous flyers", () => {
      setup(anonymousFlyer({ typeOfUser: "anonymous" }));
      expect(screen.queryByText("contact")).toBeNull();
    });

    it("should switch to the cta with ownership info", async () => {
      setup(flyer, { user: businessOwner });
      await userEvent.click(screen.getByText("deals"));
      expect(screen.getByTestId("cta")).toBeInTheDocument();
      expect(ctaProps).toHaveBeenCalledWith(
        expect.objectContaining({ belongsToUser: true }),
      );
    });

    it("should label a request cta", () => {
      setup({ ...flyer, callToAction: { ctaType: "request", headline: "h" } });
      expect(screen.getByText("request")).toBeInTheDocument();
    });

    it("should hide the cta pill for none or missing cta", () => {
      const { unmount } = setup({ ...flyer, callToAction: { ctaType: "none" } });
      expect(screen.queryByText("deals")).toBeNull();
      unmount();
      setup({ ...flyer, callToAction: null });
      expect(screen.queryByText("deals")).toBeNull();
    });
  });

  describe("design", () => {
    it("should use the default design when the flyer has none", () => {
      setup(flyerBy(businessOwner, { flyerDesign: null }));
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });

    it("should update when the flyer design changes", () => {
      const flyer = flyerBy(businessOwner, { flyerDesign: null });
      const { rerender } = setup(flyer);
      rerender(
        <BrowserRouter>
          <FlyerBlockInteractive
            flyer={{ ...flyer, flyerDesign: mockCreatedFlyer.flyerDesign }}
          />
        </BrowserRouter>,
      );
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });
  });

  describe("expand / collapse", () => {
    it("should navigate to the full flyer from the expand icon", async () => {
      const { container } = setup(flyerBy(businessOwner));
      await userEvent.click(
        container.querySelector("svg[style*='cursor']") as SVGElement,
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        `/dashboard/fullFlyer/${mockCreatedFlyer.id}`,
      );
    });

    it("should go back from the collapse icon on the full flyer page", async () => {
      window.history.pushState({}, "", "/dashboard/fullFlyer/1");
      const { container } = setup(flyerBy(businessOwner));
      await userEvent.click(
        container.querySelector("svg[style*='cursor']") as SVGElement,
      );
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe("dropdown menu", () => {
    it("should offer view, flag and copyright for a flyer the user does not own", async () => {
      setup(flyerBy(businessOwner), {
        user: { id: "other", saved_flyers: [] },
      });
      await openMenu();
      expect(screen.getByText(/View Full Flyer/)).toBeInTheDocument();
      expect(screen.queryByText(/Edit/)).toBeNull();
      expect(screen.queryByText(/Delete/)).toBeNull();

      await userEvent.click(screen.getByText(/Inappropriate/));
      expect(ctx.setShowFlaggedModal).toHaveBeenCalledWith(true);
      expect(ctx.setSelectedFlyer).toHaveBeenCalled();
    });

    it("should open the copyright modal", async () => {
      setup(flyerBy(businessOwner));
      await openMenu();
      await userEvent.click(screen.getByText(/Copyright/));
      expect(ctx.setShowDcmaModal).toHaveBeenCalledWith(true);
    });

    it("should navigate to the full flyer", async () => {
      setup(flyerBy(businessOwner));
      await openMenu();
      await userEvent.click(screen.getByText(/View Full Flyer/));
      expect(mockNavigate).toHaveBeenCalledWith(
        `/dashboard/fullFlyer/${mockCreatedFlyer.id}`,
      );
    });

    it("should offer edit and delete for the owner, but not flag or copyright", async () => {
      setup(flyerBy(businessOwner, { template: null }), { user: businessOwner });
      await openMenu();
      expect(screen.getByText(/Edit/)).toBeInTheDocument();
      expect(screen.getByText(/Delete/)).toBeInTheDocument();
      expect(screen.queryByText(/Inappropriate/)).toBeNull();
      expect(screen.queryByText(/Copyright/)).toBeNull();
      expect(screen.queryByText(/View Template/)).toBeNull();
    });

    it("should open the drawer to edit a flyer without a template", async () => {
      const flyer = flyerBy(businessOwner, { template: null });
      setup(flyer, { user: businessOwner });
      await openMenu();
      await userEvent.click(screen.getByText(/Edit/));
      expect(ctx.setSelectedFlyer).toHaveBeenCalledWith(flyer);
      expect(ctx.setIsOpenFlyerDrawer).toHaveBeenCalledWith(true);
      expect(ctx.setDrawerAction).toHaveBeenCalledWith("edit");
      expect(ctx.setShowEditFlyerModal).not.toHaveBeenCalled();
    });

    it("should open the edit modal for a flyer with a template", async () => {
      setup(flyerBy(businessOwner, { template: 2 }), { user: businessOwner });
      await openMenu();
      await userEvent.click(screen.getByText(/Edit/));
      expect(ctx.setShowEditFlyerModal).toHaveBeenCalledWith(true);
      expect(ctx.setIsOpenFlyerDrawer).not.toHaveBeenCalled();
    });

    it("should navigate to templates from View Template", async () => {
      setup(flyerBy(businessOwner, { template: 2 }), { user: businessOwner });
      await openMenu();
      await userEvent.click(screen.getByText(/View Template/));
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard/templates");
    });

    it("should open the delete modal", async () => {
      const flyer = flyerBy(businessOwner);
      setup(flyer, { user: businessOwner });
      await openMenu();
      await userEvent.click(screen.getByText(/Delete/));
      expect(ctx.setSelectedFlyer).toHaveBeenCalledWith(flyer);
      expect(ctx.setShowDeleteFlyerTemplateModal).toHaveBeenCalledWith(true);
    });
  });

  describe("save and unsave", () => {
    it("should prompt signup when saving without a user", async () => {
      setup(flyerBy(businessOwner));
      await userEvent.click(screen.getByText("Save"));
      expect(ctx.setBottomSlideInType).toHaveBeenCalledWith("signup");
      expect(ctx.setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
      expect(saveFlyerFn).not.toHaveBeenCalled();
    });

    it("should save and update the user on success", async () => {
      saveFlyerFn.mockImplementation((_id, { onSuccess }) =>
        onSuccess({ user: { id: "new" } }),
      );
      setup(flyerBy(businessOwner), { user: { id: "other", saved_flyers: [] } });
      await userEvent.click(screen.getByText("Save"));
      expect(saveFlyerFn).toHaveBeenCalledWith(
        mockCreatedFlyer.id,
        expect.any(Object),
      );
      expect(ctx.setUser).toHaveBeenCalledWith({ id: "new" });
      expect(toast.success).toHaveBeenCalledWith("Flyer saved!");
      expect(screen.getByText("Unsave")).toBeInTheDocument();
    });

    it("should revert and toast when saving fails", async () => {
      saveFlyerFn.mockImplementation((_id, { onError }) => onError());
      setup(flyerBy(businessOwner), { user: { id: "other", saved_flyers: [] } });
      await userEvent.click(screen.getByText("Save"));
      expect(toast.error).toHaveBeenCalledWith("Flyer save failed! Try again.");
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    const savedUser = {
      id: "other",
      saved_flyers: [{ flyer: { id: mockCreatedFlyer.id } }],
    };

    it("should show Unsave for an already saved flyer and unsave it", async () => {
      removeSavedFlyerFn.mockImplementation((_args, { onSuccess }) =>
        onSuccess({ user: { id: "after" } }),
      );
      setup(flyerBy(businessOwner), { user: savedUser });
      await userEvent.click(screen.getByText("Unsave"));
      expect(removeSavedFlyerFn).toHaveBeenCalledWith(
        { flyerId: mockCreatedFlyer.id, type: "flyer" },
        expect.any(Object),
      );
      expect(ctx.setUser).toHaveBeenCalledWith({ id: "after" });
      expect(toast.success).toHaveBeenCalledWith("Flyer unsaved!");
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("should toast the error when unsaving fails", async () => {
      removeSavedFlyerFn.mockImplementation((_args, { onError }) =>
        onError(new Error("nope")),
      );
      setup(flyerBy(businessOwner), { user: savedUser });
      await userEvent.click(screen.getByText("Unsave"));
      expect(toast.error).toHaveBeenCalledWith("nope");
    });

    it("should hide save and unsave on the user's own flyer", () => {
      setup(flyerBy(businessOwner), { user: businessOwner });
      expect(screen.queryByText("Save")).toBeNull();
      expect(screen.queryByText("Unsave")).toBeNull();
    });

    it("should refresh the saved state when the user logs in", () => {
      const { rerender } = setup(flyerBy(businessOwner));
      expect(screen.getByText("Save")).toBeInTheDocument();
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        ...ctx,
        user: savedUser as any,
      }));
      rerender(
        <BrowserRouter>
          <FlyerBlockInteractive flyer={flyerBy(businessOwner)} />
        </BrowserRouter>,
      );
      expect(screen.getByText("Unsave")).toBeInTheDocument();
    });
  });

  describe("likes", () => {
    const viewer = { id: "other", saved_flyers: [] };

    it("should show the like count", () => {
      setup(flyerBy(businessOwner, { likes: 3 }), { user: viewer });
      expect(screen.getByText("3 Likes")).toBeInTheDocument();
    });

    it("should show no count when there are no likes", () => {
      setup(flyerBy(businessOwner, { likes: 0 }), { user: viewer });
      expect(screen.getByText("Likes")).toBeInTheDocument();
    });

    it("should like a flyer and update the count", async () => {
      likeFlyerFn.mockImplementation((_args, { onSuccess }) =>
        onSuccess({ newLikes: 4 }),
      );
      setup(flyerBy(businessOwner, { likes: 3 }), { user: viewer });
      await userEvent.click(screen.getByText("3 Likes"));
      expect(likeFlyerFn).toHaveBeenCalledWith(
        expect.objectContaining({ type: "inc" }),
        expect.any(Object),
      );
      expect(setLikedFlyer).toHaveBeenCalledWith("add");
      expect(toast.success).toHaveBeenCalledWith("Flyer liked!");
      expect(screen.getByText("4 Likes")).toBeInTheDocument();
    });

    it("should toast when liking fails", async () => {
      likeFlyerFn.mockImplementation((_args, { onError }) =>
        onError(new Error("like failed")),
      );
      setup(flyerBy(businessOwner, { likes: 3 }), { user: viewer });
      await userEvent.click(screen.getByText("3 Likes"));
      expect(toast.error).toHaveBeenCalledWith("like failed");
    });

    it("should unlike an already liked flyer", async () => {
      likeFlyerFn.mockImplementation((_args, { onSuccess }) =>
        onSuccess({ newLikes: 2 }),
      );
      setup(flyerBy(businessOwner, { likes: 3 }), {
        user: viewer,
        liked: [mockCreatedFlyer.id!],
      });
      await userEvent.click(screen.getByText("3 Likes"));
      expect(likeFlyerFn).toHaveBeenCalledWith(
        expect.objectContaining({ type: "dec" }),
        expect.any(Object),
      );
      expect(setLikedFlyer).toHaveBeenCalledWith("remove");
      expect(toast.success).toHaveBeenCalledWith("Flyer unliked!");
      expect(screen.getByText("2 Likes")).toBeInTheDocument();
    });

    it("should toast when unliking fails", async () => {
      likeFlyerFn.mockImplementation((_args, { onError }) =>
        onError(new Error("unlike failed")),
      );
      setup(flyerBy(businessOwner, { likes: 3 }), {
        user: viewer,
        liked: [mockCreatedFlyer.id!],
      });
      await userEvent.click(screen.getByText("3 Likes"));
      expect(toast.error).toHaveBeenCalledWith("unlike failed");
    });

    it("should not let owners like their own flyer", async () => {
      setup(flyerBy(businessOwner, { likes: 3 }), { user: businessOwner });
      await userEvent.click(screen.getByText("3 Likes"));
      expect(likeFlyerFn).not.toHaveBeenCalled();
    });
  });

  describe("comments", () => {
    it("should hide the comments action when comments are disabled", () => {
      setup(flyerBy(businessOwner, { hasComments: false }));
      expect(screen.queryByText("Comments")).toBeNull();
    });

    it("should open the comments slide-in", async () => {
      const flyer = flyerBy(businessOwner, { hasComments: true });
      setup(flyer);
      await userEvent.click(screen.getByText("Comments"));
      expect(ctx.setSelectedFlyer).toHaveBeenCalledWith(flyer);
      expect(ctx.setBottomSlideInType).toHaveBeenCalledWith("comments");
      expect(ctx.setIsOpenBottomSlideIn).toHaveBeenCalledWith(true);
    });
  });

  describe("share", () => {
    it("should copy the link and toast", async () => {
      const writeText = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);
      setup(flyerBy(businessOwner));
      await userEvent.click(screen.getByText("Share"));
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/dashboard/fullFlyer/${mockCreatedFlyer.id}`,
      );
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Link copied"),
        { duration: 5000 },
      );
      writeText.mockRestore();
    });
  });

  it("should render in list view", () => {
    setup(flyerBy(businessOwner), { listView: true });
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });
});
