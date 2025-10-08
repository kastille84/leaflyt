import styled from "styled-components";
import { useGlobalContext } from "../../../context/GlobalContext";
import { DB_Template } from "../../../interfaces/DB_Flyers";
import FlyerBlockStatic from "../../../ui/Flyer/FlyerBlockStatic";
import { HiOutlinePencilSquare, HiOutlineXMark } from "react-icons/hi2";
import Heading from "../../../ui/Heading";
import { useEffect } from "react";

const StyledTemplateListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
  padding-bottom: 2.4rem;
`;

const StyledTemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2.4rem;
  align-items: center;
`;

const StyledActionContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;

  & svg {
    color: var(--color-brand-700);
    font-size: 2rem;
    cursor: pointer;
  }
  & svg:hover {
    color: var(--color-blue-400);
  }
`;

const StyledTemplateListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  border: 2px dashed var(--color-brand-700);
  padding: 2.4rem;
  background-color: var(--color-grey-50);
`;
export default function TemplateList() {
  const { user, setDrawerAction, setIsOpenFlyerDrawer, setTemplateToEdit } =
    useGlobalContext();

  function handleEdit(template: DB_Template) {
    setTemplateToEdit(template);
    setDrawerAction("editTemplate");
    setIsOpenFlyerDrawer((prev) => true);
  }

  useEffect(() => {
    // return () => {
    //   setDrawerAction(null);
    //   setTemplateToEdit(null);
    //   setIsOpenFlyerDrawer((prev) => false);
    // };
  }, []);

  return (
    <StyledTemplateListContainer>
      {user?.templates.map((template: DB_Template) => (
        <StyledTemplateListItem key={template.id}>
          <StyledTemplateHeader>
            <Heading as="h3">{template.templateName}</Heading>
            <StyledActionContainer>
              <HiOutlinePencilSquare onClick={() => handleEdit(template)} />
              <HiOutlineXMark />
            </StyledActionContainer>
          </StyledTemplateHeader>
          <FlyerBlockStatic key={template.id} flyer={template} />
        </StyledTemplateListItem>
      ))}
    </StyledTemplateListContainer>
  );
}
