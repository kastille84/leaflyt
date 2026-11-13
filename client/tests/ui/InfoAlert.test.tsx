import { render, screen } from "@testing-library/react";
import InfoAlert from "../../src/ui/InfoAlert";

describe("InfoAlert", () => {
  it("should default to the info type with text", () => {
    render(<InfoAlert text="Some info" />);
    expect(screen.getByText("info")).toBeInTheDocument();
    expect(screen.getByText("Some info")).toBeInTheDocument();
  });

  it.each(["info", "warning", "error"] as const)(
    "should show the %s heading and an icon",
    (type) => {
      render(<InfoAlert type={type} text="msg" />);
      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toHaveTextContent(type);
      expect(heading.querySelector("svg")).toBeInTheDocument();
    }
  );

  it("should hide the heading when hideIcon is set", () => {
    render(<InfoAlert text="msg" hideIcon />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("msg")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(
      <InfoAlert>
        <span>child content</span>
      </InfoAlert>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("should not render a paragraph without text", () => {
    const { container } = render(<InfoAlert />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });
});
