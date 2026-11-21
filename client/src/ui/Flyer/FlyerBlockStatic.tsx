import styled from "styled-components";

import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineHandThumbUp,
  HiOutlineLink,
  HiOutlineShare,
} from "react-icons/hi2";
import { useEffect, useState } from "react";
import { UNREGISTERED_FLYER_DESIGN_DEFAULT } from "../../constants";
import Info from "./SubComponents/Info";
import CTA from "./SubComponents/CTA";
import Contact from "./SubComponents/Contact";
import {
  DB_Flyer_Create,
  DB_Flyer_Create_Unregistered_Business,
  DB_Flyer_Create_Unregistered_Individual,
  DB_Flyer_Create_Unregistered_Organization,
  DB_Flyers_Response,
  DB_Template,
  FlyerDesign,
} from "../../interfaces/DB_Flyers";
import ImageCarousel from "./SubComponents/ImageCarousel";
import { Auth_User_Profile_Response } from "../../interfaces/Auth_User";
import { useGlobalContext } from "../../context/GlobalContext";
import toast from "react-hot-toast";

import {
  cardStyle,
  cardRadius,
  StyledTopTextContainer,
  StyledInfoContentContainer,
  StyledActionContainer,
  StyledActionIconContainer,
  StyledAvatarContainer,
  StyledAvatar,
  StyledAvatarName,
  PillsContainer,
  Pill,
} from "./flyerBlockStyles";

const StyledFlyerBlock = styled.div<{ flyerDesign: FlyerDesign }>`
  ${cardStyle}
  ${cardRadius}
  width: 40rem;
  font-family: ${({ flyerDesign }) => flyerDesign.font};

  @media (max-width: 34em) {
    width: 100%;
  }
`;


export default function FlyerBlockStatic({
  flyer,
  redeemable = false,
  handleRedeem,
}: {
  flyer: DB_Template | DB_Flyers_Response;
  redeemable?: boolean;
  handleRedeem?: () => void;
}) {
  const { user } = useGlobalContext();
  const [flyerStyles, setFlyerStyles] = useState(() => {
    if (!flyer.flyerDesign) {
      return UNREGISTERED_FLYER_DESIGN_DEFAULT;
    }
    return flyer.flyerDesign;
  });

  useEffect(() => {
    if (flyer.flyerDesign) {
      setFlyerStyles(flyer.flyerDesign);
    }
  }, [flyer]);
  const [contentType, setContentType] = useState<"info" | "contact" | "cta">(
    "info",
  );

  function hasFiles() {
    if (flyer?.fileUrlArr?.length! >= 1) {
      return true;
    }
    return false;
  }

  function determineAvatarAndName() {
    if (!flyer.user) {
      // anonymous flyer
      switch (flyer.typeOfUser) {
        case "anonymous":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>A</StyledAvatar>
              <StyledAvatarName>Anonymous</StyledAvatarName>
            </>
          );
        case "individual":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Individual).individual
                    .name.firstName[0]
                }
              </StyledAvatar>
              <StyledAvatarName>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Individual).individual
                    .name.firstName
                }{" "}
                &nbsp;
                {
                  (flyer as DB_Flyer_Create_Unregistered_Individual).individual
                    .name.lastName
                }
              </StyledAvatarName>
            </>
          );
        case "organization":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Organization)
                    .organization.name[0]
                }
              </StyledAvatar>
              <StyledAvatarName>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Organization)
                    .organization.name
                }
              </StyledAvatarName>
            </>
          );
        case "business":
          return (
            <>
              <StyledAvatar flyerDesign={flyerStyles}>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Business).business
                    .name[0]
                }
              </StyledAvatar>
              <StyledAvatarName>
                {(flyer as DB_Flyer_Create_Unregistered_Business).business.name}
              </StyledAvatarName>
            </>
          );
      }
    } else {
      if (
        ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
          .typeOfUser === "individual"
      ) {
        return (
          <>
            <StyledAvatar flyerDesign={flyerStyles}>
              {
                (
                  (
                    (flyer as DB_Flyer_Create)
                      .user as Auth_User_Profile_Response
                  ).firstName as string
                )[0]
              }
            </StyledAvatar>
            <StyledAvatarName>
              {
                ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
                  .firstName
              }{" "}
              &nbsp;
              {
                ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
                  .lastName
              }
            </StyledAvatarName>
          </>
        );
      } else {
        return (
          <>
            <StyledAvatar flyerDesign={flyerStyles}>
              {
                (
                  (
                    (flyer as DB_Flyer_Create)
                      .user as Auth_User_Profile_Response
                  ).name as string
                )[0]
              }
            </StyledAvatar>
            <StyledAvatarName>
              {
                ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
                  .name as string
              }
            </StyledAvatarName>
          </>
        );
      }
    }
  }

  function renderTopContent() {
    return (
      <>
        <StyledAvatarContainer>
          {determineAvatarAndName()}
        </StyledAvatarContainer>
      </>
    );
  }

  function handleLinkClick() {
    // if location contains 'template' then return
    if (location.pathname.includes("template")) return;
    // copy to clipboard functionality
    navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/fullFlyer/${flyer.id}`,
    );
    toast.success("Link copied to clipboard. \nShare link with others!", {
      duration: 5000,
    });
  }

  return (
    <StyledFlyerBlock flyerDesign={flyerStyles}>
      {/* {hasFiles() && (
        <StyledImageSection flyerDesign={flyerStyles}>
          <ImageCarousel
            images={flyer.fileUrlArr || []}
            fromFlyerBlock
            bgColor={flyerStyles.top.backgroundColor}
          />
          <StyledTopImageContainer flyerDesign={flyerStyles}>
            {renderTopContent()}
          </StyledTopImageContainer>
        </StyledImageSection>
      )}
      {!hasFiles() && (
        <StyledTopTextContainer flyerDesign={flyerStyles}>
          {renderTopContent()}
        </StyledTopTextContainer>
        )} */}
      <StyledTopTextContainer flyerDesign={flyerStyles}>
        {renderTopContent()}
      </StyledTopTextContainer>
      <StyledInfoContentContainer>
        <PillsContainer>
          <Pill
            contentType={contentType}
            type="info"
            onClick={() => setContentType("info")}
          >
            main
          </Pill>

          <Pill
            contentType={contentType}
            type="contact"
            onClick={() => setContentType("contact")}
          >
            contact
          </Pill>

          {flyer.callToAction && flyer.callToAction.ctaType !== "none" && (
            <Pill
              contentType={contentType}
              type="cta"
              onClick={() => setContentType("cta")}
            >
              {flyer.callToAction?.ctaType === "offer" ? "deals" : "request"}
            </Pill>
          )}
        </PillsContainer>
        {contentType === "info" && (
          <>
            {hasFiles() && (
              <ImageCarousel
                images={flyer.fileUrlArr || []}
                fromFlyerBlock
                bgColor={flyerStyles.top.backgroundColor}
              />
            )}
            <Info flyer={flyer as DB_Template} flyerStyles={flyerStyles} />
          </>
        )}
        {contentType === "contact" && (
          <Contact flyer={flyer as DB_Template} user={user!} />
        )}
        {contentType === "cta" && (
          <CTA
            flyer={flyer as DB_Template}
            redeemable={redeemable}
            handleRedeem={handleRedeem}
          />
        )}
      </StyledInfoContentContainer>
      <StyledActionContainer flyerDesign={flyerStyles}>
        {/* <StyledActionIconContainer flyerDesign={flyerStyles}>
          <HiOutlineHandThumbUp /> <small>Likes</small>
        </StyledActionIconContainer> */}
        {flyer.hasComments && (
          <StyledActionIconContainer flyerDesign={flyerStyles}>
            <HiOutlineChatBubbleLeftEllipsis />
            <small>Comments</small>
          </StyledActionIconContainer>
        )}
        <StyledActionIconContainer
          flyerDesign={flyerStyles}
          onClick={handleLinkClick}
        >
          <HiOutlineLink /> <small> Share</small>
        </StyledActionIconContainer>
      </StyledActionContainer>
    </StyledFlyerBlock>
  );
}
