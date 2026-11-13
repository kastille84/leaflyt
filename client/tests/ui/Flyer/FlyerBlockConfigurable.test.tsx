import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FlyerBlockConfigurable from "../../../src/ui/Flyer/FlyerBlockConfigurable";
import * as GlobalContext from "../../../src/context/GlobalContext";
import * as FlyerDesignerContext from "../../../src/context/FlyerDesignerContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";
import { mockFlyerDesignerContextReturnObj } from "../../fixtures/context/flyerDesignerContext";
import { mockCreatedFlyer } from "../../fixtures/flyer/flyer";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/context/FlyerDesignerContext");

describe("FlyerBlockConfigurable", () => {
  const setSelectionSection = vi.fn();
  const individual = {
    typeOfUser: "individual",
    firstName: "Jane",
    lastName: "Doe",
  };
  const business = { typeOfUser: "business", name: "Acme" };
  const longContent = `<p>${"word ".repeat(60)}</p>`;

  function mockContexts(user: any = individual, selectedSection = "") {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      user,
    }));
    vi.mocked(FlyerDesignerContext.useFlyerDesignerContext).mockImplementation(
      () => ({
        ...mockFlyerDesignerContextReturnObj,
        setSelectionSection,
        selectedSection: selectedSection as any,
      }),
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show the individual's avatar initial and full name", () => {
    mockContexts(individual);
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    expect(screen.getByText("J")).toBeInTheDocument();
    expect(screen.getByText(/Jane/)).toBeInTheDocument();
    expect(screen.getByText(/Doe/)).toBeInTheDocument();
  });

  it("should show the business name for non-individual users", () => {
    mockContexts(business);
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("should show the flyer title, subcategory, tags and image", () => {
    mockContexts();
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Facial Cleanser",
    );
    expect(screen.getByText("For Sale")).toBeInTheDocument();
    expect(screen.getByText("product")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      mockCreatedFlyer.fileUrlArr![0].secure_url,
    );
  });

  it("should omit the image and tags when the flyer has none", () => {
    mockContexts();
    render(
      <FlyerBlockConfigurable
        flyer={{ ...mockCreatedFlyer, fileUrlArr: [], tags: undefined }}
      />,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByText("product")).toBeNull();
  });

  it("should treat a missing fileUrlArr as having no files", () => {
    mockContexts();
    render(
      <FlyerBlockConfigurable
        flyer={{ ...mockCreatedFlyer, fileUrlArr: undefined }}
      />,
    );
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("should toggle between read more and read less", async () => {
    mockContexts();
    render(
      <FlyerBlockConfigurable
        flyer={{ ...mockCreatedFlyer, content: longContent }}
      />,
    );
    await userEvent.click(screen.getByText("Read more"));
    expect(screen.getByText("Read less")).toBeInTheDocument();
    expect(setSelectionSection).toHaveBeenCalledWith("readMore_color");
    await userEvent.click(screen.getByText("Read less"));
    expect(screen.getByText("Read more")).toBeInTheDocument();
  });

  it.each([
    [/^For Sale$/, "subcategory_color"],
    [/^Facial Cleanser$/, "title_color"],
    [/Jane/, "top_color"],
    [/^product$/, "tags_color"],
  ])("should select the %s section on click", async (text, section) => {
    mockContexts();
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    await userEvent.click(screen.getByText(text));
    expect(setSelectionSection).toHaveBeenCalledWith(section);
  });

  it("should select the business name section on click", async () => {
    mockContexts(business);
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    await userEvent.click(screen.getByText("Acme"));
    expect(setSelectionSection).toHaveBeenCalledWith("top_color");
  });

  it("should select the top background section when the top bar is clicked", async () => {
    mockContexts();
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    await userEvent.click(screen.getByText("J"));
    expect(setSelectionSection).toHaveBeenCalledWith("top_backgroundColor");
  });

  it.each([
    "top_backgroundColor",
    "top_color",
    "subcategory_color",
    "title_color",
    "readMore_color",
    "tags_color",
  ])("should render when %s is the selected section", (section) => {
    mockContexts(individual, section);
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    expect(screen.getByText("Facial Cleanser")).toBeInTheDocument();
  });

  it("should render when the business name section is selected", () => {
    mockContexts(business, "top_color");
    render(<FlyerBlockConfigurable flyer={mockCreatedFlyer} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });
});
