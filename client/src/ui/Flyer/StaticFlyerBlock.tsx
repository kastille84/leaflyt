import styled, { css } from "styled-components";

import { DB_Flyers_Response, FlyerDesign } from "../../interfaces/DB_Flyers";
import Heading from "../Heading";
import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlineShare,
} from "react-icons/hi2";
import { shortenTitle } from "../../utils/GeneralUtils";
import { useState } from "react";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import {
  UNREGISTERED_FLYER_DESIGN_DEFAULT,
  REGISTERED_FLYER_DESIGN_DEFAULT,
} from "../../constants";

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

const StyledTopImageContainer = styled.div<{ flyerDesign: FlyerDesign }>`
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
`;
const StyledTopTextContainer = styled.div<{ flyerDesign: FlyerDesign }>`
  width: 100%;
  padding: 1rem 2.4rem;
  background-color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  color: ${({ flyerDesign }) => flyerDesign.top.color};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200);
`;

const StyledMainContentContainer = styled.div`
  padding: 2.4rem 2.4rem 1rem 2.4rem;
  font-size: 1.4rem;
`;

const StyledSubcategory = styled.small<{ flyerDesign: FlyerDesign }>`
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ flyerDesign }) => flyerDesign.subcategory.color};
`;

const StyledHeading = styled(Heading)<{ flyerDesign: FlyerDesign }>`
  color: ${({ flyerDesign }) => flyerDesign.title.color};
  text-transform: capitalize;
  margin-bottom: 1.2rem;
`;

const StyledReadMore = styled.p<{ flyerDesign: FlyerDesign }>`
  text-transform: capitalize;
  font-weight: 600;
  color: ${({ flyerDesign }) => flyerDesign.readMore.color};
  cursor: pointer;
  text-align: right;
  letter-spacing: 0.4px;
`;

const StyledTagContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
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
  border-top: 1px solid var(--color-grey-200);
  padding: 1rem 2.4rem;
`;

const StyledActionIconContainer = styled.div<{ flyerDesign: FlyerDesign }>`
  display: flex;
  align-items: center;
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
export default function StaticFlyerBlock({
  flyer,
}: {
  flyer: DB_Flyers_Response;
}) {
  const userLimits = useGetUserLimits();

  const [isReadMore, setIsReadMore] = useState(false);
  const [flyerStyles, setFlyerStyles] = useState(() => {
    if (!flyer.flyerDesign) {
      return UNREGISTERED_FLYER_DESIGN_DEFAULT;
    }
    return flyer.flyerDesign;
  });

  function hasFiles() {
    if (flyer?.fileUrlArr?.length) {
      return true;
    }
    return false;
  }

  function determineAvatarAndName() {
    if (!flyer.user) {
      // anonymous flyer
      switch (flyer.typeOfUser) {
        case "anonymous":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>A</StyledAvatar>
              <div>Anonymous</div>
            </>
          );
        case "individual":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>
                {flyer.individual!.name.firstName[0]}
              </StyledAvatar>
              <div>
                {flyer.individual!.name.firstName} &nbsp;
                {flyer.individual!.name.lastName}
              </div>
            </>
          );
        case "organization":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>
                {flyer.organization!.name[0]}
              </StyledAvatar>
              <div>{flyer.organization!.name}</div>
            </>
          );
        case "business":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>
                {flyer.business!.name[0]}
              </StyledAvatar>
              <div>{flyer.business!.name}</div>
            </>
          );
      }
    } else {
      if (flyer.user.typeOfUser === "individual") {
        return (
          <>
            <StyledAvatar flyerDesign={flyerStyles}>
              {flyer.user!.firstName[0]}
            </StyledAvatar>
            <div>
              {flyer.user!.firstName} &nbsp;
              {flyer.user!.lastName}
            </div>
          </>
        );
      } else {
        return (
          <>
            <StyledAvatar flyerDesign={flyerStyles}>
              {flyer.user!.name[0]}
            </StyledAvatar>
            <div>{flyer.user!.name}</div>
          </>
        );
      }
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
    <StyledFlyerBlock flyerDesign={flyerStyles}>
      {hasFiles() && (
        <StyledFigure>
          <img
            src={flyer!.fileUrlArr![0].secure_url}
            width={"100%"}
            height={"auto"}
          />
          <StyledTopImageContainer flyerDesign={flyerStyles}>
            {renderTopContent()}
          </StyledTopImageContainer>
        </StyledFigure>
      )}
      {!hasFiles() && (
        <StyledTopTextContainer flyerDesign={flyerStyles}>
          {renderTopContent()}
        </StyledTopTextContainer>
      )}
      <StyledMainContentContainer>
        {/* TODO: Make this section dynamic (mainContent, infoContent, couponContent) */}
        <StyledSubcategory flyerDesign={flyerStyles}>
          {flyer.subcategory}
        </StyledSubcategory>
        <StyledHeading as="h2" flyerDesign={flyerStyles}>
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
            onClick={() => setIsReadMore(!isReadMore)}
          >
            {isReadMore ? "Read less" : "Read more"}
          </StyledReadMore>
        )}
        <StyledTagContainer>
          <StyledTag flyerDesign={flyerStyles}>#</StyledTag>
          {flyer.tags &&
            flyer.tags.map((tag) => (
              <StyledTag flyerDesign={flyerStyles} key={tag}>
                {tag}
              </StyledTag>
            ))}
        </StyledTagContainer>
      </StyledMainContentContainer>
      <StyledActionContainer>
        <StyledActionIconContainer flyerDesign={flyerStyles}>
          <HiOutlineHandThumbUp />
        </StyledActionIconContainer>
        <StyledActionIconContainer flyerDesign={flyerStyles}>
          <HiOutlineChatBubbleLeftEllipsis />
        </StyledActionIconContainer>
        <StyledActionIconContainer flyerDesign={flyerStyles}>
          <HiOutlineShare />
        </StyledActionIconContainer>
      </StyledActionContainer>
    </StyledFlyerBlock>
  );
}
