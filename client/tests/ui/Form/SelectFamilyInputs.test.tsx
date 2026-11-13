import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CategoryInput from "../../../src/ui/Form/CategoryInput";
import SubcategoryInput from "../../../src/ui/Form/SubcategoryInput";
import SelectInput from "../../../src/ui/Form/SelectInput";
import LifespanInput from "../../../src/ui/Form/LifespanInput";
import PlanInput from "../../../src/ui/Form/PlanInput";
import TypeOfUserInput from "../../../src/ui/Form/TypeOfUserInput";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import FormHarness from "./FormHarness";
import { getFieldError, getSelect } from "../../test-utils";

vi.mock("../../../src/context/GlobalContext");

const options = [
  { value: "", label: "Choose one" },
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];
const error = { type: "required", message: "boom" };

beforeEach(() => {
  vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
    ...mockUseGlobalContextReturnObj,
  }));
});

describe("CategoryInput", () => {
  it("should render options, submit the selection and hide label on demand", async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, watch, formState: { errors } }) => (
          <CategoryInput
            register={register}
            options={options}
            value={watch("category") ?? ""}
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const { label, select } = getSelect("category");
    expect(label).toHaveTextContent("Category");
    expect(select.options).toHaveLength(3);
    const user = userEvent.setup();
    await user.selectOptions(select, "a");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ category: "a" });

    rerender(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <CategoryInput
            register={register}
            options={options}
            value=""
            errors={errors}
            showLabel={false}
          />
        )}
      </FormHarness>,
    );
    expect(getSelect("category").label).toBeNull();
  });

  it("should show a required error when submitted empty", async () => {
    render(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <CategoryInput
            register={register}
            options={options}
            value=""
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    await userEvent.setup().click(screen.getByText("submit"));
    expect(await screen.findByText("Category is required")).toBeInTheDocument();
    expect(getSelect("category").label).toHaveClass("error");
  });
});

describe("SubcategoryInput", () => {
  it("should render options and submit the selection", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, watch, formState: { errors } }) => (
          <SubcategoryInput
            register={register}
            options={options}
            value={watch("subcategory") ?? ""}
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const { label, select } = getSelect("subcategory");
    expect(label).toHaveTextContent("Subcategory");
    const user = userEvent.setup();
    await user.selectOptions(select, "b");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ subcategory: "b" });
  });

  it("should show a required error and allow hiding the label", async () => {
    const { rerender } = render(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <SubcategoryInput
            register={register}
            options={options}
            value=""
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    await userEvent.setup().click(screen.getByText("submit"));
    expect(
      await screen.findByText("Subcategory is required"),
    ).toBeInTheDocument();
    expect(getFieldError("subcategory").error).toBeInTheDocument();

    rerender(
      <FormHarness>
        {({ register }) => (
          <SubcategoryInput
            register={register}
            options={options}
            value=""
            errors={{}}
            showLabel={false}
          />
        )}
      </FormHarness>,
    );
    expect(getSelect("subcategory").label).toBeNull();
  });
});

describe("SelectInput", () => {
  it("should capitalize the register name as the label and submit", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, watch, formState: { errors } }) => (
          <SelectInput
            register={register}
            registerName="color"
            options={options}
            value={watch("color") ?? ""}
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const { label, select } = getSelect("color");
    expect(label).toHaveTextContent("Color");
    const user = userEvent.setup();
    await user.selectOptions(select, "a");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ color: "a" });
  });

  it("should show a required error", async () => {
    render(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <SelectInput
            register={register}
            registerName="color"
            options={options}
            value=""
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    await userEvent.setup().click(screen.getByText("submit"));
    expect(await screen.findByText("Color is required")).toBeInTheDocument();
    expect(getSelect("color").label).toHaveClass("error");
  });
});

describe("LifespanInput", () => {
  it("should render the label and submit the selection", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, watch, formState: { errors } }) => (
          <LifespanInput
            register={register}
            options={options}
            value={watch("lifespan") ?? ""}
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const { label, select } = getSelect("lifespan");
    expect(label).toHaveTextContent("Select the Lifespan");
    expect(screen.queryByTestId("upgrade-text-container")).toBeNull();
    const user = userEvent.setup();
    await user.selectOptions(select, "a");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ lifespan: "a" });
  });

  it("should show upgrade text when the user can upgrade", () => {
    render(
      <FormHarness>
        {({ register }) => (
          <LifespanInput
            register={register}
            options={options}
            value=""
            errors={{}}
            canUpgrade
          />
        )}
      </FormHarness>,
    );
    expect(
      screen.getByText("Upgrade to increase the life of your flyer."),
    ).toBeInTheDocument();
  });

  it("should show a required error", async () => {
    render(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <LifespanInput
            register={register}
            options={options}
            value=""
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    await userEvent.setup().click(screen.getByText("submit"));
    expect(await screen.findByText("lifespan is required")).toBeInTheDocument();
    expect(getSelect("lifespan").label).toHaveClass("error");
  });
});

describe("PlanInput", () => {
  const planOptions = [
    { value: "1", label: "Free" },
    { value: "2", label: "Paid" },
  ];

  it("should default to plan 1 and submit a changed selection", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <PlanInput
            register={register}
            options={planOptions}
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const { label, select } = getSelect("plan");
    expect(label).toHaveTextContent("Select a Plan");
    expect(select).toHaveValue("1");
    const user = userEvent.setup();
    await user.selectOptions(select, "2");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ plan: "2" });
  });

  it("should hide the label and show an error", () => {
    render(
      <FormHarness>
        {({ register }) => (
          <PlanInput
            register={register}
            options={planOptions}
            errors={{ plan: error }}
            showLabel={false}
          />
        )}
      </FormHarness>,
    );
    expect(getSelect("plan").label).toBeNull();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("should flag the label when there is an error", () => {
    render(
      <FormHarness>
        {({ register }) => (
          <PlanInput
            register={register}
            options={planOptions}
            errors={{ plan: error }}
          />
        )}
      </FormHarness>,
    );
    expect(getSelect("plan").label).toHaveClass("error");
  });
});

describe("TypeOfUserInput", () => {
  it("should render all five options with the given title", async () => {
    const onSubmit = vi.fn();
    render(
      <FormHarness onSubmit={onSubmit}>
        {({ register, watch, formState: { errors } }) => (
          <TypeOfUserInput
            register={register}
            title="Who are you?"
            value={watch("typeOfUser") ?? ""}
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    const { label, select } = getSelect("typeOfUser");
    expect(label).toHaveTextContent("Who are you?");
    expect(select.options).toHaveLength(5);
    expect(screen.queryByText(/Unregistered users must provide/)).toBeNull();
    const user = userEvent.setup();
    await user.selectOptions(select, "business");
    await user.click(screen.getByText("submit"));
    expect(onSubmit.mock.calls[0][0]).toEqual({ typeOfUser: "business" });
  });

  it("should omit Anonymous and show the unregistered messaging", () => {
    render(
      <FormHarness>
        {({ register }) => (
          <TypeOfUserInput
            register={register}
            title="Who are you?"
            value=""
            errors={{}}
            includeAnonymous={false}
            showUnregisteredMessaging
          />
        )}
      </FormHarness>,
    );
    const { select } = getSelect("typeOfUser");
    const labels = Array.from(select.options).map((o) => o.textContent);
    expect(labels).not.toContain("Anonymous");
    expect(
      screen.getByText(/Unregistered users must provide/),
    ).toBeInTheDocument();
  });

  it("should show a required error", async () => {
    render(
      <FormHarness>
        {({ register, formState: { errors } }) => (
          <TypeOfUserInput
            register={register}
            title="Who are you?"
            value=""
            errors={errors}
          />
        )}
      </FormHarness>,
    );
    await userEvent.setup().click(screen.getByText("submit"));
    expect(
      await screen.findByText("This field is required"),
    ).toBeInTheDocument();
    expect(getSelect("typeOfUser").label).toHaveClass("error");
  });
});
