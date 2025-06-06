import styled from "styled-components";
import Spinner from "./Spinner";

const StyledOverlaySpinner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(233, 250, 233, 0.808);
  display: flex;
  justify-content: center;
  align-items: center;

  & .overlay-content {
  }
`;
export default function OverlaySpinner({ message }: { message: string }) {
  return (
    <StyledOverlaySpinner data-testid="overlay-spinner">
      <div className="overlay-content">
        <Spinner />
        <span>{message}</span>
      </div>
    </StyledOverlaySpinner>
  );
}
