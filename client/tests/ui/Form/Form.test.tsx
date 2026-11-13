import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../../../src/ui/Form/Form";
import FormControl from "../../../src/ui/Form/FormControl";
import FormControlRow from "../../../src/ui/Form/FormControlRow";
import FieldInputError from "../../../src/ui/Form/FieldInputError";
import FormInfoAlert from "../../../src/ui/Form/FormInfoAlert";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

describe("Form", () => {
  it("should render children and call onSubmit", () => {
    const onSubmit = vi.fn((e) => e?.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">go</button>
      </Form>
    );
    fireEvent.click(screen.getByText("go"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should render without onSubmit", () => {
    render(<Form>child</Form>);
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});

describe("FormControl", () => {
  it("should render children, className and testId", () => {
    render(
      <FormControl testId="ctl" className="title">
        <span>inside</span>
      </FormControl>
    );
    const el = screen.getByTestId("ctl");
    expect(el).toHaveClass("title");
    expect(el).toContainElement(screen.getByText("inside"));
  });

  it("should render empty", () => {
    render(<FormControl testId="empty" />);
    expect(screen.getByTestId("empty")).toBeEmptyDOMElement();
  });
});

describe("FormControlRow", () => {
  it("should render its children", () => {
    render(
      <FormControlRow>
        <FormControl testId="a" />
        <FormControl testId="b" />
      </FormControlRow>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });
});

describe("FieldInputError", () => {
  it("should render the message", () => {
    render(<FieldInputError message="Bad value" />);
    expect(screen.getByTestId("field-error")).toHaveTextContent("Bad value");
  });
});

describe("FormInfoAlert", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(
      () => mockUseGlobalContextReturnObj
    );
  });

  it("should show the plan name when a plan is given", () => {
    render(
      <FormInfoAlert planName="Free" text="Only 1 image" supportText="Upgrade" />
    );
    expect(screen.getByText("Free plan")).toBeInTheDocument();
    expect(screen.getByText("Only 1 image")).toBeInTheDocument();
    expect(screen.getByText("Upgrade")).toBeInTheDocument();
  });

  it("should show limited features without a plan", () => {
    render(<FormInfoAlert text="Anonymous limits" supportText="Sign up" />);
    expect(screen.getByText("Limited features")).toBeInTheDocument();
    expect(screen.getByText("Anonymous limits")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });
});
