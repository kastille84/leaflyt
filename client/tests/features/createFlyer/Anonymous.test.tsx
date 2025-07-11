import { act, render, screen, waitFor } from "@testing-library/react";
// import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Anonymous from "../../../src/features/createFlyer/Anonymous";
import { QueryClientProviderWrapper } from "../../test-utils";
import { resultInfo } from "../../fixtures/cloudinary/responses";
import useCreateUnregisteredFlyer from "../../../src/features/createFlyer/useCreateUnregisteredFlyer";
import toast from "react-hot-toast";

const user = userEvent.setup();

vi.mock("../../../src/features/createFlyer/useCreateUnregisteredFlyer");
vi.mock("react-hot-toast");

function getInput(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    input: Container.querySelector("input") as HTMLInputElement,
  };
}

function getSelect(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    select: Container.querySelector("select") as HTMLSelectElement,
  };
}

function getQuill() {
  const Container = screen.getByTestId("content-container");
  return {
    container: Container,
    label: Container.querySelector("label") as HTMLLabelElement,
    quill: Container.querySelector(".ql-editor") as HTMLDivElement,
  };
}

function getActionButtons() {
  const Container = screen.getByTestId("form-button-container");
  return {
    container: Container,
    submit: Container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement,
    cancel: Container.querySelector(
      'button[type="button"]'
    ) as HTMLButtonElement,
  };
}

function getFieldError(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    container: Container,
    error: Container.querySelector(
      "[data-testid='field-error']"
    ) as HTMLDivElement,
  };
}

function getFileUpload(name: string) {
  const Container = screen.getByTestId(`${name}-container`);
  return {
    label: Container.querySelector("label") as HTMLLabelElement,
    input: Container.querySelector("input") as HTMLInputElement,
    button: Container.querySelector("button") as HTMLButtonElement,
  };
}

function getImagePreview() {
  return {
    imagePreview: screen.getByTestId("image-preview"),
  };
}
function getImagePreviewItem(idx: number) {
  const imagePreviewItem = screen.getByTestId(`image-preview-item-${idx}`);
  return {
    imagePreviewItem,
    deleteButton: imagePreviewItem.querySelector("[data-testid='delete']"),
  };
}

const createUploadWidgetSpy = vi.fn();
const openSpy = vi.fn();
const errorSpy = vi.fn();
const resultSpy = vi.fn();
// mocks
vi.stubGlobal("cloudinary", {
  createUploadWidget: createUploadWidgetSpy,
});

describe("Anonymous", () => {
  describe("Display", () => {
    it("should render all fields for Anonymous on initial load", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const anonymous = screen.getByTestId("anonymous-container");
      expect(anonymous).toBeTruthy();
      // title
      const { label: titleLabel, input: titleInput } = getInput("title");
      expect(titleLabel.textContent).toBe("Title");
      expect(titleInput).toBeTruthy();
      // category
      const { label: categoryLabel, select: categorySelect } =
        getSelect("category");
      expect(categoryLabel.textContent).toBe("Category");
      expect(categorySelect).toBeTruthy();
      // content
      const { label: contentLabel, quill: contentQuill } = getQuill();
      expect(contentLabel.textContent).toBe("Content");
      expect(contentQuill).toBeTruthy();
      //  file upload
      const { label: fileLabel, input: fileInput } = getInput("file");
      expect(fileLabel.textContent).toBe("File Upload");
      expect(fileInput).toBeTruthy();
      // tags
      const { label: tagsLabel, input: tagsInput } = getInput("tags");
      expect(tagsLabel.textContent).toBe("Tags");
      expect(tagsInput).toBeTruthy();
      // typeOfUser
      const { label: typeOfUserLabel, select: typeOfUserSelect } =
        getSelect("typeOfUser");
      expect(typeOfUserLabel.textContent).toBe("How do you want to post as?");
      expect(typeOfUserSelect).toBeTruthy();
      // cancel
      const { cancel } = getActionButtons();
      expect(cancel.textContent).toBe("Cancel");
      await act(async () => {
        await user.click(cancel);
      });
    });
  });
  describe("Input Functionality", () => {
    it("should update title", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const { input: titleInput } = getInput("title");
      // titleInput.value = "Hello";
      // titleInput.dispatchEvent(new Event("change"));
      // fireEvent.change(titleInput, { target: { value: "Hello" } });
      // fireEvent.input(titleInput, { target: { value: "Hello" } });
      await user.type(titleInput, "Hello");
      await waitFor(() => {
        expect(titleInput.value).toBe("Hello");
      });
      await user.clear(titleInput);
      await user.tab();
      const { error: titleError } = getFieldError("title");
      expect(titleError.textContent).toBe("Title is required");
    });
    it("should update category and subcategory", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const { select: categorySelect } = getSelect("category");
      await user.selectOptions(categorySelect, "Events & Activities");
      await waitFor(() => {
        expect(categorySelect.value).toBe("Events & Activities");
      });
      const { select: subcategorySelect } = getSelect("subcategory");
      await user.selectOptions(subcategorySelect, "Community Events");
      await waitFor(() => {
        expect(subcategorySelect.value).toBe("Community Events");
      });
      // test errors
      await user.selectOptions(subcategorySelect, "Choose a subcategory");
      await user.tab(); // onblur
      await waitFor(() => {
        const { error: subcategoryError } = getFieldError("subcategory");
        expect(subcategoryError.textContent).toBe("Subcategory is required");
      });
      await user.selectOptions(categorySelect, "Choose a category");
      await user.tab(); // onblur
      await waitFor(() => {
        const { error: categoryError } = getFieldError("category");
        expect(categoryError.textContent).toBe("Category is required");
      });
    });
    it("should update content", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const { quill: contentQuill } = getQuill();
      await user.type(contentQuill, "Hello");
      await waitFor(() => {
        expect(contentQuill.textContent).toBe("Hello");
      });
      await user.clear(contentQuill);
      const { submit } = getActionButtons();
      await user.click(submit);
      const { error: contentError } = getFieldError("content");
      expect(contentError.textContent).toBe("Content is required");
      await user.type(contentQuill, "Hello");
      await user.click(submit);
    });

    describe("Image Upload", () => {
      beforeEach(() => {
        // vi.useFakeTimers();
        createUploadWidgetSpy.mockImplementation(function () {
          return { open: openSpy.mockReturnValue(true) };
        });
      });
      afterEach(() => {
        vi.unstubAllGlobals();
        openSpy.mockReset();
        // vi.useRealTimers(); // Restore real timers
      });

      it("should update Image", async () => {
        // assemble

        // act
        render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
        const { input: fileInput, button: fileButton } = getFileUpload("file");
        await user.click(fileButton);
        await act(async () => {
          await createUploadWidgetSpy.mock.calls[0][1](null, {
            event: "success",
            info: resultInfo,
          });
        });
        // get Image Preview
        const { imagePreview } = getImagePreview();
        // get image Preview Item
        const { imagePreviewItem, deleteButton } = getImagePreviewItem(0);
        // advance time
        // await vi.advanceTimersByTimeAsync(7 * 60 * 1000);
        // act
        await user.click(deleteButton!);
        await waitFor(() => {
          expect(imagePreview).toBeTruthy();
        });
        await waitFor(() => {
          expect(imagePreviewItem).toBeTruthy();
        });
      });
    });

    it("should update tags", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const { input: tagsInput, container } = getInput("tags");
      await user.type(tagsInput, "hello");
      await user.keyboard("[Enter]");
      const tags = container.querySelectorAll("span");
      const foundTag = Array.from(tags).find(
        (tag) => tag.textContent === "hello"
      );
      await waitFor(() => {
        expect(foundTag).toBeTruthy();
      });
      const removeButton = foundTag?.parentElement?.querySelector("button");
      await act(async () => {
        await user.click(removeButton!);
      });

      await waitFor(() => {
        const { container: freshContainer } = getInput("tags");
        const freshTags = freshContainer.querySelectorAll("span");
        const freshFoundTag = Array.from(freshTags).find(
          (tag) => tag.textContent === "hello"
        );
        expect(freshFoundTag).toBeFalsy();
      });
    });

    describe("typeOfUser", () => {
      it("should update Anonymous", async () => {
        render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
        const { select: typeOfUserSelect } = getSelect("typeOfUser");
        await user.selectOptions(typeOfUserSelect, "Choose one");
        await user.tab();
        const { error: titleError } = getFieldError("typeOfUser");
        expect(titleError.textContent).toBe("This field is required");
        await user.selectOptions(typeOfUserSelect, "Anonymous");
        await waitFor(() => {
          expect(screen.getByTestId("attestation-container")).toBeTruthy();
        });
      });
      it("should updated individual", async () => {
        render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
        const { select: typeOfUserSelect } = getSelect("typeOfUser");
        await user.selectOptions(typeOfUserSelect, "Individual");
        // trigger errors on all fields
        const { submit } = getActionButtons();
        await user.click(submit);
        const { error: firstNameError } = getFieldError("firstName");
        expect(firstNameError.textContent).toBe("First Name is required");
        const { error: lastNameError } = getFieldError("lastName");
        expect(lastNameError.textContent).toBe("Last Name is required");
        const { error: emailError } = getFieldError("email");
        expect(emailError.textContent).toBe("Email is required");
        const { error: phoneError } = getFieldError("phone");
        expect(phoneError.textContent).toBe("Phone is required");

        // update fields
        const { input: firstNameInput } = getInput("firstName");
        await user.type(firstNameInput, "Edwin");
        await waitFor(() => {
          expect(firstNameInput.value).toBe("Edwin");
        });
        const { input: lastNameInput } = getInput("lastName");
        await user.type(lastNameInput, "Martinez");
        await waitFor(() => {
          expect(lastNameInput.value).toBe("Martinez");
        });
        const { input: emailInput } = getInput("email");
        await user.type(emailInput, "test@gmail.com");
        await waitFor(() => {
          expect(emailInput.value).toBe("test@gmail.com");
        });
        const { input: phoneInput } = getInput("phone");
        await user.type(phoneInput, "8454443333");
        await waitFor(() => {
          expect(phoneInput.value).toBe("8454443333");
        });
        const { input: websiteInput } = getInput("website");
        await user.type(websiteInput, "http://www.dwm.com");
        await waitFor(() => {
          expect(websiteInput.value).toBe("http://www.dwm.com");
        });
      });
      it("should update business", async () => {
        render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
        const { select: typeOfUserSelect } = getSelect("typeOfUser");
        await user.selectOptions(typeOfUserSelect, "Business");
        // trigger errors on all fields
        const { submit } = getActionButtons();
        await user.click(submit);
        const { error: businessNameError } = getFieldError("fullName");
        expect(businessNameError.textContent).toBe("Business Name is required");
        const { error: businessAddressError } = getFieldError("address");
        expect(businessAddressError.textContent).toBe("Address is required");
        const { error: businessEmailError } = getFieldError("email");
        expect(businessEmailError.textContent).toBe("Email is required");
        const { error: businessPhoneError } = getFieldError("phone");
        expect(businessPhoneError.textContent).toBe("Phone is required");

        // update fields
        const { input: businessNameInput } = getInput("fullName");
        await user.type(businessNameInput, "DWM");
        await waitFor(() => {
          expect(businessNameInput.value).toBe("DWM");
        });
        const { input: businessAddressInput } = getInput("address");
        await user.type(businessAddressInput, "123 Main Street");
        await waitFor(() => {
          expect(businessAddressInput.value).toBe("123 Main Street");
        });
        const { input: businessEmailInput } = getInput("email");
        await user.type(businessEmailInput, "test@gmail.com");
        await waitFor(() => {
          expect(businessEmailInput.value).toBe("test@gmail.com");
        });
        const { input: businessPhoneInput } = getInput("phone");
        await user.type(businessPhoneInput, "8454443333");
        await waitFor(() => {
          expect(businessPhoneInput.value).toBe("8454443333");
        });
      });

      it("should update organization", async () => {
        render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
        // trigger errors on all fields
        const { select: typeOfUserSelect } = getSelect("typeOfUser");
        await user.selectOptions(typeOfUserSelect, "Organization");
        const { submit } = getActionButtons();
        await user.click(submit);
        const { error: organizationNameError } = getFieldError("fullName");
        expect(organizationNameError.textContent).toBe(
          "Organization Name is required"
        );
        const { error: organizationAddressError } = getFieldError("address");
        expect(organizationAddressError.textContent).toBe(
          "Address is required"
        );
        const { error: organizationEmailError } = getFieldError("email");
        expect(organizationEmailError.textContent).toBe("Email is required");
        const { error: organizationPhoneError } = getFieldError("phone");
        expect(organizationPhoneError.textContent).toBe("Phone is required");

        // update fields
        const { input: organizationNameInput } = getInput("fullName");
        await user.type(organizationNameInput, "DWM");
        await waitFor(() => {
          expect(organizationNameInput.value).toBe("DWM");
        });
        const { input: organizationAddressInput } = getInput("address");
        await user.type(organizationAddressInput, "123 Main Street");
        await waitFor(() => {
          expect(organizationAddressInput.value).toBe("123 Main Street");
        });
        const { input: organizationEmailInput } = getInput("email");
        await user.type(organizationEmailInput, "test@gmail.com");
        await waitFor(() => {
          expect(organizationEmailInput.value).toBe("test@gmail.com");
        });
        const { input: organizationPhoneInput } = getInput("phone");
        await user.type(organizationPhoneInput, "8454443333");
        await waitFor(() => {
          expect(organizationPhoneInput.value).toBe("8454443333");
        });
      });
    });
  });
  describe("Submit the form", () => {
    const createFlyerSpy = vi.fn();

    beforeEach(() => {
      createUploadWidgetSpy.mockImplementation(function () {
        return { open: openSpy.mockReturnValue(true) };
      });
      vi.mocked(useCreateUnregisteredFlyer).mockImplementation(() => {
        return {
          createFlyer: createFlyerSpy,
          createFlyerError: null,
        };
      });
    });
    afterEach(() => {
      vi.unstubAllGlobals();
      openSpy.mockReset();
      // vi.clearAllMocks();
    });

    it("should submit the form and succeed", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const { input: titleInput } = getInput("title");
      await user.type(titleInput, "Hello");
      const { select: categorySelect } = getSelect("category");
      await user.selectOptions(categorySelect, "Events & Activities");
      const { select: subcategorySelect } = getSelect("subcategory");
      await user.selectOptions(subcategorySelect, "Community Events");
      const { quill: contentQuill } = getQuill();
      await user.type(contentQuill, "Hello Content");
      const { button: fileButton } = getFileUpload("file");
      await user.click(fileButton);
      await act(async () => {
        await createUploadWidgetSpy.mock.calls[0][1](null, {
          event: "success",
          info: resultInfo,
        });
      });
      const { input: tagsInput } = getInput("tags");
      await user.type(tagsInput, "hello-tag");
      await user.keyboard("[Enter]");
      const { select: typeOfUserSelect } = getSelect("typeOfUser");
      await user.selectOptions(typeOfUserSelect, "Business");
      const { input: businessNameInput } = getInput("fullName");
      await user.type(businessNameInput, "DWM");
      const { input: businessAddressInput } = getInput("address");
      await user.type(businessAddressInput, "123 Main Street");
      const { input: businessEmailInput } = getInput("email");
      await user.type(businessEmailInput, "test@gmail.com");
      const { input: businessPhoneInput } = getInput("phone");
      await user.type(businessPhoneInput, "8454443333");
      const { submit } = getActionButtons();
      await user.click(submit);
      await waitFor(() => {
        expect(createFlyerSpy).toHaveBeenCalled();
      });
      await act(async () => {
        // trigger toast success
        await createFlyerSpy.mock.calls[0][1].onSuccess();
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Flyer created!");
      });
    });

    it("should submit the form and fail", async () => {
      render(<Anonymous />, { wrapper: QueryClientProviderWrapper() });
      const { input: titleInput } = getInput("title");
      await user.type(titleInput, "Hello");
      const { select: categorySelect } = getSelect("category");
      await user.selectOptions(categorySelect, "Events & Activities");
      const { select: subcategorySelect } = getSelect("subcategory");
      await user.selectOptions(subcategorySelect, "Community Events");
      const { quill: contentQuill } = getQuill();
      await user.type(contentQuill, "Hello Content");
      const { button: fileButton } = getFileUpload("file");
      await user.click(fileButton);
      await act(async () => {
        await createUploadWidgetSpy.mock.calls[0][1](null, {
          event: "success",
          info: resultInfo,
        });
      });
      const { input: tagsInput } = getInput("tags");
      await user.type(tagsInput, "hello-tag");
      await user.keyboard("[Enter]");
      const { select: typeOfUserSelect } = getSelect("typeOfUser");
      await user.selectOptions(typeOfUserSelect, "Business");
      const { input: businessNameInput } = getInput("fullName");
      await user.type(businessNameInput, "DWM");
      const { input: businessAddressInput } = getInput("address");
      await user.type(businessAddressInput, "123 Main Street");
      const { input: businessEmailInput } = getInput("email");
      await user.type(businessEmailInput, "test@gmail.com");
      const { input: businessPhoneInput } = getInput("phone");
      await user.type(businessPhoneInput, "8454443333");
      const { submit } = getActionButtons();
      await user.click(submit);
      await waitFor(() => {
        expect(createFlyerSpy).toHaveBeenCalled();
      });
      await act(async () => {
        // trigger toast fail
        await createFlyerSpy.mock.calls[0][1].onError({
          message: "error has occurred",
        });
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });
});
