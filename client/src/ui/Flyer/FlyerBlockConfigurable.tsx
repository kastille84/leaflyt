import styled, { css } from "styled-components";
import Heading from "../Heading";
import { DB_Flyers_Response, FlyerDesign } from "../../interfaces/DB_Flyers";

import {
  HiOutlineBookmark,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlineShare,
} from "react-icons/hi2";
import { shortenTitle } from "../../utils/GeneralUtils";
import { useEffect, useState } from "react";

import { useGlobalContext } from "../../context/GlobalContext";
import { useFlyerDesignerContext } from "../../context/FlyerDesignerContext";

import {
  cardStyle,
  cardRadius,
  StyledTopTextContainer as BaseTopTextContainer,
  StyledActionContainer,
  StyledActionIconContainer as BaseActionIconContainer,
  StyledAvatarContainer,
  StyledAvatar,
  StyledAvatarName as BaseAvatarName,
} from "./flyerBlockStyles";

const StyledFlyerBlock = styled.div<{ flyerDesign: FlyerDesign }>`
  ${cardStyle}
  ${cardRadius}
  width: 40rem;
  font-family: ${({ flyerDesign }) => flyerDesign.font};

  @media (max-width: 34em) {
    width: 100%;
  }
`;

const StyledFigure = styled.figure<{ flyerDesign: FlyerDesign }>`
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
`;

const StyledTopImageContainer = styled.div<{
  flyerDesign: FlyerDesign;
  selected: boolean;
}>`
  background-color: ${(props) => props.flyerDesign.top.backgroundColor};
  position: absolute;
  top: 0;

  opacity: 0.85;
  color: ${(props) => props.flyerDesign.top.color};
  width: 100%;
  padding: 1rem 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledTopTextContainer = styled(BaseTopTextContainer)<{
  selected: boolean;
}>`
  cursor: pointer;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledMainContentContainer = styled.div`
  padding: 1.6rem 2rem;

  @media (max-width: 34em) {
    padding: 1.4rem 1.6rem;
  }
`;

const StyledSubcategory = styled.small<{
  flyerDesign: FlyerDesign;
  selected: boolean;
}>`
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ flyerDesign }) => flyerDesign.subcategory.color};
  cursor: pointer;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledHeading = styled(Heading)<{
  flyerDesign: FlyerDesign;
  selected: boolean;
}>`
  color: ${({ flyerDesign }) => flyerDesign.title.color};
  text-transform: capitalize;
  margin-bottom: 1.2rem;
  cursor: pointer;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledReadMore = styled.p<{
  flyerDesign: FlyerDesign;
  selected: boolean;
}>`
  text-transform: capitalize;
  font-weight: 600;
  color: ${({ flyerDesign }) => flyerDesign.readMore.color};
  cursor: pointer;
  text-align: right;
  letter-spacing: 0.4px;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledTagContainer = styled.div<{ selected: boolean }>`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  cursor: pointer;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledTag = styled.small<{ flyerDesign: FlyerDesign }>`
  text-transform: capitalize;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1.5rem;
  color: ${({ flyerDesign }) => flyerDesign.tags.color};
`;

const StyledActionIconContainer = styled(BaseActionIconContainer)<{
  selected: boolean;
}>`
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledAvatarName = styled(BaseAvatarName)<{ selected: boolean }>`
  border-radius: var(--border-radius-sm);
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
`;

export default function FlyerBlockConfigurable({ flyer }: { flyer: any }) {
  const flyerDesign = flyer.flyerDesign;
  const { user } = useGlobalContext();
  const { setSelectionSection, selectedSection } = useFlyerDesignerContext();
  const [isReadMore, setIsReadMore] = useState(false);

  useEffect(() => {}, [selectedSection]);

  function hasFiles() {
    if (flyer?.fileUrlArr?.length) {
      return true;
    }
    return false;
  }

  function determineAvatarAndName() {
    if (user!.typeOfUser === "individual") {
      return (
        <>
          <StyledAvatar flyerDesign={flyerDesign}>
            {user!.firstName![0]}
          </StyledAvatar>
          <StyledAvatarName
            onClick={(e) => {
              e.stopPropagation();
              setSelectionSection("top_color");
            }}
            selected={selectedSection === "top_color"}
          >
            {user!.firstName} &nbsp;
            {user!.lastName}
          </StyledAvatarName>
        </>
      );
    } else {
      return (
        <>
          <StyledAvatar flyerDesign={flyerDesign}>
            {user!.name![0]}
          </StyledAvatar>
          <StyledAvatarName
            onClick={(e) => {
              e.stopPropagation();
              setSelectionSection("top_color");
            }}
            selected={selectedSection === "top_color"}
          >
            {user!.name}
          </StyledAvatarName>
        </>
      );
    }
  }

  function renderTopContent() {
    return (
      <>
        <StyledAvatarContainer>
          {determineAvatarAndName()}
        </StyledAvatarContainer>
        <div>
          <HiOutlineEllipsisHorizontal />
        </div>
      </>
    );
  }

  return (
    <StyledFlyerBlock flyerDesign={flyerDesign}>
      {/* {hasFiles() && (
        <StyledFigure flyerDesign={flyerDesign}>
          <img
            src={flyer!.fileUrlArr![0].secure_url}
            width={"100%"}
            height={"auto"}
          />
          <StyledTopImageContainer
            flyerDesign={flyerDesign}
            onClick={() => setSelectionSection("top_backgroundColor")}
            selected={selectedSection === "top_backgroundColor"}
          >
            {renderTopContent()}
          </StyledTopImageContainer>
        </StyledFigure>
      )}
      {!hasFiles() && (
        <StyledTopTextContainer
          flyerDesign={flyerDesign}
          onClick={() => setSelectionSection("top_backgroundColor")}
          selected={selectedSection === "top_backgroundColor"}
        >
          {renderTopContent()}
        </StyledTopTextContainer>
      )} */}
      <StyledTopTextContainer
        flyerDesign={flyerDesign}
        onClick={() => setSelectionSection("top_backgroundColor")}
        selected={selectedSection === "top_backgroundColor"}
      >
        {renderTopContent()}
      </StyledTopTextContainer>
      <StyledMainContentContainer>
        {hasFiles() && (
          <StyledFigure flyerDesign={flyerDesign}>
            <img
              src={flyer!.fileUrlArr![0].secure_url}
              width={"100%"}
              height={"auto"}
            />
          </StyledFigure>
        )}
        <StyledSubcategory
          flyerDesign={flyerDesign}
          selected={selectedSection === "subcategory_color"}
          onClick={() => setSelectionSection("subcategory_color")}
        >
          {flyer.subcategory}
        </StyledSubcategory>
        <StyledHeading
          as="h2"
          flyerDesign={flyerDesign}
          selected={selectedSection === "title_color"}
          onClick={() => setSelectionSection("title_color")}
        >
          {flyer.title}
        </StyledHeading>
        {!isReadMore && (
          <div
            dangerouslySetInnerHTML={{
              __html: shortenTitle(flyer.content, 75),
            }}
          ></div>
        )}
        {isReadMore && (
          <div dangerouslySetInnerHTML={{ __html: flyer.content }}></div>
        )}

        <StyledReadMore
          flyerDesign={flyerDesign}
          selected={selectedSection === "readMore_color"}
          onClick={() => {
            setIsReadMore(!isReadMore);
            setSelectionSection("readMore_color");
          }}
        >
          {isReadMore ? "Read less" : "Read more"}
        </StyledReadMore>

        <StyledTagContainer
          onClick={() => setSelectionSection("tags_color")}
          selected={selectedSection === "tags_color"}
        >
          <StyledTag flyerDesign={flyerDesign}>#</StyledTag>
          {flyer.tags &&
            flyer.tags.map((tag: any) => (
              <StyledTag flyerDesign={flyerDesign} key={tag}>
                {tag}
              </StyledTag>
            ))}
        </StyledTagContainer>
      </StyledMainContentContainer>
      <StyledActionContainer flyerDesign={flyerDesign}>
        <StyledActionIconContainer
          flyerDesign={flyerDesign}
          selected={selectedSection === "top_backgroundColor"}
        >
          <HiOutlineBookmark />
        </StyledActionIconContainer>
        <StyledActionIconContainer
          flyerDesign={flyerDesign}
          selected={selectedSection === "top_backgroundColor"}
        >
          <HiOutlineHandThumbUp />
        </StyledActionIconContainer>
        {/* <StyledActionIconContainer
          flyerDesign={flyerDesign}
          selected={selectedSection === "top_backgroundColor"}
        >
          <HiOutlineChatBubbleLeftEllipsis />
        </StyledActionIconContainer> */}
        <StyledActionIconContainer
          flyerDesign={flyerDesign}
          selected={selectedSection === "top_backgroundColor"}
        >
          <HiOutlineShare />
        </StyledActionIconContainer>
      </StyledActionContainer>
    </StyledFlyerBlock>
  );
}
