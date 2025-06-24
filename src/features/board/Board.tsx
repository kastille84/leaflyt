import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OverlaySpinner from "../../ui/OverlaySpinner";
import useGetBoard from "./useGetBoard";
import NoFlyers from "./NoFlyers";
import { DB_Board } from "../../interfaces/DB_Board";

export default function Board() {
  const { id } = useParams();
  // const [flyers, setFlyers] = useState([]);

  const { isLoadingBoard, board } = useGetBoard();

  if (isLoadingBoard) return <OverlaySpinner message="Loading Board" />;
  // if no flyers, then show "NoFlyers" component which has a button to create a new flyer
  if (!isLoadingBoard && (board?.data?.flyers?.length === 0 || board?.error)) {
    return <NoFlyers />;
  }

  // if flyers, then show a list of flyers
  return (
    <div data-testid="board-container">
      Board:{" "}
      {board?.data!.flyers?.length &&
        board?.data!.flyers.map((flyer) => <p>{flyer.title}</p>)}
    </div>
  );
}
