import styled from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect } from "react";

const StyledActionMenu = styled.div`
  grid-column: 1 / -1;
  background-color: var(--color-brand-100);
  border-right: 1px solid var(--color-grey-100);
  padding: 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

export default function ActionMenu() {
  const { selectedPlace, setIsOpenFlyerDrawer, setDrawerAction } =
    useGlobalContext();
  useEffect(() => {}, [selectedPlace]);
  return (
    <StyledActionMenu>
      <div>
        <p>{selectedPlace?.displayName.text}</p>
        <p>{selectedPlace?.formattedAddress}</p>
      </div>
      {selectedPlace?.id && (
        <div>
          <Button
            size="small"
            onClick={() => {
              setDrawerAction("create");
              setIsOpenFlyerDrawer(true);
            }}
          >
            Create Flyer
          </Button>
        </div>
      )}
      <StyledActionContainer>
        <p>filter</p>
        <p>search</p>
        <p>grid</p>
      </StyledActionContainer>
    </StyledActionMenu>
  );
}
