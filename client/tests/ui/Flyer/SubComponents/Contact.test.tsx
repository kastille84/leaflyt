import { render, screen } from "@testing-library/react";
import Contact from "../../../../src/ui/Flyer/SubComponents/Contact";
import { mockCreatedFlyer } from "../../../fixtures/flyer/flyer";

const owner = {
  email: "acme@example.com",
  phone: "555-1234",
  website: "https://acme.example.com",
  name: "Acme",
  address: { formatted_address: "1 Main St" },
};

const flyerBy = (user: any, extra: any = {}) =>
  ({ ...mockCreatedFlyer, user, ...extra }) as any;

describe("Contact", () => {
  it("should show the name and every contact link from the flyer owner", () => {
    render(<Contact flyer={flyerBy(owner)} />);
    expect(screen.getByRole("heading", { name: "Acme" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: owner.email })).toHaveAttribute(
      "href",
      `mailto:${owner.email}`,
    );
    expect(screen.getByRole("link", { name: owner.phone })).toHaveAttribute(
      "href",
      `tel:${owner.phone}`,
    );
    const website = screen.getByRole("link", { name: owner.website });
    expect(website).toHaveAttribute("href", owner.website);
    expect(website).toHaveAttribute("target", "_blank");
    expect(website).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("1 Main St")).toBeInTheDocument();
  });

  it("should show first and last name for individuals", () => {
    render(
      <Contact
        flyer={flyerBy({ ...owner, firstName: "Jane", lastName: "Doe" })}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Jane Doe" }),
    ).toBeInTheDocument();
  });

  it("should omit contact rows that are missing", () => {
    render(
      <Contact
        flyer={flyerBy({
          ...owner,
          email: "",
          phone: "",
          website: "",
          address: { formatted_address: "" },
        })}
      />,
    );
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryByText("1 Main St")).toBeNull();
  });

  it("should prefer the provided user over the flyer", () => {
    render(
      <Contact
        flyer={flyerBy({ ...owner, name: "Flyer Owner" })}
        user={{ ...owner, name: "Signed In" } as any}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Signed In" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Flyer Owner")).toBeNull();
  });

  it("should show first and last name from the provided user", () => {
    render(
      <Contact
        flyer={flyerBy(owner)}
        user={{ ...owner, firstName: "Sam", lastName: "Lee" } as any}
      />,
    );
    expect(screen.getByRole("heading", { name: "Sam Lee" })).toBeInTheDocument();
  });

  it("should fall back to the default design when the flyer has none", () => {
    render(<Contact flyer={flyerBy(owner, { flyerDesign: null })} />);
    expect(screen.getByRole("heading", { name: "Acme" })).toBeInTheDocument();
  });
});
