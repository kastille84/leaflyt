import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import { useParams } from "react-router-dom";
import { DB_Flyers_Response } from "../../interfaces/DB_Flyers";
import { useQuery } from "@tanstack/react-query";
import { getFlyerById } from "../../services/apiFlyers";
import OverlaySpinner from "../../ui/OverlaySpinner";
import FlyerBlockInteractive from "../../ui/Flyer/FlyerBlockInteractive";
import Heading from "../../ui/Heading";
import UpgradeText from "../../ui/UpgradeText";
import { checkIfCurrentFlyerIsSaved } from "../../utils/FlyerUtils";

const StyledSingleFlyerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 2.4rem;
  gap: 2.4rem;
  /* justify-content: center; */
  /* align-items: center; */
`;

const StyledFlyerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 2.4rem;
  /* justify-content: center; */
  align-items: center;
`;
export default function SingleFlyer() {
  const { id } = useParams();
  const { user } = useGlobalContext();

  let {
    isLoading: isLoadingBoard,
    data: flyer,
    error,
  } = useQuery({
    queryKey: ["flyer", id],
    queryFn: () => getFlyerById(id!),
    // enabled: !!id,
    gcTime: 0,
    staleTime: 0,
  });

  // isSaved state depends on saved flyers on user object
  const [isSaved, setIsSaved] = useState(() => {
    const saved_flyers_arr = user?.saved_flyers! || [];
    return checkIfCurrentFlyerIsSaved(saved_flyers_arr, flyer);
  });

  console.log("user value", user);
  if (isLoadingBoard) return <OverlaySpinner message="Getting the flyer" />;

  if (error)
    return (
      <div>
        Could not retrieve the flyer. It may be deleted. <br />
        Click on Home to view other flyers on Leaflit.
      </div>
    );

  return (
    <StyledSingleFlyerContainer>
      <div>
        <Heading as={"h2"}>Single Flyer View</Heading>
        {!user && (
          <small>
            <UpgradeText
              text="View more flyers from local community boards."
              type="signup"
              btnText="Signup for FREE"
            ></UpgradeText>
          </small>
        )}
      </div>
      {/* <StyledFlyerContainer> */}
      <FlyerBlockInteractive flyer={flyer!} />
      {/* </StyledFlyerContainer> */}
    </StyledSingleFlyerContainer>
  );
}
