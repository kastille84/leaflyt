import React from "react";
import styled from "styled-components";
import MapContainer from "../features/map/MapContainer";
import UpgradeText from "../ui/UpgradeText";
import useGetUserLimits from "../hooks/useGetUserLimits";
import Heading from "../ui/Heading";

const StyledMyArea = styled.div`
  small {
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  @media (max-width: 59em) {
    small {
      text-align: center;
    }
  }
`;

export default function MyArea() {
  const { canUpgrade } = useGetUserLimits();
  return (
    <StyledMyArea>
      {canUpgrade && (
        <small>
          <UpgradeText
            text="Need to increase your area for Virtual Posting?"
            type="upgrade"
            btnText="Upgrade"
          ></UpgradeText>
        </small>
      )}
      <MapContainer />
    </StyledMyArea>
  );
}
