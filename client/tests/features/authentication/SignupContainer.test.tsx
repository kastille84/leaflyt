import { act, render, screen, waitFor } from "@testing-library/react";
import SignupContainer from "../../../src/features/authentication/SignupContainer";
import { QueryClientProviderWrapper } from "../../test-utils";

describe("SignupContainer", () => {
  it("should render", () => {
    const { container } = render(<SignupContainer />, {
      wrapper: QueryClientProviderWrapper(),
    });
    expect(container).toBeInTheDocument();
  });
});
