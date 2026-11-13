import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Info from "../../../../src/ui/Flyer/SubComponents/Info";
import { mockCreatedFlyer } from "../../../fixtures/flyer/flyer";

const styles = mockCreatedFlyer.flyerDesign as any;
const longContent = `<p>${"word ".repeat(40)}</p>`;
const flyerWith = (extra: any = {}) =>
  ({ ...mockCreatedFlyer, ...extra }) as any;

describe("Info", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("should render the subcategory, title and tags", () => {
    render(
      <Info
        flyer={flyerWith({ content: "<p>short</p>" })}
        flyerStyles={styles}
      />,
    );
    expect(screen.getByText("For Sale")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Facial Cleanser" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/#some/)).toBeInTheDocument();
    expect(screen.getByText(/#new/)).toBeInTheDocument();
    expect(screen.getByText(/#product/)).toBeInTheDocument();
  });

  it("should render no tags when the flyer has none", () => {
    render(<Info flyer={flyerWith({ tags: null })} flyerStyles={styles} />);
    expect(screen.queryByText(/#/)).toBeNull();
  });

  it("should shorten a long title outside the full flyer", () => {
    const title = "T".repeat(100);
    render(<Info flyer={flyerWith({ title })} flyerStyles={styles} />);
    expect(screen.getByRole("heading")).toHaveTextContent(
      `${"T".repeat(80)}...`,
    );
  });

  it("should not offer Read more for short content", () => {
    render(
      <Info
        flyer={flyerWith({ content: "<p>short</p>" })}
        flyerStyles={styles}
      />,
    );
    expect(screen.getByText("short")).toBeInTheDocument();
    expect(screen.queryByText("Read more")).toBeNull();
  });

  it("should truncate long content and toggle Read more / Read less", async () => {
    const { container } = render(
      <Info flyer={flyerWith({ content: longContent })} flyerStyles={styles} />,
    );
    expect(container.textContent).toContain("...");

    await userEvent.click(screen.getByText("Read more"));
    expect(container.textContent).not.toContain("...");

    await userEvent.click(screen.getByText("Read less"));
    expect(container.textContent).toContain("...");
    expect(screen.getByText("Read more")).toBeInTheDocument();
  });

  it("should show the full title and content on the full flyer page", () => {
    window.history.pushState({}, "", "/dashboard/fullFlyer/1");
    const title = "T".repeat(100);
    const { container } = render(
      <Info
        flyer={flyerWith({ title, content: longContent })}
        flyerStyles={styles}
      />,
    );
    expect(screen.getByRole("heading")).toHaveTextContent(title);
    expect(container.textContent).not.toContain("...");
    expect(screen.queryByText("Read more")).toBeNull();
    expect(screen.queryByText("Read less")).toBeNull();
  });
});
