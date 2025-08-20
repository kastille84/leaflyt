import styled from "styled-components";
import { DB_Flyers_Response } from "../../../interfaces/DB_Flyers";
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
`;
export default function CTA({ flyer }: { flyer: DB_Flyers_Response }) {
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

      {flyer.callToAction?.ctaType === "offer" && (
        <StyledRedeemContainer>
          <small>
            Only press button once your offer has been redeemed. You can only
            redeem this offer once per flyer.
          </small>
          {/* #TODO: add redeem button functionality */}
          <Button size="small">Redeemed</Button>
        </StyledRedeemContainer>
      )}
    </>
  );
}
