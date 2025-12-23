import styled from "styled-components";
import { DB_Flyers_Response, DB_Template } from "../../../interfaces/DB_Flyers";
import Heading from "../../Heading";
import Button from "../../Button";

const StyledTile = styled.div`
  padding: 2.4rem;
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  background-color: var(--color-red-600);
  color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;
const StyledHeadline = styled(Heading)`
  text-align: center;
  letter-spacing: 1px;
`;

const StyledRedeemContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  & small {
    /* text-align: center; */
    color: var(--color-brand-600);
  }
`;
export default function CTA({
  flyer,
  redeemable = false,
  handleRedeem,
  belongsToUser = false,
}: {
  flyer: DB_Flyers_Response | DB_Template;
  redeemable?: boolean;
  handleRedeem?: Function;
  belongsToUser?: boolean;
}) {
  return (
    <>
      <StyledTile>
        <StyledHeadline as="h2">{flyer.callToAction?.headline}</StyledHeadline>
      </StyledTile>

      {flyer.callToAction?.instructions && (
        <div
          dangerouslySetInnerHTML={{ __html: flyer.callToAction?.instructions }}
        ></div>
      )}

      {flyer.callToAction?.ctaType === "offer" &&
        redeemable &&
        handleRedeem && (
          <StyledRedeemContainer>
            <small>
              If redeeming in person, then the person offering the deal can
              press redeem. <br />
              If redeeming online, then the person redeeming the deal can press
              redeem.
            </small>
            {/* #TODO: add redeem button functionality */}
            <Button size="medium" onClick={() => handleRedeem()}>
              Redeem
            </Button>
          </StyledRedeemContainer>
        )}
      {flyer.callToAction?.ctaType === "offer" &&
        !redeemable &&
        !belongsToUser && (
          <StyledRedeemContainer>
            <small>
              Click on Save below to save this offer and redeem later. <br />
              Only one offer per flyer.
            </small>
          </StyledRedeemContainer>
        )}
    </>
  );
}
