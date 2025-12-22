import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import OverlaySpinner from "../../ui/OverlaySpinner";
import useGetBoard from "./useGetBoard";
import NoFlyers from "./NoFlyers";
import FlyerBlockInteractive from "../../ui/Flyer/FlyerBlockInteractive";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import useGetPlaceByPlaceId from "../../hooks/useGetPlaceByPlaceId";
import InfoAlert from "../../ui/InfoAlert";
import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";

const StyledBoardContainer = styled.div``;

export default function Board() {
  const responsiveVal = useResponsiveWidth();
  const { id } = useParams();
  const QueryClient = useQueryClient();
  const {
    selectedPlace,
    user,
    hasFlyerAtLocation,
    setHasFlyerAtLocation,
    anonUserPostings,
  } = useGlobalContext();
  const [shouldGetPlace, setShouldGetPlace] = useState(false);

  const { isLoadingBoard, board } = useGetBoard(user?.id!);
  useGetPlaceByPlaceId(id!, shouldGetPlace);

  useEffect(() => {
    setShouldGetPlace(true);
  }, [selectedPlace]);

  useEffect(() => {
    if (user || anonUserPostings.length > 0) {
      checkIfUserHasFlyerHere();
    }
  }, [user, selectedPlace, board, id, anonUserPostings]);

  async function checkIfUserHasFlyerHere() {
    const boardData = await QueryClient.getQueryData(["board", id]);
    // const boardData = await QueryClient.ensureQueryData({
    //   queryKey: ["board", id],
    // });
    if (
      (boardData as any)?.data?.hasFlyerHere ||
      anonUserPostings.includes(id!)
    ) {
      setHasFlyerAtLocation(true);
    } else {
      setHasFlyerAtLocation(false);
    }
  }

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
          {hasFlyerAtLocation && (
            <InfoAlert text="You already have a flyer posted here" />
          )}
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 940: 2, 1600: 3 }}

            // gutterBreakpoints={{ 350: "12px", 750: "16px", 900: "24px" }}
          >
            <Masonry columnsCount={3} gutter="1.6rem">
              {board?.data!.flyers?.length &&
                board?.data!.flyers.map((flyer) => (
                  <FlyerBlockInteractive key={flyer!.id} flyer={flyer} />
                ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </StyledBoardContainer>
    </>
  );
}
