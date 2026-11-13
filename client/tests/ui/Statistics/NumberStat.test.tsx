import { render, screen } from "@testing-library/react";
import NumberStat from "../../../src/ui/Statistics/NumberStat";

describe("NumberStat", () => {
  it("should render the number and title", () => {
    render(<NumberStat data={{ statNum: 42, title: "Total Views" }} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Total Views")).toBeInTheDocument();
  });
});
