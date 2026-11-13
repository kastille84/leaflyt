import { render } from "@testing-library/react";
import BoardWelcomeModal from "../../../src/ui/Modals/BoardWelcomeModal";
import DcmaModal from "../../../src/ui/Modals/DcmaModal";
import MerchantDisclaimerModal from "../../../src/ui/Modals/MerchantDisclaimerModal";
import TermsModal from "../../../src/ui/Modals/TermsModal";
import * as GlobalContext from "../../../src/context/GlobalContext";
import { useResponsiveWidth } from "../../../src/hooks/useResponsiveWidth";
import { mockUseGlobalContextReturnObj } from "../../fixtures/context/globalContext";

vi.mock("../../../src/context/GlobalContext");
vi.mock("../../../src/hooks/useResponsiveWidth");

function getModalContent() {
  return document.querySelector(".ReactModal__Content") as HTMLElement;
}

describe("Modal width by screen size", () => {
  beforeEach(() => {
    vi.mocked(GlobalContext.useGlobalContext).mockImplementation(() => ({
      ...mockUseGlobalContextReturnObj,
      showBoardWelcomeModal: true,
      showDcmaModal: true,
      showMerchantDisclaimerModal: true,
      showTermsModal: true,
      termsModalType: "terms",
      selectedPlace: null,
    }));
  });

  const modals = [
    ["BoardWelcomeModal", BoardWelcomeModal],
    ["DcmaModal", DcmaModal],
    ["MerchantDisclaimerModal", MerchantDisclaimerModal],
    ["TermsModal", TermsModal],
  ] as const;

  it.each(modals)("%s is 95% wide on a small screen", (_name, Modal) => {
    vi.mocked(useResponsiveWidth).mockReturnValue("s_mobile");
    render(<Modal />);
    expect(getModalContent().style.width).toBe("95%");
  });

  it.each(modals)("%s is 80% wide on a large screen", (_name, Modal) => {
    vi.mocked(useResponsiveWidth).mockReturnValue("l_desktop");
    render(<Modal />);
    expect(getModalContent().style.width).toBe("80%");
  });
});
