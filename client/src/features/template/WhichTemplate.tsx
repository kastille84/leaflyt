import styled from "styled-components";
import Heading from "../../ui/Heading";
import TemplateList from "./TemplateList";
import { DB_Template } from "../../interfaces/DB_Flyers";
import { useGlobalContext } from "../../context/GlobalContext";
import Button from "../../ui/Button";
import useRegisteredFlyer from "../createFlyer/useRegisteredFlyer";
import toast from "react-hot-toast";
import { useState } from "react";
import OverlaySpinner from "../../ui/OverlaySpinner";
import { useQueryClient } from "@tanstack/react-query";
import { loginUserWithAccessToken } from "../../services/apiAuth";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

const StyledWhichTemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem;
  /* border: 1px solid var(--color-grey-100); */
  background-color: var(--color-brand-100);
  position: relative;

  @media (max-width: 44em) {
    position: absolute;
    top: 0;
    left: -300px;
    z-index: 1000;
    width: 300px;
    height: 100%;
    transition: left 0.5s ease-in-out;

    &.open {
      left: 0;
    }
  }
`;

const SlideOpener = styled.div`
  position: absolute;
  top: 60px;
  right: -68px;
  font-size: 1.2rem;
  /* opacity: 0.8; */
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--color-grey-700);
  background-color: var(--color-orange-500);
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  display: none;

  @media (max-width: 44em) {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    border-radius: var(--border-radius-sm);
    right: -35px;
  }

  @media (max-width: 34em) {
    right: -25px;
  }
`;

const StyledTopHeading = styled(Heading)`
  color: var(--color-brand-600);
`;
const StyledText = styled.p`
  font-size: 1.6rem;
  line-height: 1.4;
`;

const StyledScratchOption = styled.p`
  text-align: center;
  text-transform: capitalize;
  padding: 1.2rem;
  margin-top: 3.6rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 5px;
  box-shadow: var(--shadow-lg);
  border-top: 2px solid var(--color-orange-700);
  /* border-radius: var(--border-radius-md); */
  background-color: var(--color-grey-50);
  cursor: pointer;

  &:hover,
  &.selected {
    background-color: var(--color-grey-100);
    border: 2px solid var(--color-orange-700);
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
`;

export default function WhichTemplate({
  setSelectedTemplate,
  selectedTemplate,
}: {
  setSelectedTemplate: React.Dispatch<React.SetStateAction<DB_Template | null>>;
  selectedTemplate: DB_Template | null;
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const queryClient = useQueryClient();

  const {
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    setDrawerAction,
    setIsOpenFlyerDrawer,
    setUser,
    selectedPlace,
  } = useGlobalContext();

  const { createFlyerUsingTemplate } = useRegisteredFlyer();

  function handleScratchSelection() {
    setSelectedTemplate((prev) => null);
  }

  async function handleDone() {
    if (!selectedTemplate) {
      setBottomSlideInType(null);
      setIsOpenBottomSlideIn(false);
      setDrawerAction("create");
      setIsOpenFlyerDrawer(true);
      return;
    }
    setShowSpinner(true);

    createFlyerUsingTemplate(selectedTemplate!, {
      onSuccess: async (data: any) => {
        queryClient.invalidateQueries({
          queryKey: ["board", selectedPlace?.id],
        });
        // get the latest user
        const userObj = await loginUserWithAccessToken();
        setUser((prev) => userObj.data);
        setShowSpinner(false);
        toast.success("Flyer created!");
        setBottomSlideInType(null);
        setIsOpenBottomSlideIn(false);
      },
      onError: () => {
        setShowSpinner(false);
        toast.error("Flyer creation failed! Try again.");
      },
    });
  }

  return (
    <StyledWhichTemplateContainer
      data-testid="which-template-container"
      className={isOpen ? "open" : ""}
    >
      <SlideOpener onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <HiOutlineChevronDoubleLeft />
        ) : (
          <HiOutlineChevronDoubleRight />
        )}
      </SlideOpener>
      <div>
        <StyledTopHeading as="h2">
          Select a Template for Quick Posting
        </StyledTopHeading>
        <StyledText>Don't create flyers from scratch everytime.</StyledText>
        <StyledText>Use one of your templates & save time!</StyledText>
      </div>
      <TemplateList
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />
      <div>
        <StyledScratchOption
          onClick={handleScratchSelection}
          className={selectedTemplate === null ? "selected" : ""}
        >
          Or Create From Scratch
        </StyledScratchOption>
      </div>
      <StyledButtonContainer data-testid="form-button-container">
        <Button
          type="button"
          size="medium"
          variation="primary"
          onClick={handleDone}
        >
          Done
        </Button>
        {showSpinner && <OverlaySpinner message={"Creating your flyer..."} />}
      </StyledButtonContainer>
    </StyledWhichTemplateContainer>
  );
}
