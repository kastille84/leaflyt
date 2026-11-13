import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import LimitExceededWarning from "../../src/ui/LimitExceededWarning";

describe("LimitExceededWarning", () => {
  it("should render the text and a close icon by default", () => {
    const { container } = render(<LimitExceededWarning text="Too many" />);
    expect(screen.getByText("Too many")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render children instead of text", () => {
    render(
      <LimitExceededWarning text="ignored">
        <span>custom</span>
      </LimitExceededWarning>
    );
    expect(screen.getByText("custom")).toBeInTheDocument();
    expect(screen.queryByText("ignored")).not.toBeInTheDocument();
  });

  it("should hide itself when the close icon is clicked", async () => {
    const { container } = render(<LimitExceededWarning text="Too many" />);
    await userEvent.setup().click(container.querySelector("svg")!);
    expect(screen.queryByText("Too many")).not.toBeInTheDocument();
  });

  it("should not render a close icon when not closable", () => {
    const { container } = render(
      <LimitExceededWarning text="Too many" isClosable={false} />
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
