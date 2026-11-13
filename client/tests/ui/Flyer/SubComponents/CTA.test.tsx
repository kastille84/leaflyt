import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CTA from "../../../../src/ui/Flyer/SubComponents/CTA";

const flyer = (callToAction: any) => ({ callToAction }) as any;
const offer = {
  ctaType: "offer",
  headline: "20% off",
  instructions: "<p>Show this code</p>",
};

describe("CTA", () => {
  it("should render the headline and instructions", () => {
    render(<CTA flyer={flyer(offer)} />);
    expect(screen.getByText("20% off")).toBeInTheDocument();
    expect(screen.getByText("Show this code")).toBeInTheDocument();
  });

  it("should skip instructions when there are none", () => {
    render(<CTA flyer={flyer({ ctaType: "request", headline: "Call us" })} />);
    expect(screen.getByText("Call us")).toBeInTheDocument();
    expect(screen.queryByText("Show this code")).toBeNull();
  });

  it("should handle a flyer without a call to action", () => {
    render(<CTA flyer={flyer(undefined)} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should offer Redeem for a redeemable offer", async () => {
    const handleRedeem = vi.fn();
    render(<CTA flyer={flyer(offer)} redeemable handleRedeem={handleRedeem} />);
    expect(screen.getByText(/If redeeming in person/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Redeem" }));
    expect(handleRedeem).toHaveBeenCalledTimes(1);
  });

  it("should not offer Redeem without a handler", () => {
    render(<CTA flyer={flyer(offer)} redeemable />);
    expect(screen.queryByRole("button", { name: "Redeem" })).toBeNull();
  });

  it("should not offer Redeem for a non-offer", () => {
    render(
      <CTA
        flyer={flyer({ ctaType: "request", headline: "h" })}
        redeemable
        handleRedeem={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: "Redeem" })).toBeNull();
  });

  it("should tell visitors to save a non-redeemable offer", () => {
    render(<CTA flyer={flyer(offer)} />);
    expect(screen.getByText(/Click on Save below/)).toBeInTheDocument();
  });

  it("should hide the save hint from the flyer's owner", () => {
    render(<CTA flyer={flyer(offer)} belongsToUser />);
    expect(screen.queryByText(/Click on Save below/)).toBeNull();
  });
});
