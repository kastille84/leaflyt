import styled from "styled-components";
import {
  DB_Flyers_Response,
  DB_Template,
  FlyerDesign,
} from "../../../interfaces/DB_Flyers";
import { useEffect, useState } from "react";
import Heading from "../../Heading";
import {
  determineIsFullFlyer,
  shortenTitle,
} from "../../../utils/GeneralUtils";

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
  flex-wrap: wrap;
`;

const StyledTag = styled.small<{ flyerDesign: FlyerDesign }>`
  text-transform: capitalize;
  word-break: break-all;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1rem;
  color: ${({ flyerDesign }) => flyerDesign.tags.color};
`;

const StyledContentContainer = styled.div`
  & ol,
  & ul {
    padding-left: 2.5rem;
  }
`;

export default function Content({
  flyer,
  flyerStyles,
}: {
  flyer: DB_Flyers_Response | DB_Template;
  flyerStyles: FlyerDesign;
}) {
  const [isReadMore, setIsReadMore] = useState(() => {
    if (determineIsFullFlyer()) {
      return true;
    }
    return false;
  });

  return (
    <>
      <StyledSubcategory flyerDesign={flyerStyles}>
        {flyer.subcategory}
      </StyledSubcategory>
      <StyledHeading as="h2" flyerDesign={flyerStyles}>
        {determineIsFullFlyer() ? flyer.title : shortenTitle(flyer.title, 33)}
      </StyledHeading>
      {!isReadMore && (
        <StyledContentContainer
          dangerouslySetInnerHTML={{
            __html: shortenTitle(flyer.content, 75),
          }}
        ></StyledContentContainer>
      )}
      {isReadMore && (
        <StyledContentContainer
          dangerouslySetInnerHTML={{ __html: flyer.content }}
        ></StyledContentContainer>
      )}
      {!determineIsFullFlyer() && flyer.content.length > 75 && (
        <StyledReadMore
          flyerDesign={flyerStyles}
          onClick={() => setIsReadMore(!isReadMore)}
        >
          {isReadMore ? "Read less" : "Read more"}
        </StyledReadMore>
      )}
      <StyledTagContainer>
        {flyer.tags &&
          flyer.tags.map((tag) => (
            <StyledTag flyerDesign={flyerStyles} key={tag}>
              {`#${tag}`}&nbsp;
            </StyledTag>
          ))}
      </StyledTagContainer>
    </>
  );
}
