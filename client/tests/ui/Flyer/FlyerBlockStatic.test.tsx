import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";
import FlyerBlockStatic from "../../../src/ui/Flyer/FlyerBlockStatic";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

vi.mock("../../../src/context/GlobalContext");
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
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

const registeredUser = (user: any) => ({ ...mockCreatedFlyer, user }) as any;
const anonymousFlyer = (extra: any) =>
  ({ ...mockCreatedFlyer, user: null, ...extra }) as any;

describe("FlyerBlockStatic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
    }));
  });

  describe("avatar and name", () => {
    it("should show Anonymous for anonymous flyers", () => {
      render(<FlyerBlockStatic flyer={anonymousFlyer({ typeOfUser: "anonymous" })} />);
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("Anonymous")).toBeInTheDocument();
    });

    it("should show an unregistered individual", () => {
      render(
        <FlyerBlockStatic
          flyer={anonymousFlyer({
            typeOfUser: "individual",
            individual: { name: { firstName: "Sam", lastName: "Lee" } },
          })}
        />,
      );
      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText(/Sam/)).toBeInTheDocument();
      expect(screen.getByText(/Lee/)).toBeInTheDocument();
    });

    it("should show an unregistered organization", () => {
      render(
        <FlyerBlockStatic
          flyer={anonymousFlyer({
            typeOfUser: "organization",
            organization: { name: "Club" },
          })}
        />,
      );
      expect(screen.getByText("C")).toBeInTheDocument();
      expect(screen.getByText("Club")).toBeInTheDocument();
    });

    it("should show an unregistered business", () => {
      render(
        <FlyerBlockStatic
          flyer={anonymousFlyer({
            typeOfUser: "business",
            business: { name: "Shop" },
          })}
        />,
      );
      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText("Shop")).toBeInTheDocument();
    });

    it("should show a registered individual", () => {
      render(
        <FlyerBlockStatic
          flyer={registeredUser({
            typeOfUser: "individual",
            firstName: "Jane",
            lastName: "Doe",
          })}
        />,
      );
      expect(screen.getByText("J")).toBeInTheDocument();
      expect(screen.getByText(/Jane/)).toBeInTheDocument();
    });

    it("should show a registered business or organization by name", () => {
      render(
        <FlyerBlockStatic
          flyer={registeredUser({ typeOfUser: "business", name: "Acme" })}
        />,
      );
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });
  });

  describe("content tabs", () => {
    const flyer = registeredUser({ typeOfUser: "business", name: "Acme" });

    it("should show main content with the carousel by default", () => {
      render(<FlyerBlockStatic flyer={flyer} />);
      expect(screen.getByTestId("info")).toBeInTheDocument();
      expect(screen.getByTestId("image-carousel")).toBeInTheDocument();
    });

    it("should not show the carousel when there are no files", () => {
      render(<FlyerBlockStatic flyer={{ ...flyer, fileUrlArr: [] }} />);
      expect(screen.queryByTestId("image-carousel")).toBeNull();
    });

    it("should not show the carousel when fileUrlArr is missing", () => {
      render(<FlyerBlockStatic flyer={{ ...flyer, fileUrlArr: undefined }} />);
      expect(screen.queryByTestId("image-carousel")).toBeNull();
    });

    it("should switch to contact and back to main", async () => {
      render(<FlyerBlockStatic flyer={flyer} />);
      await userEvent.click(screen.getByText("contact"));
      expect(screen.getByTestId("contact")).toBeInTheDocument();
      expect(screen.queryByTestId("info")).toBeNull();
      await userEvent.click(screen.getByText("main"));
      expect(screen.getByTestId("info")).toBeInTheDocument();
    });

    it("should switch to the cta and pass redeem props", async () => {
      const handleRedeem = vi.fn();
      render(
        <FlyerBlockStatic flyer={flyer} redeemable handleRedeem={handleRedeem} />,
      );
      await userEvent.click(screen.getByText("deals"));
      expect(screen.getByTestId("cta")).toBeInTheDocument();
      expect(ctaProps).toHaveBeenCalledWith(
        expect.objectContaining({ redeemable: true, handleRedeem }),
      );
    });

    it("should label a non-offer cta pill as request", () => {
      render(
        <FlyerBlockStatic
          flyer={{
            ...flyer,
            callToAction: { ctaType: "request", headline: "h" },
          }}
        />,
      );
      expect(screen.getByText("request")).toBeInTheDocument();
    });

    it("should hide the cta pill when ctaType is none", () => {
      render(
        <FlyerBlockStatic
          flyer={{ ...flyer, callToAction: { ctaType: "none" } }}
        />,
      );
      expect(screen.queryByText("deals")).toBeNull();
      expect(screen.queryByText("request")).toBeNull();
    });

    it("should hide the cta pill when there is no callToAction", () => {
      render(<FlyerBlockStatic flyer={{ ...flyer, callToAction: null }} />);
      expect(screen.queryByText("deals")).toBeNull();
    });
  });

  describe("design", () => {
    it("should use the default design and then update when the flyer gains one", () => {
      const base = {
        ...registeredUser({ typeOfUser: "business", name: "Acme" }),
        flyerDesign: null,
      };
      const { rerender } = render(<FlyerBlockStatic flyer={base} />);
      expect(screen.getByText("Acme")).toBeInTheDocument();
      rerender(
        <FlyerBlockStatic
          flyer={{ ...base, flyerDesign: mockCreatedFlyer.flyerDesign }}
        />,
      );
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });
  });

  describe("actions", () => {
    const flyer = registeredUser({ typeOfUser: "business", name: "Acme" });
    let writeText: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      writeText = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(navigator.clipboard, "writeText").mockImplementation(writeText);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      window.history.pushState({}, "", "/");
    });

    it("should show the comments action only when comments are enabled", () => {
      const { rerender } = render(<FlyerBlockStatic flyer={flyer} />);
      expect(screen.queryByText("Comments")).toBeNull();
      rerender(<FlyerBlockStatic flyer={{ ...flyer, hasComments: true }} />);
      expect(screen.getByText("Comments")).toBeInTheDocument();
    });

    it("should copy the link and toast on share", async () => {
      render(<FlyerBlockStatic flyer={flyer} />);
      await userEvent.click(screen.getByText("Share"));
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/dashboard/fullFlyer/${flyer.id}`,
      );
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Link copied"),
        { duration: 5000 },
      );
    });

    it("should not copy the link on a template page", async () => {
      window.history.pushState({}, "", "/dashboard/templates");
      render(<FlyerBlockStatic flyer={flyer} />);
      await userEvent.click(screen.getByText("Share"));
      expect(writeText).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
