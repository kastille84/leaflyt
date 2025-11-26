import styled, { css } from "styled-components";

import {
  HiOutlineBookmark,
  HiOutlineBookmarkSlash,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlineShare,
} from "react-icons/hi2";
import { useState } from "react";
import {
  UNREGISTERED_FLYER_DESIGN_DEFAULT,
  REGISTERED_FLYER_DESIGN_DEFAULT,
} from "../../constants";
import Info from "./SubComponents/Info";
import CTA from "./SubComponents/CTA";
import Contact from "./SubComponents/Contact";
import {
  DB_Flyer_Create,
  DB_Flyer_Create_Unregistered_Business,
  DB_Flyer_Create_Unregistered_Individual,
  DB_Flyer_Create_Unregistered_Organization,
  DB_Flyers_Response,
  FlyerDesign,
} from "../../interfaces/DB_Flyers";
import ImageCarousel from "./SubComponents/ImageCarousel";
import { Auth_User_Profile_Response } from "../../interfaces/Auth_User";
import DropdownMenu from "../DropdownMenu";
import { useGlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import useCreateUnregisteredFlyer from "../../features/createFlyer/useCreateUnregisteredFlyer";
import toast from "react-hot-toast";
import {
  checkIfCurrentFlyerIsSaved,
  checkIfCurrentFlyerIsLiked,
} from "../../utils/GeneralUtils";
import { useSessionStorageState } from "../../hooks/useSessionStorageState";

const common = {
  style: css`
    box-shadow: var(--shadow-sm);
    &:hover {
      box-shadow: var(--shadow-lg);
    }

    width: 40rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 2.4rem;
  `,
};

const StyledFlyerBlock = styled.div<{ flyerDesign: FlyerDesign }>`
  ${common.style}
  font-family: ${({ flyerDesign }) => flyerDesign.font};
  border: 1px solid var(--color-grey-200);
  /* border: 1px solid ${(props) => props.flyerDesign.outlines.color}; */
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
  border-bottom-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderBottomLeftRadius}px;
  border-bottom-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderBottomRightRadius}px;
`;

const StyledImageSection = styled.figure<{ flyerDesign: FlyerDesign }>`
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
`;

const StyledTopImageContainer = styled.div<{ flyerDesign: FlyerDesign }>`
  background-color: ${(props) => props.flyerDesign.top.backgroundColor};
  position: absolute;
  top: 0;

  opacity: 0.85;
  color: ${(props) => props.flyerDesign.top.color};
  width: 100%;
  padding: 1rem 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
`;
const StyledTopTextContainer = styled.div<{ flyerDesign: FlyerDesign }>`
  width: 100%;
  padding: 1rem 2.4rem;
  background-color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  color: ${({ flyerDesign }) => flyerDesign.top.color};
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid var(--color-grey-200);
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;
`;

const StyledinfoContentContainer = styled.div`
  padding: 1rem 2.4rem;
  font-size: 1.4rem;
`;

const StyledActionContainer = styled.section`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2.4rem;
  border-top: 1px solid var(--color-grey-200);
  padding: 1rem 2.4rem;
`;

const StyledActionIconContainer = styled.div<{ flyerDesign: FlyerDesign }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  & svg {
    color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  }
`;

const StyledAvatarContainer = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;
const StyledAvatar = styled.div<{ flyerDesign: FlyerDesign }>`
  background-color: ${({ flyerDesign }) => flyerDesign.top.color};
  /* opacity: 0.65; */
  color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  width: 35px;
  height: 35px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;

const PillsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
`;
const pillStyle = {
  infoOutline: css`
    background-color: var(--color-grey-50);
    color: var(--color-brand-600);
    border: 1px solid var(--color-brand-600);
  `,
  info: css`
    background-color: var(--color-brand-600);
    color: var(--color-grey-50);
    border: 1px solid var(--color-brand-600);
  `,
  contactOutline: css`
    background-color: var(--color-grey-50);
    color: var(--color-brand-600);
    border: 1px solid var(--color-brand-600);
  `,
  contact: css`
    background-color: var(--color-brand-600);
    color: var(--color-grey-50);
    border: 1px solid var(--color-brand-600);
  `,
  ctaOutline: css`
    background-color: var(--color-grey-50);
    color: var(--color-red-600);
    border: 1px solid var(--color-red-600);
  `,
  cta: css`
    background-color: var(--color-red-600);
    color: var(--color-grey-50);
    border: 1px solid var(--color-red-600);
  `,
};
const Pill = styled.div<{
  contentType: "info" | "contact" | "cta";
  type: "info" | "contact" | "cta";
}>`
  ${({ contentType, type }) =>
    contentType === type ? pillStyle[type] : pillStyle[`${type}Outline`]}
  padding: 0.05rem 0.8rem;
  border-radius: 10px;
  letter-spacing: 1.2px;
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  ${({ type }) =>
    type === "cta" &&
    css`
      animation: pulse 5s infinite;
      /* transition: all 1.4s; */

      @keyframes pulse {
        0% {
          transform: scale(1) rotate(3deg);
        }
        2% {
          transform: scale(1.1) rotate(-3deg);

          ${pillStyle[type]}
        }
        4% {
          transform: scale(1.1) rotate(3deg);
        }
        6% {
          transform: scale(1.1) rotate(-3deg);
        }
        8% {
          transform: scale(1.1) rotate(3deg);
        }
        10% {
          transform: scale(1) rotate(0deg);
        }
      }
    `}
`;

export default function FlyerBlockInteractive({
  flyer,
}: {
  flyer: DB_Flyers_Response;
}) {
  const [flyerStyles, setFlyerStyles] = useState(() => {
    if (!flyer.flyerDesign) {
      return UNREGISTERED_FLYER_DESIGN_DEFAULT;
    }
    return flyer.flyerDesign;
  });

  const {
    setSelectedFlyer,
    setShowEditFlyerModal,
    user,
    setUser,
    setIsOpenFlyerDrawer,
    setDrawerAction,
    setShowDeleteFlyerTemplateModal,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
  } = useGlobalContext();

  const { likeFlyerFn } = useCreateUnregisteredFlyer();

  const [contentType, setContentType] = useState<"info" | "contact" | "cta">(
    "info"
  );
  const { saveFlyerFn, removeSavedFlyerFn } = useRegisteredFlyer();
  const [currentLikes, setCurrentLikes] = useState(() => flyer?.likes || 0);

  const [likedSessionFlyers, setLikedSessionFlyers] = useSessionStorageState(
    [],
    "likedFlyers"
  );

  // isSaved state depends on saved flyers on user object
  const [isSaved, setIsSaved] = useState(() => {
    const saved_flyers_arr = user?.saved_flyers! || [];
    return checkIfCurrentFlyerIsSaved(saved_flyers_arr, flyer);
  });
  // isLiked state depends on likedSessionFlyers object
  const [isLikedByUser, setIsLikedByUser] = useState(() => {
    return checkIfCurrentFlyerIsLiked(likedSessionFlyers, flyer.id!);
  });

  const navigate = useNavigate();

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
              <div>Anonymous</div>
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
              <div>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Individual).individual
                    .name.firstName
                }{" "}
                &nbsp;
                {
                  (flyer as DB_Flyer_Create_Unregistered_Individual).individual
                    .name.lastName
                }
              </div>
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
              <div>
                {
                  (flyer as DB_Flyer_Create_Unregistered_Organization)
                    .organization.name
                }
              </div>
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
              <div>
                {(flyer as DB_Flyer_Create_Unregistered_Business).business.name}
              </div>
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
            <div>
              {
                ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
                  .firstName
              }{" "}
              &nbsp;
              {
                ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
                  .lastName
              }
            </div>
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
            <div>
              {
                ((flyer as DB_Flyer_Create).user as Auth_User_Profile_Response)
                  .name as string
              }
            </div>
          </>
        );
      }
    }
  }

  function handleEditClick() {
    setSelectedFlyer(flyer);
    if (flyer.template) {
      setShowEditFlyerModal(true);
    } else {
      setIsOpenFlyerDrawer(true);
      setDrawerAction("edit");
    }
  }

  function handleDelete() {
    setSelectedFlyer(flyer);
    setShowDeleteFlyerTemplateModal(true);
  }

  async function handleSaveClick() {
    if (user) {
      setIsSaved(true);
      saveFlyerFn(flyer.id!, {
        onSuccess: ({ user }) => {
          // update the user
          setUser(user);
          toast.success("Flyer saved!");
        },
        onError: (err) => {
          setIsSaved(false);
          toast.error("Flyer save failed! Try again.");
        },
      });
    } else {
      setBottomSlideInType("signup");
      setIsOpenBottomSlideIn(true);
    }
  }

  async function handleUnsaveClick() {
    if (user) {
      setIsSaved(false);
      removeSavedFlyerFn(flyer.id!, {
        onSuccess: ({ user }) => {
          // update the user
          setUser(user);
          toast.success("Flyer unsaved!");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
  }
  function doesFlyerBelongToUser() {
    if (user && (flyer.user as Auth_User_Profile_Response)?.id === user?.id) {
      return true;
    }
    return false;
  }

  async function handleLikeClick() {
    // only if flyer does not belongs to the user & isn't already liked by user
    if (!doesFlyerBelongToUser() && !isLikedByUser) {
      likeFlyerFn(
        { flyer, type: "inc" },
        {
          onSuccess: ({ newLikes }) => {
            // save the liked flyer in the session
            setLikedSessionFlyers((prev: string[]) => [...prev, flyer.id]);
            setIsLikedByUser(true);
            setCurrentLikes(newLikes);
            toast.success("Flyer liked!");
          },
          onError: (error) => {
            setIsLikedByUser(false);
            toast.error(error.message);
          },
        }
      );
    } else if (!doesFlyerBelongToUser() && isLikedByUser) {
      // unlike the flyer
      likeFlyerFn(
        { flyer, type: "dec" },
        {
          onSuccess: ({ newLikes }) => {
            setLikedSessionFlyers((prev: string[]) =>
              prev.filter((id) => id !== flyer.id)
            );
            setIsLikedByUser(false);
            setCurrentLikes(newLikes);
            toast.success("Flyer unliked!");
          },
          onError: (error) => {
            setIsLikedByUser(true);
            toast.error(error.message);
          },
        }
      );
    }
  }

  function renderTopContent() {
    return (
      <>
        <StyledAvatarContainer>
          {determineAvatarAndName()}
        </StyledAvatarContainer>
        <DropdownMenu>
          {doesFlyerBelongToUser() && <li onClick={handleEditClick}>Edit</li>}
          {doesFlyerBelongToUser() && flyer.template && (
            <li onClick={() => navigate(`/dashboard/my-templates`)}>
              View Template
            </li>
          )}
          {user && !doesFlyerBelongToUser() && <li>Save</li>}
          <hr />
          {doesFlyerBelongToUser() && flyer.template && (
            <li onClick={handleDelete}>Delete</li>
          )}
          <li>Inappropriate</li>
        </DropdownMenu>
      </>
    );
  }

  return (
    <StyledFlyerBlock flyerDesign={flyerStyles}>
      {hasFiles() && (
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
      )}
      <StyledinfoContentContainer>
        <PillsContainer>
          <Pill
            contentType={contentType}
            type="info"
            onClick={() => setContentType("info")}
          >
            main
          </Pill>
          {flyer.typeOfUser !== "anonymous" && (
            <Pill
              contentType={contentType}
              type="contact"
              onClick={() => setContentType("contact")}
            >
              contact
            </Pill>
          )}
          {flyer.callToAction && (
            <Pill
              contentType={contentType}
              type="cta"
              onClick={() => setContentType("cta")}
            >
              {flyer.callToAction?.ctaType === "offer" ? "deals" : "ask"}
            </Pill>
          )}
        </PillsContainer>
        {contentType === "info" && (
          <Info flyer={flyer} flyerStyles={flyerStyles} />
        )}
        {contentType === "contact" && <Contact flyer={flyer} />}
        {contentType === "cta" && <CTA flyer={flyer} />}
      </StyledinfoContentContainer>
      <StyledActionContainer>
        {!isSaved && !doesFlyerBelongToUser() && (
          <StyledActionIconContainer
            flyerDesign={flyerStyles}
            onClick={handleSaveClick}
          >
            <HiOutlineBookmark /> <small>Save</small>
          </StyledActionIconContainer>
        )}

        {isSaved && !doesFlyerBelongToUser() && (
          <StyledActionIconContainer
            flyerDesign={flyerStyles}
            onClick={handleUnsaveClick}
          >
            <HiOutlineBookmarkSlash /> <small>Unsave</small>
          </StyledActionIconContainer>
        )}
        <StyledActionIconContainer
          flyerDesign={flyerStyles}
          onClick={handleLikeClick}
        >
          <HiOutlineHandThumbUp />
          <small>{currentLikes! > 0 ? currentLikes : ""} Likes</small>
        </StyledActionIconContainer>
        {/* <StyledActionIconContainer flyerDesign={flyerStyles}>
          <HiOutlineChatBubbleLeftEllipsis />
        </StyledActionIconContainer> */}
        <StyledActionIconContainer flyerDesign={flyerStyles}>
          <HiOutlineShare /> <small>Share</small>
        </StyledActionIconContainer>
      </StyledActionContainer>
    </StyledFlyerBlock>
  );
}
