import styled from "styled-components";
import {
  DB_Flyers_Response,
  DB_Template,
  FlyerDesign,
} from "../../../interfaces/DB_Flyers";
import { useState } from "react";
import Heading from "../../Heading";
import { shortenTitle } from "../../../utils/GeneralUtils";

const StyledSubcategory = styled.small<{ flyerDesign: FlyerDesign }>`
  display: block;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ flyerDesign }) => flyerDesign.subcategory.color};
  margin-top: 1.4rem;
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

export default function Content({
  flyer,
  flyerStyles,
}: {
  flyer: DB_Flyers_Response | DB_Template;
  flyerStyles: FlyerDesign;
}) {
  const [isReadMore, setIsReadMore] = useState(false);

  return (
    <>
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
    </>
  );
}
