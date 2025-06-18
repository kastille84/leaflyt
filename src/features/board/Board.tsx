import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OverlaySpinner from "../../ui/OverlaySpinner";
import useGetBoard from "./useGetBoard";
import NoFlyers from "./NoFlyers";

export default function Board() {
  const { id } = useParams();
  // const [flyers, setFlyers] = useState([]);

  const { isLoadingBoard, board } = useGetBoard();

  useEffect(() => {
    // get all flyers for this board
  }, []);

  if (isLoadingBoard) return <OverlaySpinner message="Loading Board" />;
  // if no flyers, then show "NoFlyers" component which has a button to create a new flyer
  if (!isLoadingBoard && board?.error) {
    return <NoFlyers />;
  }

  // if flyers, then show a list of flyers
  return <div data-testid="board-container">Board: {id}</div>;
}
