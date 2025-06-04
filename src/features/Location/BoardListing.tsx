import styled from "styled-components";
import { NearbySearchPlaceResult } from "../../interfaces";
import BoardListItem from "./BoardListItem";

type BoardListingProps = {
  places: NearbySearchPlaceResult[];
};

const StyledBoardListingContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
`;

export default function BoardListing({ places }: BoardListingProps) {
  return (
    <StyledBoardListingContainer>
      {places &&
        places.map((place) => <BoardListItem place={place} key={place.id} />)}
    </StyledBoardListingContainer>
  );
}
