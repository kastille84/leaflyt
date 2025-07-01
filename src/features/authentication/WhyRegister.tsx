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
export default function WhyRegister() {
  return (
    <StyledWhyRegisterContainer>
      <Heading as="h2">Why Register?</Heading>
      <p>
        When you register, you have a chance to access these features based on
        your chosen tier.
      </p>
      <div>
        <Heading as="h3">Post faster via Templates</Heading>
        <p>
          No more typing the same content over again for each flyer posting.
          With templates you can post in one click.
        </p>
      </div>
      <div>
        <Heading as="h3">Post from Home</Heading>
        <p>
          If you want to post a flyer to a popular location, but don't have to
          time to physically go there, you can post from your home.
        </p>
      </div>
      <div>
        <Heading as="h3">Save, Like, & Share</Heading>
        <p>
          You can save flyers to your account and share them with your friends.
        </p>
      </div>
      <div>
        <Heading as="h3">More Image Uploads</Heading>
        <p>
          Images are important to make your flyer stand out.You have access to
          more image uploads than an unregistered user.
        </p>
      </div>
      <div>
        <Heading as="h3">Post in Bulk</Heading>
        <p>
          Just give us a list of places where you'd like your flyer to be
          posted, and it's done
        </p>
      </div>

      <div>
        <Heading as="h3">Extended Flyer Lifespan</Heading>
        <p>
          As a registered user, you get to choose how long your flyers live for.
        </p>
      </div>
    </StyledWhyRegisterContainer>
  );
}
