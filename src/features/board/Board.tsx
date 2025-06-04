import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalContext";

export default function Board() {
  const { id } = useParams();
  const { selectedPlace } = useGlobalContext();
  useEffect(() => {
    // get all flyers for this board
  }, []);
  return (
    <div>
      Board: {id}
      <p>{selectedPlace?.displayName.text}</p>
      <p>{selectedPlace?.formattedAddress}</p>
    </div>
  );
}
