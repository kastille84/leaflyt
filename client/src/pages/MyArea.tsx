import React from "react";
import styled from "styled-components";
import MapContainer from "../features/map/MapContainer";

const StyledMyArea = styled.div``;

export default function MyArea() {
  return (
    <StyledMyArea>
      <MapContainer />
    </StyledMyArea>
  );
}
