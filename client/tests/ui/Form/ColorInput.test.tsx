import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ColorInput from "../../../src/ui/Form/ColorInput";
import FormHarness from "./FormHarness";

// the real picker only reports onChangeComplete on pointer release, so stub
// it with a button that fires both callbacks
vi.mock("react-color-palette", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-color-palette")>()),
  ColorPicker: ({ onChange, onChangeComplete }: any) => (
    <button
      type="button"
      onClick={() => {
        const color = { hex: "#00ff00", rgb: {}, hsv: {} };
        onChange(color);
        onChangeComplete(color);
      }}
    >
      pick green
    </button>
  ),
}));

function renderColor(
  section: string,
  defaultValues?: Record<string, any>,
  onSubmit = vi.fn(),
) {
  render(
    <FormHarness onSubmit={onSubmit} defaultValues={defaultValues}>
      {({ register, setValue, getValues }) => (
        <ColorInput
          register={register}
          setValue={setValue}
          getValues={getValues}
          selectedSection={section}
        />
      )}
    </FormHarness>,
  );
}

describe("ColorInput", () => {
  it("should default to black when the field has no value", () => {
    renderColor("background");
    expect(screen.getByText("Select Color")).toBeInTheDocument();
    expect(screen.getByText("#000000")).toBeInTheDocument();
  });

  it("should read nested section names and start from their stored colour", () => {
    renderColor("header_color", { header: { color: "#ff0000" } });
    expect(screen.getByText("#ff0000")).toBeInTheDocument();
  });

  it("should save the chosen hex to a flat field", async () => {
    const onSubmit = vi.fn();
    renderColor("background", undefined, onSubmit);
    const user = userEvent.setup();
    await user.click(screen.getByText("pick green"));
    expect(screen.getByText("#00ff00")).toBeInTheDocument();
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ background: "#00ff00" });
  });

  it("should save the chosen hex to a nested field", async () => {
    const onSubmit = vi.fn();
    renderColor("header_color", undefined, onSubmit);
    const user = userEvent.setup();
    await user.click(screen.getByText("pick green"));
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ header: { color: "#00ff00" } });
  });
});
