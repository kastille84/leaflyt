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
    border: 1px solid var(--color-grey-200);
    width: 40rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
};

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
  padding: 1rem 2.4rem 2.4rem 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledTopTextContainer = styled.div`
  width: 100%;
  padding: 1rem 2.4rem 2.4rem 2.4rem;
  background-color: var(--color-brand-200);
  color: var(--color-brand-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200);
`;

const StyledActionContainer = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 2.4rem;
  border-top: 1px solid var(--color-grey-200);
`;
export default function BoardFlyerBlock({
  flyer,
}: {
  flyer: DB_Flyers_Response;
}) {
  function determineBoardFlyer() {
    if (flyer?.fileUrlArr?.length) {
      // return imageBasedFlyer
      return (
        <StyledImageBasedFlyerBlock>
          <StyledFigure>
            <img
              src={flyer.fileUrlArr[0].secure_url}
              width={"100%"}
              height={"auto"}
            />
            <StyledTopImageContainer>
              <div>Avatar</div>
              <div>
                <HiOutlineEllipsisHorizontal />
              </div>
            </StyledTopImageContainer>
          </StyledFigure>
          <section>
            <Heading as="h2">{flyer.title}</Heading>
            <small>{flyer.subcategory}</small>
            <p>{shortenTitle(flyer.content, 50)}</p>
          </section>
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
        </StyledImageBasedFlyerBlock>
      );
    } else {
      // return textBasedFlyer
      return (
        <StyledTextBasedFlyerBlock>
          <StyledTopTextContainer>
            <div>Avatar</div>
            <div>
              <HiOutlineEllipsisHorizontal />
            </div>
          </StyledTopTextContainer>
          <section>
            <Heading as="h2">{flyer.title}</Heading>
            <small>{flyer.subcategory}</small>
            <p>{shortenTitle(flyer.content, 75)}</p>
          </section>
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
        </StyledTextBasedFlyerBlock>
      );
    }
  }
  return determineBoardFlyer();
}
