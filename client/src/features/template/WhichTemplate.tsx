import styled from "styled-components";
import Heading from "../../ui/Heading";
import TemplateList from "./TemplateList";
import { DB_Template } from "../../interfaces/DB_Flyers";
import { useGlobalContext } from "../../context/GlobalContext";
import Button from "../../ui/Button";
import useCreateRegisteredFlyer from "../createFlyer/useCreateRegisteredFlyer";
import toast from "react-hot-toast";
import { useState } from "react";
import OverlaySpinner from "../../ui/OverlaySpinner";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { loginUserWithAccessToken } from "../../services/apiAuth";

const StyledWhichTemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem;
  /* border: 1px solid var(--color-grey-100); */
  background-color: var(--color-brand-100);
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
  & .selected {
    background-color: var(--color-grey-100);
    border: 2px solid var(--color-orange-700);
  }
`;

export default function WhichTemplate({
  setSelectedTemplate,
  selectedTemplate,
}: {
  setSelectedTemplate: React.Dispatch<React.SetStateAction<DB_Template | null>>;
  selectedTemplate: DB_Template | null;
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const queryClient = useQueryClient();

  const {
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    setDrawerAction,
    setIsOpenFlyerDrawer,
    setUser,
    selectedPlace,
  } = useGlobalContext();

  const { createFlyerUsingTemplate } = useCreateRegisteredFlyer();

  function handleScratchSelection() {
    setSelectedTemplate((prev) => null);
  }

  async function handleDone() {
    if (!selectedTemplate) {
      setBottomSlideInType(null);
      setIsOpenBottomSlideIn(false);
      setDrawerAction("create");
      setIsOpenFlyerDrawer(true);
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
    <StyledWhichTemplateContainer>
      <div>
        <StyledTopHeading as="h2">
          Select a Template for Quick Posting
        </StyledTopHeading>
        <StyledText>Don't create a flyer from scratch.</StyledText>
        <StyledText>Select one of your templates to post quickly:</StyledText>
      </div>
      <TemplateList
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />
      <div>
        <StyledScratchOption onClick={handleScratchSelection}>
          Or Create From Scratch
        </StyledScratchOption>
      </div>
      <div>
        <Button size="medium" variation="primary" onClick={handleDone}>
          Done
        </Button>
        {showSpinner && <OverlaySpinner message={"Creating your flyer..."} />}
      </div>
    </StyledWhichTemplateContainer>
  );
}
