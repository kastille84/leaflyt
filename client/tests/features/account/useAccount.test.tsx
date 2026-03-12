import {
  render,
  screen,
  waitFor,
  act,
  renderHook,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, vi } from "vitest";

// components

// context

// hooks
import useAccount from "../../../src/features/account/useAccount";

// services
import * as apiUser from "../../../src/services/apiUser";
import { QueryClientProviderWrapper } from "../../test-utils";

// fixtures

// userEvent

// mocks

vi.mock("../../../src/features/account/useAccount");
vi.mock("../../../src/services/apiUser");

describe("useAccount", () => {
  it("should call updateUserProfile when updateProfile is called", async () => {
    vi.mocked(apiUser.updateUserProfile).mockResolvedValue({
      user: { name: "Elvin" },
      error: null,
    });

    const { result } = renderHook(() => useAccount(), {
      wrapper: QueryClientProviderWrapper(),
    });
    const { updateProfile } = result.current;
    const profile = { name: "Elvin" };
    await act(async () => {
      await updateProfile({
        profile,
        typeOfUser: "individual",
        userId: "userId",
      });
    });
    await waitFor(() => expect(apiUser.updateUserProfile).toHaveBeenCalled());
  });
});
