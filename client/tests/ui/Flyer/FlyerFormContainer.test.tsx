import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FlyerFormContainer from "../../../src/ui/Flyer/FlyerFormContainer";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");

describe("FlyerFormContainer", () => {
  const setShowCloseSlideInModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      setShowCloseSlideInModal,
    }));
  });

  it.each([
    ["create", "Create Flyer near Cafe"],
    ["edit", "Edit Flyer near Cafe"],
    ["editTemplate", "Edit Template"],
    ["createTemplate", "Create Template"],
  ])("should title the %s action", (action, title) => {
    render(
      <FlyerFormContainer name="Cafe" action={action}>
        <p>child</p>
      </FlyerFormContainer>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(title);
  });

  it("should render without a title for an unknown action", () => {
    render(
      <FlyerFormContainer name="Cafe" action="other">
        <p>child</p>
      </FlyerFormContainer>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("");
  });

  it("should render its children", () => {
    render(
      <FlyerFormContainer name="Cafe" action="create">
        <p>child content</p>
      </FlyerFormContainer>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("should ask to close the slide-in when the X is clicked", async () => {
    const { container } = render(
      <FlyerFormContainer name="Cafe" action="create">
        <p>child</p>
      </FlyerFormContainer>,
    );
    await userEvent.click(container.querySelector("svg")!);
    expect(setShowCloseSlideInModal).toHaveBeenCalledWith(true);
  });
});
