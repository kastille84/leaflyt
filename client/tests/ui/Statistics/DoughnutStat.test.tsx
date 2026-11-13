import { render, screen } from "@testing-library/react";
import DoughnutStat from "../../../src/ui/Statistics/DoughnutStat";

const data = {
  statNum: "7/10",
  title: "Flyers Used",
  datasets: [{ data: [7, 3], backgroundColor: ["#111", "#eee"] }],
};

describe("DoughnutStat", () => {
  it("should render the number and title", () => {
    render(<DoughnutStat data={data} />);
    expect(screen.getByText("7/10")).toBeInTheDocument();
    expect(screen.getByText("Flyers Used")).toBeInTheDocument();
  });

  it("should draw the chart on a canvas", () => {
    const { container } = render(<DoughnutStat data={data} />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
