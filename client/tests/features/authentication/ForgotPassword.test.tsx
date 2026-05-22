import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "../../../src/features/authentication/ForgotPassword";
import React from "react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import toast from "react-hot-toast";

// ESM-compatible mocks
const mockForgotPasswordFn = vi.fn();
vi.mock("react-hot-toast");
vi.mock("../../../src/features/authentication/useLogin", () => {
  return {
    default: () => ({
      forgotPasswordFn: mockForgotPasswordFn,
    }),
  };
});
vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: () => ({ user: null }),
}));

describe("ForgotPassword (Vitest)", () => {
  beforeEach(() => {
    mockForgotPasswordFn.mockReset();
    (toast.success as any).mockReset();
  });

  it("renders all form elements", () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please provide your email address/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset Password/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/We will send you a link/i)).toBeInTheDocument();
  });

  it("submits the form and calls forgotPasswordFn with email", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(mockForgotPasswordFn).toHaveBeenCalledWith(
        "test@example.com",
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });
  });

  it("shows success toast on successful reset", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    mockForgotPasswordFn.mockImplementation((email, { onSuccess }) => {
      onSuccess({});
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Password reset link sent"),
        expect.any(Object),
      );
    });
  });

  it("shows error message on error", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    mockForgotPasswordFn.mockImplementation((email, { onError }) => {
      onError({ message: "Something went wrong" });
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Something went wrong/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty email", async () => {
    render(<ForgotPassword />);
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("shows spinner when submitting", async () => {
    mockForgotPasswordFn.mockImplementation(() => {});
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    expect(
      await screen.findByText(/Updating your account/i),
    ).toBeInTheDocument();
  });

  it("handles thrown error in onSubmit", async () => {
    mockForgotPasswordFn.mockImplementation(() => {
      throw new Error("Thrown error");
    });
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    await waitFor(() => {
      expect(screen.getByText(/Error: Thrown error/i)).toBeInTheDocument();
    });
  });
});
