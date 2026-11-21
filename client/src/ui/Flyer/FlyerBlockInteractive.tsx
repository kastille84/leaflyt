import styled from "styled-components";
import { Tooltip } from "react-tooltip";

import {
  HiOutlineArrowsPointingIn,
  HiOutlineArrowsPointingOut,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBolt,
  HiOutlineBookmark,
  HiOutlineBookmarkSlash,
  HiOutlineCheckBadge,
  HiOutlineFire,
  HiOutlineFlag,
  HiOutlineHandThumbUp,
  HiOutlineLink,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlinePencilSquare,
  HiOutlineShieldCheck,
  HiOutlineTrash,
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
  FlyerDesign,
} from "../../interfaces/DB_Flyers";
import ImageCarousel from "./SubComponents/ImageCarousel";
import { Auth_User_Profile_Response } from "../../interfaces/Auth_User";
import DropdownMenu, {
  DropdownMenuDivider,
  DropdownMenuItem,
} from "../DropdownMenu";
import { useGlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import useCreateUnregisteredFlyer from "../../features/createFlyer/useCreateUnregisteredFlyer";
import toast from "react-hot-toast";
import {
  checkIfCurrentFlyerIsSaved,
  checkIfCurrentFlyerIsLiked,
} from "../../utils/FlyerUtils";
import { useLikeFlyers } from "../../hooks/useLikeFlyers";
import { determineIsFullFlyer } from "../../utils/GeneralUtils";

import {
  cardStyle,
  cardRadius,
  StyledTopTextContainer,
  StyledInfoContentContainer,
  StyledActionContainer,
  StyledActionIconContainer,
  StyledAvatarContainer as BaseAvatarContainer,
  StyledAvatar,
  StyledAvatarName,
  PillsContainer,
  Pill,
} from "./flyerBlockStyles";

const StyledAvatarContainer = styled(BaseAvatarContainer)`
  & svg {
    cursor: pointer;
  }
`;

const StyledFlyerBlock = styled.div<{
  flyerDesign: FlyerDesign;
  isFullFlyer: boolean;
  isListView?: boolean;
}>`
  ${cardStyle}
  ${cardRadius}
  width: ${({ isListView, isFullFlyer }) =>
    isListView ? "100%" : isFullFlyer ? "50rem" : "40rem"};
  max-width: 100%;
  font-family: ${({ flyerDesign }) => flyerDesign.font};
  margin-bottom: 2.4rem;

  @media (max-width: 59em) {
    margin: 0 auto 2.4rem auto;
  }

  @media (max-width: 44em) {
    ${({ isFullFlyer, isListView }) =>
      (isFullFlyer || isListView) && "width: 100%;"}
  }
`;

const StyledActionSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledBadgeSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 1.2rem;

  & svg {
    font-size: 1.8rem;
    padding: 0.3rem;
    box-sizing: content-box;
    border-radius: 100%;
    background-color: var(--color-brand-0);
    color: var(--color-brand-600);
    cursor: pointer;
  }
  & .fire {
    background-color: var(--color-orange-100);
    color: var(--color-orange-600);
  }
`;

export default function FlyerBlockInteractive({
  flyer,
  listView = false,
}: {
  flyer: DB_Flyers_Response;
  listView?: boolean;
}) {
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
  }, [flyer.flyerDesign]);

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
    likedContextSessionFlyers,
    setShowFlaggedModal,
    setShowDcmaModal,
  } = useGlobalContext();

  const { likeFlyerFn } = useCreateUnregisteredFlyer();

  const [contentType, setContentType] = useState<"info" | "contact" | "cta">(
    "info",
  );
  const { saveFlyerFn, removeSavedFlyerFn } = useRegisteredFlyer();
  const [currentLikes, setCurrentLikes] = useState(() => flyer?.likes || 0);

  const { setLikedFlyer } = useLikeFlyers(flyer.id!);

  // isSaved state depends on saved flyers on user object
  const [isSaved, setIsSaved] = useState(() => {
    const saved_flyers_arr = user?.saved_flyers! || [];
    return checkIfCurrentFlyerIsSaved(saved_flyers_arr, flyer);
  });
  // isLiked state depends on likedSessionFlyers object
  const [isLikedByUser, setIsLikedByUser] = useState(() => {
    return checkIfCurrentFlyerIsLiked(
      likedContextSessionFlyers || [],
      flyer.id!,
    );
  });

  // check saved if user was null then auto logged in
  useEffect(() => {
    if (user) {
      setIsSaved(checkIfCurrentFlyerIsSaved(user?.saved_flyers!, flyer));
    }
  }, [user]);

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
            {(flyer?.user as Auth_User_Profile_Response) && (
              <HiOutlineShieldCheck data-tooltip-id="verified" />
            )}
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
            {(flyer?.user as Auth_User_Profile_Response) && (
              <HiOutlineShieldCheck data-tooltip-id="verified" />
            )}
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

  function handleInappropriate() {
    setShowFlaggedModal(true);
    setSelectedFlyer(flyer);
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
        onError: () => {
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
      removeSavedFlyerFn(
        { flyerId: flyer.id!, type: "flyer" },
        {
          onSuccess: ({ user }) => {
            // update the user
            setUser(user);
            toast.success("Flyer unsaved!");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
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
            // setLikedSessionFlyers((prev: string[]) => [...prev, flyer.id]);
            setLikedFlyer("add");
            setIsLikedByUser(true);
            setCurrentLikes(newLikes);
            toast.success("Flyer liked!");
          },
          onError: (error) => {
            setIsLikedByUser(false);
            toast.error(error.message);
          },
        },
      );
    } else if (!doesFlyerBelongToUser() && isLikedByUser) {
      // unlike the flyer
      likeFlyerFn(
        { flyer, type: "dec" },
        {
          onSuccess: ({ newLikes }) => {
            // setLikedSessionFlyers((prev: string[]) =>
            //   prev.filter((id) => id !== flyer.id)
            // );
            setLikedFlyer("remove");
            setIsLikedByUser(false);
            setCurrentLikes(newLikes);
            toast.success("Flyer unliked!");
          },
          onError: (error) => {
            setIsLikedByUser(true);
            toast.error(error.message);
          },
        },
      );
    }
  }

  function handleLinkClick() {
    // copy to clipboard functionality
    navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/fullFlyer/${flyer.id}`,
    );
    toast.success("Link copied to clipboard. \nShare link with others!", {
      duration: 5000,
    });
  }

  function handleCommentsClick() {
    if (!flyer.hasComments) return;
    setSelectedFlyer(flyer);
    setBottomSlideInType("comments");
    setIsOpenBottomSlideIn(true);
  }

  function handleCopyright() {
    setShowDcmaModal(true);
  }

  function handleViewFullFlyer() {
    navigate(`/dashboard/fullFlyer/${flyer.id}`);
  }

  function renderTopContent() {
    return (
      <>
        <StyledAvatarContainer>
          {determineAvatarAndName()}
        </StyledAvatarContainer>
        <DropdownMenu>
          <DropdownMenuItem onClick={handleViewFullFlyer}>
            <HiOutlineArrowTopRightOnSquare /> View Full Flyer
          </DropdownMenuItem>
          {doesFlyerBelongToUser() && (
            <DropdownMenuItem onClick={handleEditClick}>
              <HiOutlinePencilSquare /> Edit
            </DropdownMenuItem>
          )}
          {doesFlyerBelongToUser() && flyer.template && (
            <DropdownMenuItem onClick={() => navigate(`/dashboard/templates`)}>
              <HiOutlineArrowTopRightOnSquare /> View Template
            </DropdownMenuItem>
          )}
          {doesFlyerBelongToUser() && (
            <>
              <DropdownMenuDivider />
              <DropdownMenuItem $danger onClick={handleDelete}>
                <HiOutlineTrash /> Delete
              </DropdownMenuItem>
            </>
          )}
          {!doesFlyerBelongToUser() && (
            <>
              <DropdownMenuDivider />
              <DropdownMenuItem onClick={handleInappropriate}>
                <HiOutlineFlag /> Inappropriate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyright}>
                &copy; &nbsp; Copyright
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenu>
      </>
    );
  }

  return (
    <StyledFlyerBlock
      flyerDesign={flyerStyles}
      isFullFlyer={determineIsFullFlyer()}
      isListView={listView}
    >
      <StyledTopTextContainer flyerDesign={flyerStyles}>
        {renderTopContent()}
      </StyledTopTextContainer>
      <StyledInfoContentContainer>
        <StyledActionSection>
          <StyledBadgeSection>
            {(flyer?.user as Auth_User_Profile_Response)?.pioneer && (
              <HiOutlineCheckBadge data-tooltip-id="pioneer" />
            )}
            {(flyer?.user as Auth_User_Profile_Response)?.powerUser && (
              <HiOutlineBolt data-tooltip-id="powerUser" />
            )}
            {(flyer?.likes || 0) > 5 && (
              <HiOutlineFire className="fire" data-tooltip-id="fire" />
            )}
          </StyledBadgeSection>
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
            {flyer.callToAction && flyer.callToAction.ctaType !== "none" && (
              <Pill
                contentType={contentType}
                type="cta"
                onClick={() => setContentType("cta")}
              >
                {flyer.callToAction?.ctaType === "offer" ? "deals" : "request"}
              </Pill>
            )}
            {determineIsFullFlyer() ? (
              <HiOutlineArrowsPointingIn
                style={{
                  cursor: "pointer",
                  color: flyerStyles.top.backgroundColor,
                }}
                onClick={() => navigate(-1)}
              />
            ) : (
              <HiOutlineArrowsPointingOut
                style={{
                  cursor: "pointer",
                  color: flyerStyles.top.backgroundColor,
                }}
                onClick={handleViewFullFlyer}
              />
            )}
          </PillsContainer>
        </StyledActionSection>
        {contentType === "info" && (
          <>
            {hasFiles() && (
              <ImageCarousel
                images={flyer.fileUrlArr || []}
                fromFlyerBlock
                bgColor={flyerStyles.top.backgroundColor}
              />
            )}
            <Info flyer={flyer} flyerStyles={flyerStyles} />
          </>
        )}
        {contentType === "contact" && <Contact flyer={flyer} />}
        {contentType === "cta" && (
          <CTA flyer={flyer} belongsToUser={doesFlyerBelongToUser()} />
        )}
      </StyledInfoContentContainer>
      <StyledActionContainer flyerDesign={flyerStyles}>
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
        {flyer.hasComments && (
          <StyledActionIconContainer
            flyerDesign={flyerStyles}
            onClick={handleCommentsClick}
          >
            <HiOutlineChatBubbleLeftEllipsis />
            <small>Comments</small>
          </StyledActionIconContainer>
        )}
        <StyledActionIconContainer
          flyerDesign={flyerStyles}
          onClick={handleLinkClick}
        >
          <HiOutlineLink /> <small>Share</small>
        </StyledActionIconContainer>
      </StyledActionContainer>
      <Tooltip
        id="verified"
        place="top"
        content="Registered Users who have been verified by us"
        openOnClick={true}
        variant="info"
      />
      <Tooltip
        id="powerUser"
        place="bottom"
        content="Power Users badge: 15 or more flyers"
        openOnClick={true}
        variant="info"
      />
      <Tooltip
        id="pioneer"
        place="bottom"
        content="Early Pioneer who helped establish Leaflit in this community"
        openOnClick={true}
        variant="info"
      />
      <Tooltip
        id="fire"
        place="bottom"
        content="Flyers with 5 or more likes"
        openOnClick={true}
        variant="info"
      />
    </StyledFlyerBlock>
  );
}
