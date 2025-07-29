import { DB_Flyers_Response } from "../../interfaces/DB_Flyers";
import styled, { css } from "styled-components";
import Heading from "../Heading";
import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlineShare,
} from "react-icons/hi2";
import { shortenTitle } from "../../utils/GeneralUtils";
import { useState } from "react";

// const variations = {
//   imageBasedFlyer: css``,
//   textBasedFlyer: css``,
// };
// const StyledBoardFlyerBlock = styled.div`
//   box-shadow: var(--shadow-sm);

//   ${variations.imageBasedFlyer}
//   ${variations.textBasedFlyer}
// `;

const common = {
  style: css`
    box-shadow: var(--shadow-sm);
    &:hover {
      box-shadow: var(--shadow-lg);
    }
    border: 1px solid var(--color-grey-200);
    width: 40rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
};

const StyledFlyerBlock = styled.div`
  ${common.style}
`;

const StyledImageBasedFlyerBlock = styled.div`
  ${common.style}

  & section {
    padding: 2.4rem;
    /* padding-top: 0; */
  }
`;

const StyledTextBasedFlyerBlock = styled.div`
  ${common.style}
  & section {
    padding: 2.4rem;
  }
`;

const StyledFigure = styled.figure`
  width: 100%;
  height: auto;
  position: relative;
`;

const StyledTopImageContainer = styled.div`
  position: absolute;
  top: 0;

  background-color: var(--color-grey-600);
  opacity: 0.65;
  color: var(--color-grey-50);
  width: 100%;
  padding: 1rem 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledTopTextContainer = styled.div`
  width: 100%;
  padding: 1rem 2.4rem;
  background-color: var(--color-brand-500);
  color: var(--color-grey-50);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200);
`;

const StyledMainContentContainer = styled.div`
  padding: 2.4rem 2.4rem 1rem 2.4rem;
  font-size: 1.4rem;
`;

const StyledSubcategory = styled.small`
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--color-orange-600);
`;

const StyledHeading = styled(Heading)`
  text-transform: capitalize;
  margin-bottom: 1.2rem;
`;

const StyledReadMore = styled.p`
  text-transform: capitalize;
  font-weight: 600;
  color: var(--color-brand-600);
  cursor: pointer;
  text-align: right;
  letter-spacing: 0.4px;
`;

const StyledTagContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const StyledTag = styled.small`
  text-transform: capitalize;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1rem;
  color: var(--color-blue-400);
`;

const StyledActionContainer = styled.section`
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
  border-top: 1px solid var(--color-grey-200);
  padding: 1rem 2.4rem;
`;

const StyledAvatarContainer = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;
const StyledAvatar = styled.div`
  background-color: var(--color-grey-50);
  /* opacity: 0.65; */
  color: var(--color-brand-700);
  width: 35px;
  height: 35px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;
export default function BoardFlyerBlock({
  flyer,
}: {
  flyer: DB_Flyers_Response;
}) {
  const [isReadMore, setIsReadMore] = useState(false);
  function hasFiles() {
    if (flyer?.fileUrlArr?.length) {
      return true;
    }
    return false;
  }

  function determineAvatarAndName() {
    if (!flyer.userId) {
      // anonymous flyer
      switch (flyer.typeOfUser) {
        case "anonymous":
          return (
            <>
              <StyledAvatar>A</StyledAvatar>
              <div>Anonymous</div>
            </>
          );
        case "individual":
          return (
            <>
              <StyledAvatar>{flyer.individual!.name.firstName[0]}</StyledAvatar>
              <div>
                {flyer.individual!.name.firstName} &nbsp;
                {flyer.individual!.name.lastName}
              </div>
            </>
          );
        case "organization":
          return (
            <>
              <StyledAvatar>{flyer.organization!.name[0]}</StyledAvatar>
              <div>{flyer.organization!.name}</div>
            </>
          );
        case "business":
          return (
            <>
              <StyledAvatar>{flyer.business!.name[0]}</StyledAvatar>
              <div>{flyer.business!.name}</div>
            </>
          );
      }
    }
    // TODO: logic for registered flyer
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
    <StyledFlyerBlock>
      {hasFiles() && (
        <StyledFigure>
          <img
            src={flyer!.fileUrlArr![0].secure_url}
            width={"100%"}
            height={"auto"}
          />
          <StyledTopImageContainer>
            {renderTopContent()}
          </StyledTopImageContainer>
        </StyledFigure>
      )}
      {!hasFiles() && (
        <StyledTopTextContainer>{renderTopContent()}</StyledTopTextContainer>
      )}
      <StyledMainContentContainer>
        <StyledSubcategory>{flyer.subcategory}</StyledSubcategory>
        <StyledHeading as="h2">{flyer.title}</StyledHeading>
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
          <StyledReadMore onClick={() => setIsReadMore(!isReadMore)}>
            {isReadMore ? "Read less" : "Read more"}
          </StyledReadMore>
        )}
        <StyledTagContainer>
          <StyledTag>#</StyledTag>
          {flyer.tags &&
            flyer.tags.map((tag) => <StyledTag key={tag}>{tag}</StyledTag>)}
        </StyledTagContainer>
      </StyledMainContentContainer>
      <StyledActionContainer>
        <div>
          <HiOutlineHandThumbUp />
        </div>
        <div>
          <HiOutlineChatBubbleLeftEllipsis />
        </div>
        <div>
          <HiOutlineShare />
        </div>
      </StyledActionContainer>
    </StyledFlyerBlock>
  );
}
