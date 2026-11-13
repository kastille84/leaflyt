import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";

import ResetPassword from "../../../src/features/authentication/ResetPassword";

const mockUpdatePasswordFn = vi.fn();
vi.mock("react-hot-toast");
vi.mock("../../../src/features/authentication/useLogin", () => ({
  default: () => ({ updatePasswordFn: mockUpdatePasswordFn }),
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    mockUpdatePasswordFn.mockReset();
    vi.mocked(toast.success).mockReset();
    Element.prototype.scrollIntoView = vi.fn();
  });

  async function submitPassword(password = "newpassword1") {
    render(<ResetPassword />);
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: password },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Update Password" }));
    });
  }

  it("renders the heading, password input and submit button", () => {
    render(<ResetPassword />);
    expect(screen.getByText("Reset Password")).toBeTruthy();
    expect(
      screen.getByText("Please provide your new password for this account."),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Update Password" }),
    ).toBeTruthy();
  });

  it("calls updatePasswordFn with the new password", async () => {
    await submitPassword();
    await waitFor(() => expect(mockUpdatePasswordFn).toHaveBeenCalled());
    expect(mockUpdatePasswordFn.mock.calls[0][0]).toBe("newpassword1");
  });

  it("shows the spinner while updating", async () => {
    await submitPassword();
    expect(await screen.findByText("Updating your password...")).toBeTruthy();
  });

  it("toasts and hides the spinner on success", async () => {
    mockUpdatePasswordFn.mockImplementation((_pw, { onSuccess }) =>
      onSuccess({}),
    );
    await submitPassword();
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Password Updated! Try to login now!",
        { duration: 6000 },
      ),
    );
    expect(screen.queryByText("Updating your password...")).toBeNull();
  });

  it("shows the error and hides the spinner on failure", async () => {
    mockUpdatePasswordFn.mockImplementation((_pw, { onError }) =>
      onError({ message: "Update failed" }),
    );
    await submitPassword();
    expect(await screen.findByText("Error: Update failed")).toBeTruthy();
    expect(screen.queryByText("Updating your password...")).toBeNull();
  });

  it("shows the error when updatePasswordFn throws", async () => {
    mockUpdatePasswordFn.mockImplementation(() => {
      throw new Error("Thrown error");
    });
    await submitPassword();
    expect(await screen.findByText("Error: Thrown error")).toBeTruthy();
    expect(screen.queryByText("Updating your password...")).toBeNull();
  });
});
