import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OverlaySpinner from "../../ui/OverlaySpinner";
import useGetBoard from "./useGetBoard";
import NoFlyers from "./NoFlyers";
import StaticFlyerBlock from "../../ui/Flyer/StaticFlyerBlock";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import useGetPlaceByPlaceId from "../../hooks/useGetPlaceByPlaceId";
import InfoAlert from "../../ui/InfoAlert";

const StyledBoardContainer = styled.div``;

export default function Board() {
  const { id } = useParams();
  const { selectedPlace } = useGlobalContext();
  const [shouldGetPlace, setShouldGetPlace] = useState(false);

  const { isLoadingBoard, board } = useGetBoard();
  useGetPlaceByPlaceId(id!, shouldGetPlace);

  useEffect(() => {
    if (board?.data && !selectedPlace) {
      setShouldGetPlace(true);
    }
  }, [board?.data, selectedPlace]);

  if (isLoadingBoard) return <OverlaySpinner message="Loading Board" />;
  // if no flyers, then show "NoFlyers" component which has a button to create a new flyer
  if (!isLoadingBoard && (board?.data?.flyers?.length === 0 || board?.error)) {
    return <NoFlyers />;
  }

  // if flyers, then show a list of flyers
  return (
    <>
      <StyledBoardContainer data-testid="board-container">
        <div data-testid="board" style={{ width: "90%", margin: "auto" }}>
          <InfoAlert text="Testing Info Alert" />
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 1096: 2, 1600: 3 }}

            // gutterBreakpoints={{ 350: "12px", 750: "16px", 900: "24px" }}
          >
            <Masonry columnsCount={3} gutter="1.6rem">
              {board?.data!.flyers?.length &&
                board?.data!.flyers.map((flyer) => (
                  <StaticFlyerBlock key={flyer!.id} flyer={flyer} />
                ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </StyledBoardContainer>
    </>
  );
}
