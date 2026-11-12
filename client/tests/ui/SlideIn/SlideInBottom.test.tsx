import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SlideInBottom from "../../../src/ui/SlideIn/SlideInBottom";
import { useGlobalContext } from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));
vi.mock("react-modern-drawer", () => ({
  default: ({ open, onClose, children }: any) =>
    open ? (
      <div data-testid="drawer">
        <button data-testid="drawer-backdrop" onClick={onClose} />
        {children}
      </div>
    ) : null,
}));
vi.mock("react-modern-drawer/dist/index.css", () => ({}));

// each container is replaced by a stub that echoes its props
const stub = vi.hoisted(() => async (name: string) => {
  const { createElement } = await import("react");
  return {
    default: (props: any) =>
      createElement("div", { "data-testid": name }, JSON.stringify(props)),
  };
});
vi.mock("../../../src/features/authentication/SignupContainer", () =>
  stub("signup"),
);
vi.mock("../../../src/features/authentication/ChangePlanContainer", () =>
  stub("change-plan"),
);
vi.mock("../../../src/features/authentication/UnpaidPlanContainer", () =>
  stub("unpaid"),
);
vi.mock("../../../src/ui/Flyer/FullCarouselContainer", () => stub("carousel"));
vi.mock(
  "../../../src/features/createFlyer/FlyerDesigner/FlyerDesignerContainer",
  () => stub("flyer-designer"),
);
vi.mock("../../../src/features/template/TemplateSelectionContainer", () =>
  stub("templates"),
);
vi.mock(
  "../../../src/features/assets/AssetSelection/AssestSelectionContainer",
  () => stub("assets"),
);
vi.mock("../../../src/features/account/EditAccountInfo", () =>
  stub("edit-account"),
);
vi.mock("../../../src/ui/Flyer/SubComponents/CommentsSection.tsx", () =>
  stub("comments"),
);
vi.mock("../../../src/context/FlyerDesignerContext", () => ({
  FlyerDesignerContextProvider: ({ children }: any) => <>{children}</>,
}));
vi.mock("../../../src/context/AssetSelectionContext", () => ({
  AssetSelectionContextProvider: ({ children }: any) => <>{children}</>,
}));

let ctx: any;
function setup(type: string | null, open = true) {
  ctx = {
    ...mockUseGlobalContextReturnObj,
    isOpenBottomSlideIn: open,
    bottomSlideInType: type,
    setIsOpenBottomSlideIn: vi.fn(),
    setBottomSlideInType: vi.fn(),
    setContextImages: vi.fn(),
  };
  (useGlobalContext as any).mockReturnValue(ctx);
  return render(<SlideInBottom />);
}

describe("SlideInBottom", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render nothing when closed", () => {
    setup("signup", false);
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  it.each([
    ["signup", "signup"],
    ["carousel", "carousel"],
    ["flyerDesigner", "flyer-designer"],
    ["hasTemplates", "templates"],
    ["chooseAssets", "assets"],
    ["editAccountInfo", "edit-account"],
    ["comments", "comments"],
    ["unpaid", "unpaid"],
  ])("should render the %s content", (type, testId) => {
    setup(type);
    expect(screen.getByTestId(testId)).toBeDefined();
  });

  it("should render ChangePlanContainer with upgrade props", () => {
    setup("upgrade");
    expect(screen.getByTestId("change-plan").textContent).toContain(
      '"isUpgrade":true',
    );
  });

  it("should render ChangePlanContainer with paid plan props", () => {
    setup("changePlan");
    expect(screen.getByTestId("change-plan").textContent).toContain(
      '"isAnyPaidPlan":true',
    );
  });

  it("should render no content for an unknown type", () => {
    setup(null);
    expect(screen.queryByTestId("signup")).toBeNull();
  });

  it.each(["chooseAssets", "signup", "unpaid"])(
    "should hide the close icon for %s",
    (type) => {
      const { container } = setup(type);
      expect(container.querySelector("svg")).toBeNull();
    },
  );

  it("should close via the X icon", async () => {
    const { container } = setup("comments");
    await userEvent.setup().click(container.querySelector("svg")!);
    expect(ctx.setIsOpenBottomSlideIn).toHaveBeenCalledWith(false);
    expect(ctx.setBottomSlideInType).toHaveBeenCalledWith(null);
    expect(ctx.setContextImages).not.toHaveBeenCalled();
  });

  it("should clear context images when closing the carousel", async () => {
    setup("carousel");
    await userEvent.setup().click(screen.getByTestId("drawer-backdrop"));
    expect(ctx.setContextImages).toHaveBeenCalledWith(null);
  });
});
