import { render, screen, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import * as GlobalContext from "../../../src/context/GlobalContext";
import LoginModal from "../../../src/features/authentication/LoginModal";
import useLogin from "../../../src/features/authentication/useLogin";

import {
  getActionButtons,
  getFieldError,
  QueryClientProviderWrapper,
} from "../../test-utils";
import { authUserProfileResponse } from "../../fixtures/authentication/login";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/globalContext";

const user = userEvent.setup();

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/authentication/useLogin");

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
  describe("Display", () => {
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
  });

  describe("Input Functionality", () => {
    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        showLoginModal: true,
      }));
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
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

  describe("Submit the form", () => {
    const loginUserMock = vi.fn();
    const setUserSpy = vi.fn();
    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        showLoginModal: true,
        setUser: setUserSpy,
      }));
      vi.mocked(useLogin).mockImplementation(() => {
        return {
          login: loginUserMock,
          loginError: null,
        };
      });
    });
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("should login the user successfully", async () => {
      // assemble
      render(<LoginModal />, { wrapper: QueryClientProviderWrapper() });
      // act
      const { input: emailInput } = getEmail();
      await user.type(emailInput, "test@email.com");
      const { input: passwordInput } = getPassword();
      await user.type(passwordInput, "password1");
      const { submit } = getActionButtons();
      await act(async () => {
        await user.click(submit);
      });
      // trigger onSuccess with response
      await act(async () => {
        await loginUserMock.mock.calls[0][1].onSuccess({
          data: authUserProfileResponse,
          error: null,
        });
      });
      // assert
      await waitFor(async () => {
        await expect(setUserSpy).toHaveBeenCalledWith(authUserProfileResponse);
      });
    });

    it("should throw an error if login fails", async () => {
      // assemble
      render(<LoginModal />, { wrapper: QueryClientProviderWrapper() });
      // act
      const { input: emailInput } = getEmail();
      await user.type(emailInput, "test@email.com");
      const { input: passwordInput } = getPassword();
      await user.type(passwordInput, "password1");
      const { submit } = getActionButtons();
      await act(async () => {
        await user.click(submit);
      });
      // trigger onError with error
      await act(async () => {
        await loginUserMock.mock.calls[0][1].onError({
          message: "error has occurred",
        });
      });

      // assert
      await waitFor(async () => {
        await expect(setUserSpy).not.toHaveBeenCalled();
      });
    });
  });
});
