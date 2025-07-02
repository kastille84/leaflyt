import styled from "styled-components";
import Heading from "../../ui/Heading";

const StyledWhyRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem;
  /* border: 1px solid var(--color-grey-100); */
  background-color: var(--color-brand-100);
`;
const StyledText = styled.p`
  font-size: 1.6rem;
  line-height: 1.4;
`;
export default function WhyRegister() {
  return (
    <StyledWhyRegisterContainer>
      <div>
        <Heading as="h2">Why Register?</Heading>
        <StyledText>
          When you register, you have a chance to access these features based on
          your chosen tier.
        </StyledText>
      </div>
      <div>
        <Heading as="h3">Post Faster Using Templates</Heading>
        <StyledText>
          No more typing the same content over again for each flyer posting.
          With templates you can post in one click.
        </StyledText>
      </div>
      <div>
        <Heading as="h3">Post from Home</Heading>
        <StyledText>
          Want to post somewhere, but don't have time to physically go there,
          you can post from your home.
        </StyledText>
      </div>
      <div>
        <Heading as="h3">Save, Like, & Share</Heading>
        <StyledText>
          You can save flyers to your account and share them with your friends.
        </StyledText>
      </div>
      <div>
        <Heading as="h3">More Image Uploads</Heading>
        <StyledText>
          Stand out with more Images. You have access to more image uploads than
          an unregistered user.
        </StyledText>
      </div>
      <div>
        <Heading as="h3">Post In Bulk</Heading>
        <StyledText>
          Just give us a list of places where you'd like your flyer to be
          posted, and it's done.
        </StyledText>
      </div>

      <div>
        <Heading as="h3">Extended Flyer Lifespan</Heading>
        <StyledText>
          As a registered user, you get to choose how long your flyers live for.
        </StyledText>
      </div>
    </StyledWhyRegisterContainer>
  );
}
