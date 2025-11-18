import styled from "styled-components";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { DB_Saved_Flyers } from "../../interfaces/DB_Flyers";
import { useGlobalContext } from "../../context/GlobalContext";
import FlyerBlockStatic from "../../ui/Flyer/FlyerBlockStatic";
import { HiOutlinePencilSquare, HiOutlineXMark } from "react-icons/hi2";
import Heading from "../../ui/Heading";
import { useEffect } from "react";
import { DB_Flyers_Response } from "../../interfaces/DB_Flyers";
// import { groupFlyersToSavedFlyerss } from "../../utils/GeneralUtils";

const StyledSavedFlyersListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
  padding-bottom: 2.4rem;
`;

const StyledSavedFlyersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2.4rem;
  align-items: center;
`;

const StyledActionContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-between;

  & svg {
    color: var(--color-brand-700);
    font-size: 2rem;
    cursor: pointer;
  }
  & svg:hover {
    color: var(--color-blue-400);
  }
`;

const StyledSmall = styled.small`
  color: var(--color-orange-600);
  text-transform: uppercase;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-align: right;

  & span {
    font-weight: 600;
    text-decoration: underline;
  }
`;

const StyledSavedFlyersListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  border: 2px dashed var(--color-brand-700);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  background-color: var(--color-grey-50);
`;
export default function SavedFlyersList() {
  const {
    user,
    setDrawerAction,
    setIsOpenFlyerDrawer,
    // setSelectedSavedFlyers,
    // setShowDeleteFlyerSavedFlyersModal,
  } = useGlobalContext();

  // const flyersBelongingToSavedFlyerss = groupFlyersToSavedFlyerss(user);
  // console.log("flyersBelongingToSavedFlyerss", flyersBelongingToSavedFlyerss);

  // function handleEdit(template: DB_SavedFlyers) {
  //   // setSelectedSavedFlyers(template);
  //   // setDrawerAction("editSavedFlyers");
  //   setIsOpenFlyerDrawer((prev) => true);
  // }

  // function handleDelete(template: DB_SavedFlyers) {
  //   // setSelectedSavedFlyers(template);
  //   // setShowDeleteFlyerSavedFlyersModal(true);
  // }

  function handleRedeem() {}

  function handleUnsave() {}

  useEffect(() => {
    // return () => {
    //   setDrawerAction(null);
    //   setSelectedSavedFlyers(null);
    //   setIsOpenFlyerDrawer((prev) => false);
    // };
  }, []);

  return (
    <StyledSavedFlyersListContainer>
      {!user!["saved_flyers"].length && (
        <StyledSmall as="h2">No saved flyers</StyledSmall>
      )}
      <div data-testid="board" style={{ width: "100%", margin: "auto" }}>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 1096: 2, 1600: 3 }}

          // gutterBreakpoints={{ 350: "12px", 750: "16px", 900: "24px" }}
        >
          <Masonry columnsCount={3} gutter="1.6rem">
            {user &&
              user!["saved_flyers"].map((savedFlyer: DB_Saved_Flyers) => (
                <StyledSavedFlyersListItem key={savedFlyer.id}>
                  <StyledActionContainer>
                    <StyledSmall>
                      <span>Saved @ {savedFlyer.flyer.place!.name!}</span>
                    </StyledSmall>
                    <HiOutlineXMark onClick={() => handleUnsave()} />
                  </StyledActionContainer>
                  <FlyerBlockStatic
                    key={savedFlyer.flyer.id}
                    flyer={savedFlyer.flyer}
                  />
                </StyledSavedFlyersListItem>
              ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </StyledSavedFlyersListContainer>
  );
}
