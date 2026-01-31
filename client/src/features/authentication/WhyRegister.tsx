import styled from "styled-components";
import Heading from "../../ui/Heading";
import {
  HiOutlineBookmark,
  HiOutlineClock,
  HiOutlineComputerDesktop,
  HiOutlineDocumentDuplicate,
  HiOutlineMap,
  HiOutlinePhoto,
} from "react-icons/hi2";
import { useState } from "react";

const StyledWhyRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem;
  /* border: 1px solid var(--color-grey-100); */
  background-color: var(--color-brand-100);
  position: relative;

  @media (max-width: 75em) {
    position: absolute;
    top: 0;
    right: -400px;
    z-index: 2;
    width: 400px;
    transition: right 0.5s ease-in-out;

    &.open {
      right: 0;
    }
  }

  @media (max-width: 34em) {
    /* display: none; */
    width: 250px;
    right: -250px;
  }
`;

const SlideOpener = styled.div`
  position: absolute;
  top: 60px;
  left: -68px;
  font-size: 1.2rem;
  /* opacity: 0.8; */
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--color-grey-700);
  background-color: var(--color-orange-500);
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  display: none;

  @media (max-width: 75em) {
    display: block;
    transform: rotate(90deg);
    left: -78px;
  }
  @media (max-width: 59em) {
    left: -69px;
  }

  @media (max-width: 34em) {
    left: -53px;
  }
`;

const StyledIconContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;

  & svg {
    color: var(--color-orange-700);
    font-size: 2.4rem;
  }
`;

const StyledContentContainer = styled.div``;
const StyledArticleContainer = styled.div`
  display: flex;
  gap: 2.4rem;
`;

const StyledTopHeading = styled(Heading)`
  /* font-size: 2.4rem; */
  letter-spacing: 0.4px;
  color: var(--color-orange-700);
`;
const StyledHeading = styled(Heading)`
  font-size: 1.8rem;
  letter-spacing: 0.4px;
  color: var(--color-orange-700);
  font-weight: 600;

  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const StyledText = styled.p`
  font-size: 1.6rem;
  line-height: 1.4;
`;
export default function WhyRegister() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledWhyRegisterContainer className={isOpen ? "open" : ""}>
      <SlideOpener onClick={() => setIsOpen(!isOpen)}>Why Register</SlideOpener>
      <div>
        <StyledTopHeading as="h2">Why Signup?</StyledTopHeading>
        <StyledText>
          When you signup, you have a chance to access these features based on
          your chosen tier:
        </StyledText>
      </div>
      <StyledArticleContainer>
        <StyledIconContainer>
          <HiOutlineDocumentDuplicate />
        </StyledIconContainer>
        <StyledContentContainer>
          <StyledHeading as="h3">Create Templates</StyledHeading>
          <StyledText>
            No more typing the same content over again for each flyer posting.
            With templates you can post in one click.
          </StyledText>
        </StyledContentContainer>
      </StyledArticleContainer>

      <StyledArticleContainer>
        <StyledIconContainer>
          <HiOutlineComputerDesktop />
        </StyledIconContainer>
        <StyledContentContainer>
          <StyledHeading as="h3">Post from Home</StyledHeading>
          <StyledText>
            Want to post somewhere, but don't have time to physically go there,
            you can post from your home.
          </StyledText>
        </StyledContentContainer>
      </StyledArticleContainer>

      <StyledArticleContainer>
        <StyledIconContainer>
          <HiOutlineBookmark />
        </StyledIconContainer>
        <StyledContentContainer>
          <StyledHeading as="h3">Save, Like, & Share flyer</StyledHeading>
          <StyledText>
            You can save flyers to your account and share them with your
            friends.
          </StyledText>
        </StyledContentContainer>
      </StyledArticleContainer>

      <StyledArticleContainer>
        <StyledIconContainer>
          <HiOutlinePhoto />
        </StyledIconContainer>
        <StyledContentContainer>
          <StyledHeading as="h3">More Image/Video Uploads</StyledHeading>
          <StyledText>
            Stand out with more Images/Videos. You have access to more uploads
            than an unregistered user.
          </StyledText>
        </StyledContentContainer>
      </StyledArticleContainer>

      {/* <StyledArticleContainer>
        <StyledIconContainer>
          <HiOutlineMap />
        </StyledIconContainer>
        <StyledContentContainer>
          <StyledHeading as="h3">Post In Bulk</StyledHeading>
          <StyledText>
            Just give us a list of places where you'd like your flyer to be
            posted, and it's done.
          </StyledText>
        </StyledContentContainer>
      </StyledArticleContainer> */}

      <StyledArticleContainer>
        <StyledIconContainer>
          <HiOutlineClock />
        </StyledIconContainer>
        <StyledContentContainer>
          <StyledHeading as="h3">Extended Flyer Lifespan</StyledHeading>
          <StyledText>
            As a registered user, you get to choose how long your flyers live
            for.
          </StyledText>
        </StyledContentContainer>
      </StyledArticleContainer>
    </StyledWhyRegisterContainer>
  );
}
