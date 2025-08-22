import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NearbySearchPlaceResult } from "../../interfaces/Geo";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import { shortenTitle } from "../../utils/GeneralUtils";
import { useGlobalContext } from "../../context/GlobalContext";

type BoardListingItemProps = {
  place: NearbySearchPlaceResult;
};

const StyledBoardListItem = styled.li`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-lg);
  border-top: 5px solid var(--color-brand-600);
  /* border-radius: var(--border-radius-md); */
  background-color: var(--color-grey-50);

  & h3 {
    border-bottom: 1px solid var(--color-brand-600);
    padding: 1.2rem;
  }
`;

const StyledAddress = styled.p`
  padding: 1.2rem;
`;
const ButtonContainer = styled.div`
  padding: 1.2rem;
`;

export default function BoardListItem({ place }: BoardListingItemProps) {
  const navigate = useNavigate();
  const { setSelectedPlace, setIsSelectingNewPlace, setHasFlyerAtLocation } =
    useGlobalContext();
  function onSelectBoard() {
    setHasFlyerAtLocation((prev) => false);
    setSelectedPlace(place);
    setIsSelectingNewPlace(false);
    // navigate to
    // `/board/${place.placeId}`
    navigate(`/dashboard/board/${place.id}`, { replace: true });
  }

  return (
    <StyledBoardListItem data-testid="board-list-item">
      <Heading as={"h3"}>{shortenTitle(place.displayName.text, 20)}</Heading>
      <StyledAddress data-testid="board-list-item-address">
        {place.formattedAddress}
      </StyledAddress>
      <ButtonContainer>
        {/* <Button size="small" as={Link} to={`/board/${place.placeId}`}> */}
        <Button size="small" onClick={onSelectBoard}>
          Open Board
        </Button>
      </ButtonContainer>
    </StyledBoardListItem>
  );
}
