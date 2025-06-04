import { render, screen } from "@testing-library/react";
import TestComp from "../../src/ui/TestComp";

describe("Testing", () => {
  it("should render TestComp", () => {
    render(<TestComp />);
    const comp = screen.getByTestId("testcomp");
    expect(comp.textContent).toBe("TestComp");
    expect(true).toBeTruthy();
  });
});
