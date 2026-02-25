import { act, render, screen, waitFor } from "@testing-library/react";
// import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Registered from "../../../src/features/createFlyer/Registered";
import * as GlobalContext from "../../../src/context/GlobalContext";
import {
  getActionButtons,
  getFileUpload,
  getFlyerDesigner,
  getInput,
  getQuill,
  getSelect,
  QueryClientProviderWrapper,
} from "../../test-utils";
import { resultInfo } from "../../fixtures/cloudinary/responses";
import useRegisteredFlyer from "../../../src/features/createFlyer/useRegisteredFlyer";

import { getFieldError } from "../../test-utils";
// import { useForm } from "react-hook-form";

// fixtures
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { userFromContext } from "../../fixtures/authentication/login";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";
import { templateMock } from "../../fixtures/template/template";

// mocks
vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/features/createFlyer/useRegisteredFlyer");
vi.mock("react-hot-toast");
// vi.mock("react-hook-form", async () => {
//   const actual = await vi.importActual("react-hook-form");
//   return {
//     ...actual,
//     useForm: vi.fn(),
//   };
// });

const user = userEvent.setup();

const createUploadWidgetSpy = vi.fn();
const openSpy = vi.fn();
const closeSpy = vi.fn();
// const categoryWatchMock = vi.fn();
// const subcategoryWatchMock = vi.fn();
// const fileUrlArrWatchMock = vi.fn();
// const templateWatchMock = vi.fn();
// const lifespanWatchMock = vi.fn();
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
  // beforeEach(() => {
  //   vi.mocked(useForm).mockImplementation(() => {
  //     return {
  //       register: vi.fn(),
  //       handleSubmit: vi.fn(),
  //       formState: { errors: {} },
  //       getValues: vi.fn(),
  //       setValue: vi.fn(),
  //       control: {},
  //       watch: vi.fn((args) => {
  //         // if (args === "fileUrlArr") {
  //         //   return fileUrlArrWatchMock.mockReturnValue(
  //         //     mockCreatedFlyer.fileUrlArr
  //         //   );
  //         // } else return useFormMock.watch();
  //         switch (args) {
  //           case "category":
  //             // return categoryWatchMock.mockReturnValue("Services"); // "Services";
  //             return "Services";
  //           case "subcategory":
  //             return subcategoryWatchMock.mockReturnValue(
  //               "Professional Services"
  //             ); // "Professional Services";
  //           case "fileUrlArr":
  //             // return fileUrlArrWatchMock.mockReturnValue(
  //             //   mockCreatedFlyer.fileUrlArr
  //             // );
  //             return mockCreatedFlyer.fileUrlArr;
  //           case "template":
  //             return templateWatchMock.mockReturnValue(false); // false;
  //           case "lifespan":
  //             return lifespanWatchMock.mockReturnValue(2); // 2;
  //           default:
  //             return "";
  //         }
  //       }),
  //     };
  //   });
  // });
  // afterEach(() => {
  //   vi.clearAllMocks();
  // });

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
      //  file upload Button
      const uploadButton = screen.getByRole("button", {
        name: "Open Assets Uploader",
      });
      expect(uploadButton).toBeTruthy();
      expect(uploadButton.textContent).toBe("Open Assets Uploader");
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
        "Create Reusable Template (Encouraged)",
      );
      expect(templateInput).toBeTruthy();
      // cancel
      const cancel = screen.getByRole("button", { name: "Cancel" });
      expect(cancel).toBeTruthy();
    });
  });

  describe("Functionality", () => {
    let bottomSlideInTypeMock = vi.fn();
    let setShowCloseslideInModalMock = vi.fn();
    beforeEach(() => {
      vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
        ...mockUseGlobalContextReturnObj,
        user: userFromContext,
        setBottomSlideInType: bottomSlideInTypeMock,
        setShowCloseSlideInModal: setShowCloseslideInModalMock,
      }));
    });
    afterEach(() => {
      vi.clearAllMocks();
    });
    it("should close the slidein", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { cancel } = getActionButtons();
      await user.click(cancel);
      await waitFor(() => {
        expect(setShowCloseslideInModalMock).toHaveBeenCalledWith(true);
      });
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

    // describe("Image Upload", () => {
    //   beforeEach(() => {
    //     // vi.useFakeTimers();
    //     createUploadWidgetSpy.mockImplementation(function () {
    //       return {
    //         open: openSpy.mockReturnValue(true),
    //         close: closeSpy.mockReturnValue(true),
    //       };
    //     });
    //   });
    //   afterEach(() => {
    //     // vi.unstubAllGlobals();
    //     openSpy.mockReset();
    //     // vi.useRealTimers(); // Restore real timers
    //   });

    //   it("should update Image", async () => {
    //     // assemble

    //     // act
    //     render(<Registered />, { wrapper: QueryClientProviderWrapper() });
    //     const { input: fileInput, button: fileButton } = getFileUpload("file");
    //     await user.click(fileButton);
    //     await act(async () => {
    //       await createUploadWidgetSpy.mock.calls[0][1](null, {
    //         event: "success",
    //         info: resultInfo,
    //       });
    //     });
    //     // get Image Preview
    //     const { imagePreview } = getImagePreview();
    //     // get image Preview Item
    //     const { imagePreviewItem, deleteButton } = getImagePreviewItem(0);
    //     // advance time
    //     // await vi.advanceTimersByTimeAsync(7 * 60 * 1000);
    //     // act
    //     await user.click(deleteButton!);
    //     await waitFor(() => {
    //       expect(imagePreview).toBeTruthy();
    //     });
    //     await waitFor(() => {
    //       expect(imagePreviewItem).toBeTruthy();
    //     });
    //   });
    // });

    describe("Asset Uploader", () => {
      it("should open Asset Uploader", async () => {
        render(<Registered />, { wrapper: QueryClientProviderWrapper() });
        const uploadButton = screen.getByRole("button", {
          name: "Open Assets Uploader",
        });
        expect(uploadButton).toBeTruthy();
        act(() => {
          user.click(uploadButton);
        });
        await waitFor(() => {
          expect(bottomSlideInTypeMock).toHaveBeenCalled();
        });
      });

      it("should show uploaded assets", () => {
        render(<Registered flyerToEdit={mockCreatedFlyer} />, {
          wrapper: QueryClientProviderWrapper(),
        });
        const assetsPreviewList = screen.getByTestId(
          "container-assets-preview-list",
        );
        expect(assetsPreviewList).toBeTruthy();
      });
    });

    it("should update tags", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const { input: tagsInput, container } = getInput("tags");
      await user.type(tagsInput, "hello");
      await user.keyboard("[Enter]");
      const tags = container.querySelectorAll("span");
      const foundTag = Array.from(tags).find(
        (tag) => tag.textContent === "hello",
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
          (tag) => tag.textContent === "hello",
        );
        expect(freshFoundTag).toBeFalsy();
      });
    });

    it("should update cta", async () => {
      render(<Registered />, { wrapper: QueryClientProviderWrapper() });
      const offerRadioInput = screen.getByLabelText(
        "Offer (BOGO/Coupon/Free Consultation/etc)",
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
    const editFlyerSpy = vi.fn();
    const editTemplateSpy = vi.fn();
    const createTemplateFnSpy = vi.fn();

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
      vi.mocked(useRegisteredFlyer).mockImplementation(() => {
        return {
          createFlyer: createFlyerSpy,
          createFlyerError: null,
          createFlyerUsingTemplate: vi.fn(),
          createFlyerUsingTemplateError: null,
          editFlyer: editFlyerSpy,
          editFlyerError: null,
          editTemplate: editTemplateSpy,
          createTemplateFn: createTemplateFnSpy,
          createTemplateFnError: null,
        };
      });
    });
    afterEach(() => {
      vi.unstubAllGlobals();
      // openSpy.mockReset();
      // vi.clearAllMocks();
    });

    describe("create new flyer", () => {
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
        // const { button: fileButton } = getFileUpload("file");
        // await user.click(fileButton);
        // await waitFor(() => {
        //   expect(openSpy).toHaveBeenCalled();
        // });
        // await act(async () => {
        //   await createUploadWidgetSpy.mock.calls[0][1](null, {
        //     event: "success",
        //     info: resultInfo,
        //   });
        // });
        const { input: tagsInput } = getInput("tags");
        await user.type(tagsInput, "hello-tag");
        await user.keyboard("[Enter]");
        const offerRadioInput = screen.getByLabelText(
          "Offer (BOGO/Coupon/Free Consultation/etc)",
        );
        await user.click(offerRadioInput);
        // Headline
        await waitFor(() => {
          expect(screen.getByLabelText("Headline")).toBeTruthy();
        });
        const headlineInput: HTMLInputElement =
          screen.getByLabelText("Headline");
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
        // const { button: fileButton } = getFileUpload("file");
        // await user.click(fileButton);
        // await waitFor(() => {
        //   expect(openSpy).toHaveBeenCalled();
        // });
        // await act(async () => {
        //   await createUploadWidgetSpy.mock.calls[0][1](null, {
        //     event: "success",
        //     info: resultInfo,
        //   });
        // });
        const { input: tagsInput } = getInput("tags");
        await user.type(tagsInput, "hello-tag");
        await user.keyboard("[Enter]");
        const offerRadioInput = screen.getByLabelText(
          "Offer (BOGO/Coupon/Free Consultation/etc)",
        );
        await user.click(offerRadioInput);
        // Headline
        await waitFor(() => {
          expect(screen.getByLabelText("Headline")).toBeTruthy();
        });
        const headlineInput: HTMLInputElement =
          screen.getByLabelText("Headline");
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

    describe("edit flyer", () => {
      it("should submit the form and succeed", async () => {
        render(<Registered flyerToEdit={mockCreatedFlyer} type="edit" />, {
          wrapper: QueryClientProviderWrapper(),
        });
        const { input: titleInput } = getInput("title");
        await user.type(titleInput, "Hello");
        const { submit } = getActionButtons();
        await user.click(submit);
        await waitFor(() => {
          expect(editFlyerSpy).toHaveBeenCalled();
        });
        await act(async () => {
          // trigger toast success
          await editFlyerSpy.mock.calls[0][1].onSuccess();
        });
        await waitFor(() => {
          expect(editFlyerSpy).toHaveBeenCalled();
        });
      });
      it("should submit the form and fail", async () => {
        render(<Registered flyerToEdit={mockCreatedFlyer} type="edit" />, {
          wrapper: QueryClientProviderWrapper(),
        });
        const { input: titleInput } = getInput("title");
        await user.type(titleInput, "Hello");
        const { submit } = getActionButtons();
        await user.click(submit);
        await waitFor(() => {
          expect(editFlyerSpy).toHaveBeenCalled();
        });
        await act(async () => {
          // trigger toast success
          await editFlyerSpy.mock.calls[0][1].onError({
            message: "error has occurred",
          });
        });
        await waitFor(() => {
          // expect(toast.error).toHaveBeenCalledWith("error has occurred");
          expect(editFlyerSpy).toHaveBeenCalled();
        });
      });
    });
    describe("create template", () => {
      it("should submit the form and succeed", async () => {
        render(<Registered type="createTemplate" />, {
          wrapper: QueryClientProviderWrapper(),
        });
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
        const { input: tagsInput } = getInput("tags");
        await user.type(tagsInput, "hello-tag");
        await user.keyboard("[Enter]");
        const offerRadioInput = screen.getByLabelText(
          "Offer (BOGO/Coupon/Free Consultation/etc)",
        );
        await user.click(offerRadioInput);
        // Headline
        await waitFor(() => {
          expect(screen.getByLabelText("Headline")).toBeTruthy();
        });
        const headlineInput: HTMLInputElement =
          screen.getByLabelText("Headline");
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
          expect(createTemplateFnSpy).toHaveBeenCalled();
        });
        await act(async () => {
          // trigger toast success
          await createTemplateFnSpy.mock.calls[0][1].onSuccess({
            user: userFromContext,
          });
        });

        await waitFor(() => {
          // expect(toast.success).toHaveBeenCalledWith("Flyer created!");
          expect(createTemplateFnSpy).toHaveBeenCalled();
        });
      });
      it("should submit the form and fail", async () => {
        render(<Registered type="createTemplate" />, {
          wrapper: QueryClientProviderWrapper(),
        });
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
        const { input: tagsInput } = getInput("tags");
        await user.type(tagsInput, "hello-tag");
        await user.keyboard("[Enter]");
        const offerRadioInput = screen.getByLabelText(
          "Offer (BOGO/Coupon/Free Consultation/etc)",
        );
        await user.click(offerRadioInput);
        // Headline
        await waitFor(() => {
          expect(screen.getByLabelText("Headline")).toBeTruthy();
        });
        const headlineInput: HTMLInputElement =
          screen.getByLabelText("Headline");
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
          expect(createTemplateFnSpy).toHaveBeenCalled();
        });
        await act(async () => {
          // trigger toast success
          await createTemplateFnSpy.mock.calls[0][1].onError({
            message: "error has occurred",
          });
        });

        await waitFor(() => {
          // expect(toast.success).toHaveBeenCalledWith("Flyer created!");
          expect(createTemplateFnSpy).toHaveBeenCalled();
        });
      });
    });
    describe("edit template", () => {
      it("should submit the form and succeed", async () => {
        render(
          <Registered templateToEdit={templateMock} type="editTemplate" />,
          {
            wrapper: QueryClientProviderWrapper(),
          },
        );
        const { input: titleInput } = getInput("title");
        await user.type(titleInput, "Hello");
        const { submit } = getActionButtons();
        await user.click(submit);
        await waitFor(() => {
          expect(editTemplateSpy).toHaveBeenCalled();
        });
        await act(async () => {
          // trigger toast success
          await editTemplateSpy.mock.calls[0][1].onSuccess({
            user: userFromContext,
          });
        });
        await waitFor(() => {
          expect(editTemplateSpy).toHaveBeenCalled();
        });
      });
      it("should submit the form and fail", async () => {
        render(
          <Registered templateToEdit={templateMock} type="editTemplate" />,
          {
            wrapper: QueryClientProviderWrapper(),
          },
        );
        const { input: titleInput } = getInput("title");
        await user.type(titleInput, "Hello");
        const { submit } = getActionButtons();
        await user.click(submit);
        await waitFor(() => {
          expect(editTemplateSpy).toHaveBeenCalled();
        });
        await act(async () => {
          // trigger toast success
          await editTemplateSpy.mock.calls[0][1].onError({
            message: "error has occurred",
          });
        });
        await waitFor(() => {
          // expect(toast.error).toHaveBeenCalledWith("error has occurred");
          expect(editTemplateSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
