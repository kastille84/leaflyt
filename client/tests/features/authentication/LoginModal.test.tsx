import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import * as GlobalContext from "../../../src/context/GlobalContext";
import LoginModal from "../../../src/features/authentication/LoginModal";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/globalContext";
import { getFieldError, QueryClientProviderWrapper } from "../../test-utils";

const user = userEvent.setup();

// mocks
vi.mock("../../../src/context/GlobalContext");

// getters
function getEmail() {
  const Container = screen.getByTestId("email-container");
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    input: Container.querySelector("input") as HTMLInputElement,
  };
}

function getPassword() {
  const Container = screen.getByTestId("password-container");
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    input: Container.querySelector("input") as HTMLInputElement,
  };
}

describe("LoginModal", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showLoginModal: true,
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render LoginModal", async () => {
    // assemble
    // act
    render(<LoginModal />, { wrapper: QueryClientProviderWrapper() });
    // assert
    const loginModalComp = screen.getByTestId("login-modal");
    expect(loginModalComp).toBeTruthy();
  });

  describe("Input Functionality", () => {
    it("should update the email", async () => {
      // assemble
      render(<LoginModal />, { wrapper: QueryClientProviderWrapper() });
      // act
      const { input: emailInput } = getEmail();
      await user.type(emailInput, "test@email.com");
      // assert
      await waitFor(() => {
        expect(emailInput.value).toBe("test@email.com");
      });

      await user.clear(emailInput);
      await user.tab();
      const { error: emailError } = getFieldError("email");
      expect(emailError.textContent).toBe("Email is required");
    });

    it("should update the password", async () => {
      // assemble
      render(<LoginModal />, { wrapper: QueryClientProviderWrapper() });
      // act
      const { input: passwordInput } = getPassword();
      await user.type(passwordInput, "password1");
      // assert
      await waitFor(() => {
        expect(passwordInput.value).toBe("password1");
      });
      await user.clear(passwordInput);
      await user.tab();
      const { error: passwordError } = getFieldError("password");
      expect(passwordError.textContent).toBe("Password is required");
    });
  });

  describe("login the user", () => {
    it("should login the user", async () => {
      // assemble
      render(<LoginModal />, { wrapper: QueryClientProviderWrapper() });
      // act
      const { input: emailInput } = getEmail();
      await user.type(emailInput, "test@email.com");
      const { input: passwordInput } = getPassword();
      await user.type(passwordInput, "password1");
      const { submit } = getActionButtons();
      await user.click(submit);
      // assert
      await waitFor(() => {
        expect(mockUseGlobalContextReturnObj.loginUser).toHaveBeenCalled();
      });
    });
  });
});
