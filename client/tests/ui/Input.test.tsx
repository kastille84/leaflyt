import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Input from "../../src/ui/Input";

describe("Input", () => {
  it("should render an input and forward props", async () => {
    const onChange = vi.fn();
    render(<Input placeholder="name" onChange={onChange} />);
    const input = screen.getByPlaceholderText("name");
    await userEvent.setup().type(input, "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(input).toHaveValue("ab");
  });

  it("should render in the default and error states", () => {
    render(
      <>
        <Input placeholder="plain" />
        <Input placeholder="invalid" hasError />
      </>
    );
    expect(screen.getByPlaceholderText("plain")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("invalid")).toBeInTheDocument();
  });
});
