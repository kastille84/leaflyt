import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PhoneInput from "../../../src/ui/Form/PhoneInput";
import WebsiteInput from "../../../src/ui/Form/WebsiteInput";
import FormHarness from "./FormHarness";
import { getInput } from "../../test-utils";

describe("PhoneInput", () => {
  it("should render an optional tel input and submit its value", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <PhoneInput
            register={register}
            registerName="p.phone"
            errors={errors}
          />
        )}
      </FormHarness>
    );
    const { label, input } = getInput("phone");
    expect(label).toHaveTextContent("Phone (Optional)");
    expect(input).toHaveAttribute("type", "tel");
    const user = userEvent.setup();
    await user.type(input, "5551234");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ p: { phone: "5551234" } });
  });

  it("should flag the label when the field has an error", () => {
    render(
      <FormHarness>
        {({ register }) => (
          <PhoneInput
            register={register}
            registerName="phone"
            errors={{ phone: { type: "x", message: "bad" } }}
          />
        )}
      </FormHarness>
    );
    expect(getInput("phone").label).toHaveClass("error");
  });
});

describe("WebsiteInput", () => {
  it("should render an optional url input with a placeholder", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <WebsiteInput
            register={register}
            registerName="site"
            errors={errors}
          />
        )}
      </FormHarness>
    );
    const { label, input } = getInput("website");
    expect(label).toHaveTextContent("Website (Optional)");
    expect(input).toHaveAttribute("type", "url");
    expect(input).toHaveAttribute("placeholder", "https://www.leaflit.com");
    const user = userEvent.setup();
    await user.type(input, "https://a.com");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ site: "https://a.com" });
  });

  it("should flag the label when the field has an error", () => {
    render(
      <FormHarness>
        {({ register }) => (
          <WebsiteInput
            register={register}
            registerName="site"
            errors={{ site: { type: "x", message: "bad" } }}
          />
        )}
      </FormHarness>
    );
    expect(getInput("website").label).toHaveClass("error");
  });
});
