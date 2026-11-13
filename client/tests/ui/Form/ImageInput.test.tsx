import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";
import ImageInput from "../../../src/ui/Form/ImageInput";
import FormHarness from "./FormHarness";
import { getFileUpload } from "../../test-utils";
import { resultInfo } from "../../fixtures/cloudinary/responses";

vi.mock("react-hot-toast");

const open = vi.fn();
const close = vi.fn();
let widgetCallback: (error: any, result: any) => void;
const createUploadWidget = vi.fn((_options: any, cb: any) => {
  widgetCallback = cb;
  return { open, close };
});

function renderImageInput(
  onSubmit = vi.fn(),
  defaultValues?: Record<string, unknown>,
  level = 0,
) {
  return render(
    <FormHarness onSubmit={onSubmit} defaultValues={defaultValues}>
      {({ register, setValue, getValues, formState: { errors } }) => (
        <ImageInput
          register={register}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
          level={level}
        />
      )}
    </FormHarness>,
  );
}

describe("ImageInput", () => {
  beforeEach(() => {
    (window as any).cloudinary = { createUploadWidget };
  });
  afterEach(() => vi.clearAllMocks());

  it("should render an enabled upload button and initialise fileUrlArr", async () => {
    const onSubmit = vi.fn();
    renderImageInput(onSubmit);
    const { label, button } = getFileUpload("file");
    expect(label).toHaveTextContent("File Upload (10mb max)");
    expect(button).toBeEnabled();
    await userEvent.setup().click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0].fileUrlArr).toEqual([]);
  });

  it("should create the widget once with the level's options and open it", async () => {
    renderImageInput();
    const button = getFileUpload("file").button;
    const user = userEvent.setup();
    await user.click(button);
    await user.click(button);
    expect(createUploadWidget).toHaveBeenCalledTimes(1);
    expect(createUploadWidget.mock.calls[0][0]).toMatchObject({
      maxFiles: 1,
      multiple: false,
    });
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("should add the uploaded file to the form and close the widget on success", async () => {
    const onSubmit = vi.fn();
    renderImageInput(onSubmit);
    const user = userEvent.setup();
    await user.click(getFileUpload("file").button);
    widgetCallback(null, { event: "success", info: resultInfo });
    expect(close).toHaveBeenCalled();
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0].fileUrlArr).toEqual([resultInfo]);
  });

  it("should ignore non-success widget events", async () => {
    renderImageInput();
    const user = userEvent.setup();
    await user.click(getFileUpload("file").button);
    widgetCallback(null, { event: "queues-start" });
    expect(close).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should toast the error when the widget reports one", async () => {
    renderImageInput();
    await userEvent.setup().click(getFileUpload("file").button);
    widgetCallback({ statusText: "Upload failed" }, null);
    expect(toast.error).toHaveBeenCalledWith("Upload failed");
  });

  it("should disable the button once the file limit is reached", () => {
    renderImageInput(vi.fn(), { fileUrlArr: [resultInfo] });
    expect(getFileUpload("file").button).toBeDisabled();
  });

  it("should fail validation when more files than allowed are present", async () => {
    const onSubmit = vi.fn();
    renderImageInput(onSubmit, { fileUrlArr: [resultInfo, resultInfo] });
    await userEvent.setup().click(screen.getByText("submit"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
