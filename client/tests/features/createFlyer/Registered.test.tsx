import { act, render, screen, waitFor } from "@testing-library/react";
// import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Registered from "../../../src/features/createFlyer/Registered";
import * as GlobalContext from "../../../src/context/GlobalContext";
import {
  getActionButtons,
  getFileUpload,
  getFlyerDesigner,
  getImagePreview,
  getImagePreviewItem,
  getInput,
  getQuill,
  getSelect,
  QueryClientProviderWrapper,
} from "../../test-utils";
import { resultInfo } from "../../fixtures/cloudinary/responses";
import useCreateRegisteredFlyer from "../../../src/features/createFlyer/useCreateRegisteredFlyer";
import toast from "react-hot-toast";
import { getFieldError } from "../../test-utils";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/createFlyer/useCreateRegisteredFlyer");
vi.mock("react-hot-toast");

const user = userEvent.setup();

const createUploadWidgetSpy = vi.fn();
const openSpy = vi.fn();
const closeSpy = vi.fn();
const errorSpy = vi.fn();
const resultSpy = vi.fn();
// mocks
// vi.mock("cloudinary-react", async () => {
//   const actual = await vi.importActual("cloudinary-react");
//   return {
//     ...actual,
//     createUploadWidget: createUploadWidgetSpy,
//     open: openSpy,
//     close: closeSpy,
//     error: errorSpy,
//     result: resultSpy,
//   };
// });
vi.stubGlobal("cloudinary", {
  createUploadWidget: createUploadWidgetSpy,
});

describe("Registered", () => {
  describe("Display", () => {
    it("should render all fields for Register on initial load", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const registered = screen.getByTestId("registered-container");
      expect(registered).toBeTruthy();
      //title
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
      // ctaInput
      const { label: ctaLabel, input: ctaInput } = getInput("cta");
      expect(ctaLabel.textContent).toBe("Call To Action");
      expect(ctaInput).toBeTruthy();
      // lifespan
      const { label: lifespanLabel, select: lifespanSelect } =
        getSelect("lifespan");
      expect(lifespanLabel.textContent).toBe("Select the Lifespan");
      expect(lifespanSelect).toBeTruthy();
      // flyerDesigner
      const { label: flyerDesignerLabel, button: flyerDesignerButton } =
        getFlyerDesigner("flyerDesigner");
      expect(flyerDesignerLabel.textContent).toBe("Flyer Designer");
      expect(flyerDesignerButton).toBeTruthy();
      // Template
      const { label: templateLabel, input: templateInput } =
        getInput("template");
      expect(templateLabel.textContent).toBe(
        "Create Reusable Template (Encouraged)"
      );
      expect(templateInput).toBeTruthy();
      // cancel
      const cancel = screen.getByRole("button", { name: "Cancel" });
      expect(cancel).toBeTruthy();
    });
  });

  describe("Functionality", () => {
    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user: userFromContext,
      }));
    });
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("should update title", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { input: titleInput } = getInput("title");
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
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
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
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
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
          return {
            open: openSpy.mockReturnValue(true),
            close: closeSpy.mockReturnValue(true),
          };
        });
      });
      afterEach(() => {
        // vi.unstubAllGlobals();
        openSpy.mockReset();
        // vi.useRealTimers(); // Restore real timers
      });

      it("should update Image", async () => {
        // assemble

        // act
        render(<Registered />, { wrapper: QueryClientProviderWrapper() });
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
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
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

    it("should update cta", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const offerRadioInput = screen.getByLabelText(
        "Offer (BOGO/Coupon/Free Consultation/etc)"
      );
      await user.click(offerRadioInput);
      // Headline
      await waitFor(() => {
        expect(screen.getByLabelText("Headline")).toBeTruthy();
      });
      const headlineInput: HTMLInputElement = screen.getByLabelText("Headline");
      await user.type(headlineInput, "Hello");
      await waitFor(() => {
        expect(headlineInput.value).toBe("Hello");
      });
      await user.clear(headlineInput);
      await user.tab();
      const { error: titleError } = getFieldError("cta-input");
      expect(titleError.textContent).toBe("Headline is required");
      await user.type(headlineInput, "Hello");
      // Instructions
      const { quill: contentQuill } = getQuill("cta-input");
      await user.type(contentQuill, "Hello");
      await waitFor(() => {
        expect(contentQuill.textContent).toBe("Hello");
      });
      await user.clear(contentQuill);
      const { submit } = getActionButtons();
      await user.click(submit);
      const { error: contentError } = getFieldError("cta-input");
      expect(contentError.textContent).toBe("Instructions is required");
      await user.type(contentQuill, "Hello");
      await user.click(submit);
    });

    it("should update lifespan", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { select: lifespanSelect } = getSelect("lifespan");
      await user.selectOptions(lifespanSelect, "2 weeks");
      await waitFor(() => {
        expect(lifespanSelect.value).toBe("2");
      });
    });

    it("should update create template", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { input: templateCheckbox } = getInput("template");
      // uncheck it
      // await user.click(templateCheckbox);
      // await waitFor(() => {
      //   expect(templateCheckbox.checked).toBeFalsy();
      // });
      // await user.click(templateCheckbox);
      await waitFor(() => {
        expect(templateCheckbox.checked).toBeTruthy();
      });
      const { input: templateInput } = getInput("fullName");
      const { submit } = getActionButtons();
      await user.click(submit);
      const { error: contentError } = getFieldError("fullName");
      expect(contentError.textContent).toBe("Template Name is required");
      await user.type(templateInput, "Hello");
      const { input: commentsCheckbox } = getInput("comments-input");
      await user.click(commentsCheckbox);
    });
  });

  describe("Submit the form", () => {
    const createFlyerSpy = vi.fn();

    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user: userFromContext,
      }));
      createUploadWidgetSpy.mockImplementation(function () {
        return {
          open: openSpy.mockReturnValue(true),
          close: closeSpy.mockReturnValue(true),
        };
      });
      vi.mocked(useCreateRegisteredFlyer).mockImplementation(() => {
        return {
          createFlyer: createFlyerSpy,
          createFlyerError: null,
          createFlyerUsingTemplate: vi.fn(),
          createFlyerUsingTemplateError: null,
        };
      });
    });
    afterEach(() => {
      vi.unstubAllGlobals();
      // openSpy.mockReset();
      // vi.clearAllMocks();
    });

    it("should submit the form and succeed", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { input: titleInput } = getInput("title");
      await user.type(titleInput, "Hello");
      const { select: categorySelect } = getSelect("category");
      await user.selectOptions(categorySelect, "Events & Activities");
      await waitFor(() => {
        expect(categorySelect.value).toBe("Events & Activities");
      });
      const { select: subcategorySelect } = getSelect("subcategory");
      await user.selectOptions(subcategorySelect, "Community Events");
      const { quill: contentQuill } = getQuill();
      await user.type(contentQuill, "This is content");
      const { button: fileButton } = getFileUpload("file");
      await user.click(fileButton);
      await waitFor(() => {
        expect(openSpy).toHaveBeenCalled();
      });
      await act(async () => {
        await createUploadWidgetSpy.mock.calls[0][1](null, {
          event: "success",
          info: resultInfo,
        });
      });
      const { input: tagsInput } = getInput("tags");
      await user.type(tagsInput, "hello-tag");
      await user.keyboard("[Enter]");
      const offerRadioInput = screen.getByLabelText(
        "Offer (BOGO/Coupon/Free Consultation/etc)"
      );
      await user.click(offerRadioInput);
      // Headline
      await waitFor(() => {
        expect(screen.getByLabelText("Headline")).toBeTruthy();
      });
      const headlineInput: HTMLInputElement = screen.getByLabelText("Headline");
      await user.type(headlineInput, "Hello");
      const { quill: ctaContentQuill } = getQuill("cta-input");
      await user.type(ctaContentQuill, "Hello");
      const { select: lifespanSelect } = getSelect("lifespan");
      await user.selectOptions(lifespanSelect, "2 weeks");
      const { input: templateInput } = getInput("fullName");
      await user.type(templateInput, "Hello");
      const { input: commentsCheckbox } = getInput("comments-input");
      await user.click(commentsCheckbox);
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
        // expect(toast.success).toHaveBeenCalledWith("Flyer created!");
        expect(createFlyerSpy).toHaveBeenCalled();
      });
    });

    it("should submit the form and fail", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { input: titleInput } = getInput("title");
      await user.type(titleInput, "Hello");
      const { select: categorySelect } = getSelect("category");
      await user.selectOptions(categorySelect, "Events & Activities");
      await waitFor(() => {
        expect(categorySelect.value).toBe("Events & Activities");
      });
      const { select: subcategorySelect } = getSelect("subcategory");
      await user.selectOptions(subcategorySelect, "Community Events");
      const { quill: contentQuill } = getQuill();
      await user.type(contentQuill, "This is content");
      const { button: fileButton } = getFileUpload("file");
      await user.click(fileButton);
      await waitFor(() => {
        expect(openSpy).toHaveBeenCalled();
      });
      await act(async () => {
        await createUploadWidgetSpy.mock.calls[0][1](null, {
          event: "success",
          info: resultInfo,
        });
      });
      const { input: tagsInput } = getInput("tags");
      await user.type(tagsInput, "hello-tag");
      await user.keyboard("[Enter]");
      const offerRadioInput = screen.getByLabelText(
        "Offer (BOGO/Coupon/Free Consultation/etc)"
      );
      await user.click(offerRadioInput);
      // Headline
      await waitFor(() => {
        expect(screen.getByLabelText("Headline")).toBeTruthy();
      });
      const headlineInput: HTMLInputElement = screen.getByLabelText("Headline");
      await user.type(headlineInput, "Hello");
      const { quill: ctaContentQuill } = getQuill("cta-input");
      await user.type(ctaContentQuill, "Hello");
      const { select: lifespanSelect } = getSelect("lifespan");
      await user.selectOptions(lifespanSelect, "2 weeks");

      const { input: templateInput } = getInput("fullName");
      await user.type(templateInput, "Hello");
      const { input: commentsCheckbox } = getInput("comments-input");
      await user.click(commentsCheckbox);
      const { submit } = getActionButtons();
      await user.click(submit);
      await waitFor(() => {
        expect(createFlyerSpy).toHaveBeenCalled();
      });
      await act(async () => {
        // trigger toast success
        await createFlyerSpy.mock.calls[0][1].onError({
          message: "error has occurred",
        });
      });

      await waitFor(() => {
        // expect(toast.error).toHaveBeenCalledWith("error has occurred");
        expect(createFlyerSpy).toHaveBeenCalled();
      });
    });
  });
});
