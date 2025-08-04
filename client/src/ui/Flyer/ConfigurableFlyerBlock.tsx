import styled, { css } from "styled-components";
import Heading from "../Heading";
import { DB_Flyers_Response, FlyerDesign } from "../../interfaces/DB_Flyers";

import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlineShare,
} from "react-icons/hi2";
import { shortenTitle } from "../../utils/GeneralUtils";
import { useEffect, useState } from "react";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import {
  UNREGISTERED_FLYER_DESIGN_DEFAULT,
  REGISTERED_FLYER_DESIGN_DEFAULT,
} from "../../constants";
import { useGlobalContext } from "../../context/GlobalContext";
import { useFlyerDesignerContext } from "../../context/FlyerDesignerContext";

const common = {
  style: css`
    box-shadow: var(--shadow-sm);
    &:hover {
      box-shadow: var(--shadow-lg);
    }

    width: 40rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
};

const StyledFlyerBlock = styled.div<{ flyerDesign: FlyerDesign }>`
  ${common.style}
  border: 1px solid var(--color-grey-200);
  /* border: 1px solid ${(props) => props.flyerDesign.outlines.color}; */
`;

const StyledFigure = styled.figure`
  width: 100%;
  height: auto;
  position: relative;
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
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}
`;

const StyledTopTextContainer = styled.div<{
  flyerDesign: FlyerDesign;
  selected: boolean;
}>`
  width: 100%;
  padding: 1rem 2.4rem;
  background-color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  color: ${({ flyerDesign }) => flyerDesign.top.color};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    border: 2px dashed var(--color-red-800);
  }
  ${({ selected }) =>
    selected
      ? css`
          border: 2px dashed var(--color-red-800);
        `
      : css`
          border-bottom: 1px solid var(--color-grey-200);
        `}
`;

const StyledMainContentContainer = styled.div`
  padding: 2.4rem 2.4rem 1rem 2.4rem;
  font-size: 1.4rem;
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
  font-size: 1rem;
  color: ${({ flyerDesign }) => flyerDesign.tags.color};
`;

const StyledActionContainer = styled.section`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2.4rem;
  padding: 1rem 2.4rem;
  border-top: 1px solid var(--color-grey-200);
`;

const StyledActionIconContainer = styled.div<{
  flyerDesign: FlyerDesign;
  selected: boolean;
}>`
  display: flex;
  align-items: center;
  ${({ selected }) =>
    selected &&
    css`
      border: 2px dashed var(--color-red-800);
    `}

  & svg {
    color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  }
`;

const StyledAvatarContainer = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;
const StyledAvatar = styled.div<{ flyerDesign: FlyerDesign }>`
  background-color: ${({ flyerDesign }) => flyerDesign.top.color};
  /* opacity: 0.65; */
  color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  width: 35px;
  height: 35px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;

export default function ConfigurableFlyerBlock({ flyer }: { flyer: any }) {
  const { user } = useGlobalContext();
  const { setSelectionSection, selectedSection } = useFlyerDesignerContext();
  const [isReadMore, setIsReadMore] = useState(false);
  const [flyerStyles, setFlyerStyles] = useState(() => {
    if (flyer && !flyer.flyerDesign) {
      return REGISTERED_FLYER_DESIGN_DEFAULT;
    }
    return flyer.flyerDesign;
  });

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
          <StyledAvatar flyerDesign={flyerStyles}>
            {user!.firstName![0]}
          </StyledAvatar>
          <div>
            {user!.firstName} &nbsp;
            {user!.lastName}
          </div>
        </>
      );
    } else {
      return (
        <>
          <StyledAvatar flyerDesign={flyerStyles}>
            {user!.name![0]}
          </StyledAvatar>
          <div>{user!.name}</div>
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
    <StyledFlyerBlock flyerDesign={REGISTERED_FLYER_DESIGN_DEFAULT}>
      {hasFiles() && (
        <StyledFigure>
          <img
            src={flyer!.fileUrlArr![0].secure_url}
            width={"100%"}
            height={"auto"}
          />
          <StyledTopImageContainer
            flyerDesign={flyerStyles}
            onClick={() => setSelectionSection("top")}
            selected={selectedSection === "top"}
          >
            {renderTopContent()}
          </StyledTopImageContainer>
        </StyledFigure>
      )}
      {!hasFiles() && (
        <StyledTopTextContainer
          flyerDesign={flyerStyles}
          onClick={() => setSelectionSection("top")}
          selected={selectedSection === "top"}
        >
          {renderTopContent()}
        </StyledTopTextContainer>
      )}
      <StyledMainContentContainer>
        {/* TODO: Make this section dynamic (mainContent, infoContent, couponContent) */}
        <StyledSubcategory
          flyerDesign={flyerStyles}
          selected={selectedSection === "subcategory"}
          onClick={() => setSelectionSection("subcategory")}
        >
          {flyer.subcategory}
        </StyledSubcategory>
        <StyledHeading
          as="h2"
          flyerDesign={flyerStyles}
          selected={selectedSection === "title"}
          onClick={() => setSelectionSection("title")}
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
        {flyer.content.length > 75 && (
          <StyledReadMore
            flyerDesign={flyerStyles}
            selected={selectedSection === "readMore"}
            onClick={() => {
              setIsReadMore(!isReadMore);
              setSelectionSection("readMore");
            }}
          >
            {isReadMore ? "Read less" : "Read more"}
          </StyledReadMore>
        )}
        <StyledTagContainer
          onClick={() => setSelectionSection("tags")}
          selected={selectedSection === "tags"}
        >
          <StyledTag flyerDesign={flyerStyles}>#</StyledTag>
          {flyer.tags &&
            flyer.tags.map((tag: any) => (
              <StyledTag flyerDesign={flyerStyles} key={tag}>
                {tag}
              </StyledTag>
            ))}
        </StyledTagContainer>
      </StyledMainContentContainer>
      <StyledActionContainer>
        <StyledActionIconContainer
          flyerDesign={flyerStyles}
          selected={selectedSection === "top"}
        >
          <HiOutlineHandThumbUp />
        </StyledActionIconContainer>
        <StyledActionIconContainer
          flyerDesign={flyerStyles}
          selected={selectedSection === "top"}
        >
          <HiOutlineChatBubbleLeftEllipsis />
        </StyledActionIconContainer>
        <StyledActionIconContainer
          flyerDesign={flyerStyles}
          selected={selectedSection === "top"}
        >
          <HiOutlineShare />
        </StyledActionIconContainer>
      </StyledActionContainer>
    </StyledFlyerBlock>
  );
}
