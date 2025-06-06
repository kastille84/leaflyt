import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OverlaySpinner from "../../ui/OverlaySpinner";

export default function Board() {
  const { id } = useParams();
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    // get all flyers for this board
  }, []);
  return <OverlaySpinner message="Loading Board" />;
  // if no flyers, then show "NoFlyers" component which has a button to create a new flyer
  // <NoFlyers />
  // if flyers, then show a list of flyers
  return <div>Board: {id}</div>;
}
