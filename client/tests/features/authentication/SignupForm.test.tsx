import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import SignupForm from "../../../src/features/authentication/SignupForm";
import {
  getActionButtons,
  getAddressResults,
  getFieldError,
  getInput,
  getSelect,
  QueryClientProviderWrapper,
} from "../../test-utils";
import * as GlobalContext from "../../../src/context/GlobalContext";
import useSignup from "../../../src/features/authentication/useSignup";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import toast from "react-hot-toast";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import {
  placeDetailsCallbackArg,
  placePredictionsArr,
} from "../../fixtures/googlePlaces";
import {
  signupSubmitWithError,
  signupSubmitWithSuccess,
} from "../../fixtures/authentication/signup";

const user = userEvent.setup();

// mocks
vi.mock("../../../src/context/GlobalContext.tsx");
vi.mock("../../../src/features/authentication/useSignup");
vi.mock("react-google-autocomplete/lib/usePlacesAutocompleteService");
vi.mock("react-hot-toast");

// helper funcs
async function prepareForm(type: string) {
  render(<SignupForm />, { wrapper: QueryClientProviderWrapper() });
  const { select: typeOfUserSelect } = getSelect("typeOfUser");
  await act(async () => {
    await user.selectOptions(typeOfUserSelect, type);
  });
}

describe("SignupForm", () => {
  describe("Display", () => {
    it("should render all fields on initial load", () => {
      const { container } = render(<SignupForm />, {
        wrapper: QueryClientProviderWrapper(),
      });
      expect(container).toBeTruthy();
      const { select: typeOfUserSelect } = getSelect("typeOfUser");
      expect(typeOfUserSelect).toBeTruthy();
    });
  });
  describe("Input Functionality", () => {
    it("should update typeOfUser", async () => {
      render(<SignupForm />, { wrapper: QueryClientProviderWrapper() });
      const { select: typeOfUserSelect } = getSelect("typeOfUser");
      await user.selectOptions(typeOfUserSelect, "Choose one");
      await user.tab();
      const { error: titleError } = getFieldError("typeOfUser");
      expect(titleError.textContent).toBe("This field is required");
      await act(async () => {
        await user.selectOptions(typeOfUserSelect, "Individual");
      });
      await waitFor(() => {
        expect(typeOfUserSelect.value).toBe("individual");
      });
    });

    describe("Individual", () => {
      it("should update firstName", async () => {
        await prepareForm("Individual");
        const { input: firstNameInput } = getInput("firstName");
        await user.type(firstNameInput, "Edwin");
        await waitFor(() => {
          expect(firstNameInput.value).toBe("Edwin");
        });
        await user.clear(firstNameInput);
        await user.tab();
        const { error: firstNameError } = getFieldError("firstName");
        expect(firstNameError.textContent).toBe("First Name is required");
      });
      it("should update lastName", async () => {
        await prepareForm("Individual");
        const { input: lastNameInput } = getInput("lastName");
        await user.type(lastNameInput, "Martinez");
        await waitFor(() => {
          expect(lastNameInput.value).toBe("Martinez");
        });
        await user.clear(lastNameInput);
        await user.tab();
        const { error: lastNameError } = getFieldError("lastName");
        expect(lastNameError.textContent).toBe("Last Name is required");
      });
      it("should update phone", async () => {
        await prepareForm("Individual");
        const { input: phoneInput } = getInput("phone");
        await user.type(phoneInput, "8454443333");
        await waitFor(() => {
          expect(phoneInput.value).toBe("8454443333");
        });
        await user.clear(phoneInput);
        await user.tab();
        const { error: phoneError } = getFieldError("phone");
        expect(phoneError.textContent).toBe("Phone is required");
      });

      it("should update address", async () => {
        await prepareForm("Individual");
        const { input: addressInput } = getInput("address");
        await user.type(addressInput, "123 Main Street");
        await waitFor(() => {
          expect(addressInput.value).toBe("123 Main Street");
        });
        await user.clear(addressInput);
        await user.tab();
        const { error: addressError } = getFieldError("address");
        expect(addressError.textContent).toBe("Address is required");
      });
      it("should update website", async () => {
        await prepareForm("Individual");
        const { input: websiteInput } = getInput("website");
        await user.type(websiteInput, "www.example.com");
        await waitFor(() => {
          expect(websiteInput.value).toBe("www.example.com");
        });
      });
      it("should update email", async () => {
        await prepareForm("Individual");
        const { input: emailInput } = getInput("email");
        await user.type(emailInput, "test@gmailcom");
        await waitFor(() => {
          expect(emailInput.value).toBe("test@gmailcom");
        });
        await user.clear(emailInput);
        await user.tab();
        const { error: emailError } = getFieldError("email");
        expect(emailError.textContent).toBe("Email is required");
      });
      it("should update password", async () => {
        await prepareForm("Individual");
        const { input: passwordInput } = getInput("password");
        await user.type(passwordInput, "password");
        await waitFor(() => {
          expect(passwordInput.value).toBe("password");
        });
        await user.clear(passwordInput);
        await user.tab();
        const { error: passwordError } = getFieldError("password");
        expect(passwordError.textContent).toBe("Password is required");
      });
    });

    describe("Business", () => {
      it("should update fullName", async () => {
        await prepareForm("Business");
        const { input: fullNameInput } = getInput("fullName");
        await user.type(fullNameInput, "Test Bizness");
        await waitFor(() => {
          expect(fullNameInput.value).toBe("Test Bizness");
        });
        await user.clear(fullNameInput);
        await user.tab();
        const { error: fullNameError } = getFieldError("fullName");
        expect(fullNameError.textContent).toBe("Business Name is required");
      });

      it("should update address", async () => {
        await prepareForm("Business");
        const { input: addressInput } = getInput("address");
        await user.type(addressInput, "123 Main Street");
        await waitFor(() => {
          expect(addressInput.value).toBe("123 Main Street");
        });
        await user.clear(addressInput);
        await user.tab();
        const { error: addressError } = getFieldError("address");
        expect(addressError.textContent).toBe("Address is required");
      });
      it("should update phone", async () => {
        await prepareForm("Business");
        const { input: phoneInput } = getInput("phone");
        await user.type(phoneInput, "8454443333");
        await waitFor(() => {
          expect(phoneInput.value).toBe("8454443333");
        });
        await user.clear(phoneInput);
        await user.tab();
        const { error: phoneError } = getFieldError("phone");
        expect(phoneError.textContent).toBe("Phone is required");
      });
      it("should update website", async () => {
        await prepareForm("Business");
        const { input: websiteInput } = getInput("website");
        await user.type(websiteInput, "www.example.com");
        await waitFor(() => {
          expect(websiteInput.value).toBe("www.example.com");
        });
      });
    });

    describe("Organization", () => {
      it("should update fullName", async () => {
        await prepareForm("Organization");
        const { input: fullNameInput } = getInput("fullName");
        await user.type(fullNameInput, "DWM");
        await waitFor(() => {
          expect(fullNameInput.value).toBe("DWM");
        });
        await user.clear(fullNameInput);
        await user.tab();
        const { error: fullNameError } = getFieldError("fullName");
        expect(fullNameError.textContent).toBe("Organization Name is required");
      });

      it("should update address", async () => {
        await prepareForm("Organization");
        const { input: addressInput } = getInput("address");
        await user.type(addressInput, "123 Main Street");
        await waitFor(() => {
          expect(addressInput.value).toBe("123 Main Street");
        });
        await user.clear(addressInput);
        await user.tab();
        const { error: addressError } = getFieldError("address");
        expect(addressError.textContent).toBe("Address is required");
      });
      it("should update phone", async () => {
        await prepareForm("Organization");
        const { input: phoneInput } = getInput("phone");
        await user.type(phoneInput, "8454443333");
        await waitFor(() => {
          expect(phoneInput.value).toBe("8454443333");
        });
        await user.clear(phoneInput);
        await user.tab();
        const { error: phoneError } = getFieldError("phone");
        expect(phoneError.textContent).toBe("Phone is required");
      });
      it("should update website", async () => {
        await prepareForm("Organization");
        const { input: websiteInput } = getInput("website");
        await user.type(websiteInput, "www.example.com");
        await waitFor(() => {
          expect(websiteInput.value).toBe("www.example.com");
        });
      });
    });
  });

  describe("Submit the form", () => {
    const signupMock = vi.fn();
    const setBottomSlideInTypeSpy = vi.fn();
    const setIsOpenBottomSlideInSpy = vi.fn();
    const getPlacePredictionsMock = vi.fn();
    const getDetailsMock = vi.fn();
    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        setBottomSlideInType: setBottomSlideInTypeSpy,
        setIsOpenBottomSlideIn: setIsOpenBottomSlideInSpy,
      }));
      vi.mocked(useSignup).mockImplementation(() => {
        return {
          signup: signupMock,
          signupError: null,
        };
      });
      vi.mocked(usePlacesService).mockImplementation(() => {
        return {
          placesService: {
            findPlaceFromPhoneNumber: vi.fn(),
            findPlaceFromQuery: vi.fn(),
            getDetails: getDetailsMock,
            nearbySearch: vi.fn(),
            textSearch: vi.fn(),
          },
          autocompleteSessionToken: "",
          placesAutocompleteService: {
            getPlacePredictions: vi.fn(),
            getQueryPredictions: vi.fn(),
          },

          placePredictions: placePredictionsArr,
          isPlacePredictionsLoading: false,
          getPlacePredictions: getPlacePredictionsMock.mockImplementation(
            () => {
              return placePredictionsArr;
            }
          ),
          queryPredictions: [],
          isQueryPredictionsLoading: false,
          getQueryPredictions: vi.fn(),
          refreshSessionToken: vi.fn(),
        };
      });
    });
    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should call signup with success", async () => {
      // assemble
      await prepareForm("Business");
      const { input: fullNameInput } = getInput("fullName");
      await user.type(fullNameInput, "Test Bizness");
      const { input: addressInput } = getInput("address");
      await act(async () => {
        await user.type(addressInput, "754 Broadway, Newburgh");
      });
      const { input: phoneInput } = getInput("phone");
      await user.type(phoneInput, "8454013350");
      const { input: websiteInput } = getInput("website");
      await user.type(websiteInput, "http://www.cnn.com");
      const { input: emailInput } = getInput("email");
      await user.type(emailInput, "me@gmail.com");
      const { input: passwordInput } = getInput("password");
      await user.type(passwordInput, "password");
      const { submit } = getActionButtons();
      await waitFor(async () => {
        await expect(getAddressResults().container).toBeTruthy();
      });
      await act(async () => {
        const addressResultItem = getAddressResults().getItem(0);
        await user.click(addressResultItem!);
        getDetailsMock.mock.calls[0][1](placeDetailsCallbackArg);
      });
      await waitFor(async () => {
        expect(submit).toBeTruthy();
      });
      // act
      await act(async () => {
        screen.debug(undefined, Infinity);
        await user.click(submit);
      });

      // assert
      // trigger the onSuccess callback
      await act(async () => {
        await signupMock.mock.calls[0][1].onSuccess(signupSubmitWithSuccess);
      });

      await waitFor(async () => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it("should call signup with error", async () => {
      // assemble
      await prepareForm("Business");
      const { input: fullNameInput } = getInput("fullName");
      await user.type(fullNameInput, "Test Bizness");
      const { input: addressInput } = getInput("address");
      await act(async () => {
        await user.type(addressInput, "754 Broadway, Newburgh");
      });
      const { input: phoneInput } = getInput("phone");
      await user.type(phoneInput, "8454013350");
      const { input: websiteInput } = getInput("website");
      await user.type(websiteInput, "http://www.cnn.com");
      const { input: emailInput } = getInput("email");
      await user.type(emailInput, "me@gmail.com");
      const { input: passwordInput } = getInput("password");
      await user.type(passwordInput, "password");
      const { submit } = getActionButtons();
      await waitFor(async () => {
        await expect(getAddressResults().container).toBeTruthy();
      });
      await act(async () => {
        const addressResultItem = getAddressResults().getItem(0);
        await user.click(addressResultItem!);
        getDetailsMock.mock.calls[0][1](placeDetailsCallbackArg);
      });
      await waitFor(async () => {
        expect(submit).toBeTruthy();
      });
      // act
      await act(async () => {
        screen.debug(undefined, Infinity);
        await user.click(submit);
      });

      // assert
      // trigger the onSuccess callback
      await act(async () => {
        await signupMock.mock.calls[0][1].onError({
          message: "error has occurred",
        });
      });

      await waitFor(async () => {
        expect(toast.success).not.toHaveBeenCalled();
      });
    });
  });
});
