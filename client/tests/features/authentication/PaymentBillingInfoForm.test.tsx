import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, vi } from "vitest";
// components
import PaymentBillingInfoForm from "../../../src/features/authentication/PaymentBillingInfoForm";
// context
// hooks
import { useGlobalContext } from "../../../src/context/GlobalContext";
// services
// fixtures
// userEvent

// mocks
vi.mock("../../../src/context/GlobalContext", () => ({
  useGlobalContext: vi.fn(),
}));

describe("PaymentBillingInfoForm", () => {
  beforeEach(() => {});
  afterEach(() => {
    vi.clearAllMocks();
  });
});
