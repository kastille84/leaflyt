import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  it("should render App", () => {
    render(<App />);
    const app = screen.getByTestId("app");
    expect(app).toBeTruthy();
  });
});
