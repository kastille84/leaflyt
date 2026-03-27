import styled from "styled-components";
import Heading from "../ui/Heading";
import FaqItem from "../ui/FaqItem";

const StyledMain = styled.main`
  background-color: #fff;
`;
const StyledMainSection = styled.section`
  padding: 4rem 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.2rem;
  min-height: 500px;
`;

export default function Faq() {
  return (
    <StyledMain>
      <StyledMainSection>
        <Heading as={"h1"} style={{ textAlign: "center" }}>
          Frequently Asked Questions
        </Heading>
        <Heading as={"h2"} style={{ textAlign: "center" }}>
          You've got questions, we've got answers. Here are some of our FAQs.{" "}
          <br />
          If you don't see your question here, feel free to reach out to our
          support team at{" "}
          <a
            href="mailto:support@Leaflit.us"
            style={{
              textDecoration: "underline",
              color: "var(--color-brand-600)",
            }}
          >
            Support@Leaflit.us
          </a>
        </Heading>
        <Heading as={"h3"} style={{ textAlign: "center" }}>
          General Questions
        </Heading>
        <FaqItem
          question="What is Leaflit?"
          answer="Leaflit is a platform that helps you create virtual flyers and post them on virtual community boards that are placed at any public establishment. With Leaflit, you can easily create and share your message with your local community, without the hassle of printing and distributing physical flyers."
        />
        <FaqItem
          question="How does Leaflit work?"
          answer="Leaflit allows you to create virtual flyers using our easy-to-use flyer template builder. Once you've created your flyer, you can post it on our virtual community boards, which are placed at various public establishments. Your flyer will be visible to anyone who visits the establishment, and they can interact with it by clicking on it to learn more or share it with their friends."
        />
        <FaqItem
          question="Is Leaflit free to use?"
          answer="Leaflit offers a free plan that allows you to create and post flyers on our virtual community boards. We also offer premium plans with additional features and benefits. You can check out our pricing page for more information on our plans and pricing."
        />
        <FaqItem
          question="Can I post without creating an account?"
          answer="Yes, you can create and post flyers without creating an account. However, creating an account allows you to save your flyers, track their performance, and access additional features."
        />
        <Heading as={"h3"} style={{ textAlign: "center" }}>
          Who can use Leaflit?
        </Heading>
        <FaqItem
          question="Do I need to have a business to use Leaflit?"
          answer="No! Leaflit is perfect for individuals, community groups, and businesses alike. Whether you're promoting a garage sale, a lost pet, a community event, or your business, Leaflit makes it easy to create and share your message with your local community."
        />
        <FaqItem
          question="Can I use Leaflit for personal purposes?"
          answer="Yes! Leaflit is perfect for individuals looking to share their message with their local community. Whether you're promoting a garage sale, a lost pet, or a community event, Leaflit makes it easy to create and share your message with your neighbors."
        />
        <FaqItem
          question="Can I use Leaflit for business purposes?"
          answer="Yes! Leaflit is perfect for businesses looking to promote their products or services. You can create eye-catching flyers that will grab the attention of your local community and help you spread the word about your business."
        />
        <FaqItem
          question="Can I post flyers for events or promotions?"
          answer="Yes! Leaflit is perfect for promoting events, sales, and other promotions. You can create eye-catching flyers that will grab the attention of your local community and help you spread the word about your event or promotion."
        />
        <Heading as={"h3"} style={{ textAlign: "center" }}>
          Virtual Community Boards and Posting Questions
        </Heading>
        <FaqItem
          question="How long do my flyers stay on the virtual community boards?"
          answer="Your have a say in how long your flyers stay on the virtual community boards. You can choose the flyer's lifespan when you create it. By default, flyers have a lifespan of 1 week, but with a premium plan, you can choose up to 4 weeks. Once the lifespan of your flyer is over, it will be automatically removed from the virtual community boards. There is a balance to be struck between keeping your flyer visible for a long time and keeping the virtual community boards fresh and engaging for users. We recommend choosing a lifespan that is appropriate for the content of your flyer and the frequency of new flyers being posted on the virtual community boards."
        />
        <FaqItem
          question="On-Location posting: Do I need to be physically present at the location to post a flyer?"
          answer="Yes! You can go to any physical establishment (high foot-traffic/ low foot-traffic) post your flyer directly from your device, i.e phone, tablet, or laptop. This allows you to easily share your message with the local community and reach people who are already in the area."
        />
        <FaqItem
          question="Remote Posting: Can I post flyers for locations I'm not physically present at?"
          answer="Yes! With Leaflit, once you're registered and logged in, you can post flyers for locations you're not physically present at. This allows you to reach a wider audience and promote your message in areas that might be difficult to access otherwise."
        />
        <FaqItem
          question="Can I edit or delete my flyers after posting them?"
          answer="Yes! With Leaflit, you can easily edit or delete your flyers at any time. Simply log in to your account, go to your flyer, and select edit or delete. You can make changes to the flyer or remove it from the virtual community boards as needed."
        />
        <FaqItem
          question="Can I target specific locations with my flyers?"
          answer="Yes! With Leaflit, you can choose which virtual community boards you want to post your flyers on. This allows you to target specific locations and audiences with your message."
        />
        <FaqItem
          question="Can I track the performance of my flyers?"
          answer="Yes! Leaflit provides analytics and insights on the performance of your flyers, including how many people have liked your flyer. This allows you to see how effective your flyers are and make adjustments as needed. Views and Interactions analytics are coming soon!"
        />
        <FaqItem
          question="How do I get started with Leaflit?"
          answer="Getting started with Leaflit is easy! Simply sign up for an account, create your flyer using our template builder, and post it on our virtual community boards. You can also check out our help center for more information and tutorials on how to use Leaflit."
        />
      </StyledMainSection>
    </StyledMain>
  );
}
