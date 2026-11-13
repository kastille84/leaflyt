import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FaqItem from "../../src/ui/FaqItem";

describe("FaqItem", () => {
  it("should render the question and answer, collapsed by default", () => {
    render(<FaqItem question="What is it?" answer="A flyer board." />);
    expect(screen.getByRole("heading", { name: "What is it?" })).toBeDefined();
    const answer = screen.getByText("A flyer board.");
    expect(getComputedStyle(answer).maxHeight).toBe("0px");
  });

  it("should expand and collapse the answer when the question is clicked", async () => {
    render(<FaqItem question="What is it?" answer="A flyer board." />);
    const user = userEvent.setup();
    const question = screen.getByRole("heading", { name: "What is it?" });
    const answer = screen.getByText("A flyer board.");

    await user.click(question);
    expect(getComputedStyle(answer).maxHeight).not.toBe("0px");

    await user.click(question);
    expect(getComputedStyle(answer).maxHeight).toBe("0px");
  });
});
