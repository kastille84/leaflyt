import styled from "styled-components";
import {
  DB_Flyers_Response,
  DB_Template,
  FlyerDesign,
} from "../../../interfaces/DB_Flyers";
import {
  getContactInfoFromFlyer,
  getContactInfoFromUser,
} from "../../../utils/ServiceUtils";
import {
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlinePhone,
} from "react-icons/hi2";
import { UNREGISTERED_FLYER_DESIGN_DEFAULT } from "../../../constants";
import Heading from "../../Heading";
import { Auth_User_Profile_Response } from "../../../interfaces/Auth_User";

const StyledTile = styled.div<{ flyerDesign: FlyerDesign }>`
  padding: 2.4rem;
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  background-color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  color: ${({ flyerDesign }) => flyerDesign.top.color};
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
  border-bottom-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderBottomLeftRadius}px;
  border-bottom-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderBottomRightRadius}px;
`;

const StyledName = styled(Heading)`
  text-align: center;
  letter-spacing: 1px;
`;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const StyledLi = styled.li`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  & p {
    font-size: 1.6rem;
    letter-spacing: 0.4px;
  }
`;

const StyledWebsite = styled.a`
  text-decoration: underline;
`;

export default function Contact({
  flyer,
  user,
}: {
  flyer: DB_Flyers_Response | DB_Template;
  user?: Auth_User_Profile_Response;
}) {
  const contactInfo = user
    ? getContactInfoFromUser(user)
    : getContactInfoFromFlyer(flyer as DB_Flyers_Response);
  const flyerDesign = flyer.flyerDesign
    ? flyer.flyerDesign
    : UNREGISTERED_FLYER_DESIGN_DEFAULT;
  return (
    <>
      <StyledTile flyerDesign={flyerDesign}>
        <StyledName as="h2">
          {contactInfo.firstName
            ? `${contactInfo.firstName} ${contactInfo.lastName}`
            : contactInfo.name}
        </StyledName>
      </StyledTile>
      <StyledUl>
        {contactInfo.email && (
          <StyledLi>
            <span>
              <HiOutlineEnvelope />
            </span>
            <p>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </p>
          </StyledLi>
        )}
        {contactInfo.phone && (
          <StyledLi>
            <span>
              <HiOutlinePhone />
            </span>
            <p>
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            </p>
          </StyledLi>
        )}
        {contactInfo.website && (
          <StyledLi>
            <span>
              <HiOutlineGlobeAlt />
            </span>
            <p>
              <StyledWebsite
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactInfo.website}
              </StyledWebsite>
            </p>
          </StyledLi>
        )}
      </StyledUl>
    </>
  );
}
