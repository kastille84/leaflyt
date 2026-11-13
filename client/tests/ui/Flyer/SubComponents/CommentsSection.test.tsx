import { render, screen } from "@testing-library/react";
import CommentsSection from "../../../../src/ui/Flyer/SubComponents/CommentsSection";
import * as GlobalContext from "../../../../src/context/GlobalContext";
import * as GeneralUtils from "../../../../src/utils/GeneralUtils";
import { mockUseGlobalContextReturnObj } from "../../../fixtures/context/globalContext";

vi.mock("../../../../src/context/GlobalContext");
vi.mock("../../../../src/utils/GeneralUtils", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("../../../../src/utils/GeneralUtils")
  >()),
  keysBasedOnEnv: vi.fn(),
}));
const discussionEmbed = vi.fn();
vi.mock("disqus-react", () => ({
  DiscussionEmbed: (props: any) => {
    discussionEmbed(props);
    return <div data-testid="disqus" />;
  },
}));

function setup(selectedFlyer: any, shortname: string | undefined = "leaflit") {
  vi.mocked(GlobalContext.useGlobalContext).mockReturnValue({
    ...mockUseGlobalContextReturnObj,
    selectedFlyer,
  } as any);
  vi.mocked(GeneralUtils.keysBasedOnEnv).mockReturnValue({
    disqus: { shortname },
  } as any);
  return render(<CommentsSection />);
}

describe("CommentsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing without a selected flyer", () => {
    const { container } = setup(null);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing when the flyer has comments disabled", () => {
    const { container } = setup({ id: "f1", hasComments: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing without a disqus shortname", () => {
    const { container } = setup({ id: "f1", hasComments: true }, "");
    expect(container).toBeEmptyDOMElement();
  });

  it("should embed disqus with the flyer's url, id and title", () => {
    setup({ id: "f1", hasComments: true, title: "Big Sale" });
    expect(screen.getByTestId("disqus")).toBeInTheDocument();
    expect(discussionEmbed).toHaveBeenCalledWith({
      shortname: "leaflit",
      config: {
        url: `${window.location.origin}/dashboard/fullFlyer/f1`,
        identifier: "f1",
        title: "Big Sale",
      },
    });
  });

  it("should use a default title when the flyer has none", () => {
    setup({ id: "f1", hasComments: true, title: "" });
    expect(discussionEmbed).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ title: "Leaflit Flyer" }),
      }),
    );
  });
});
