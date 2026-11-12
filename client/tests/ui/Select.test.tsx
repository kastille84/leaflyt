import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Select from "../../src/ui/Select";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("Select", () => {
  it("should render the options", () => {
    render(
      <Select options={options} value="a" onChange={vi.fn()} hasError={false} />
    );
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("combobox")).toHaveValue("a");
  });

  it("should call onChange when an option is chosen", async () => {
    const onChange = vi.fn();
    render(
      <Select options={options} value="a" onChange={onChange} hasError={false} />
    );
    await userEvent.setup().selectOptions(screen.getByRole("combobox"), "b");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should render without options", () => {
    render(<Select onChange={vi.fn()} hasError />);
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("should accept the white type", () => {
    render(
      <Select
        type="white"
        options={options}
        value="a"
        onChange={vi.fn()}
        hasError={false}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
