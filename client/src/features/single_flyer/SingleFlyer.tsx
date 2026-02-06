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
import Button from "../../ui/Button";

const StyledSingleFlyerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 2.4rem;
  gap: 2.4rem;
  /* justify-content: center; */
  /* align-items: center; */

  & section.point {
    display: flex;
    gap: 2.4rem;
    @media (max-width: 59em) {
      justify-content: center;
    }
  }
  & article {
    margin-top: 1rem;
  }
  & .sub-point {
    color: var(--color-orange-600);
    font-weight: 600;
    text-transform: capitalize;
    font-size: 1.8rem;
  }
  & .no-flyer {
    font-weight: 600;
    text-transform: capitalize;
    font-size: 1.8rem;
    margin-top: 2.4rem;
  }
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
const StyledLearnMore = styled.small`
  color: var(--color-brand-600) !important;
  /* color: var(--color-blue-400) !important; */
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: underline;
`;

export default function SingleFlyer() {
  const { id } = useParams();
  const {
    user,
    getUserGeo,
    setIsSelectingNewPlace,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
  } = useGlobalContext();

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

  console.log("user value", user);
  function showGuidedActions() {
    return (
      <small>
        <section className="point">
          <article>
            <p className="sub-point">Have something to say?</p>
            <p>Post it on Leaflit for Free.</p>
            <StyledLearnMore
              onClick={() => {
                setBottomSlideInType("signup");
                setIsOpenBottomSlideIn(true);
              }}
            >
              Sign up for Free&nbsp; &gt;
            </StyledLearnMore>
          </article>
          <article>
            <p className="sub-point">See what others are saying.</p>
            <p>Be in the Loop</p>
            <p>
              <StyledLearnMore
                onClick={() => {
                  setIsSelectingNewPlace(true);
                  getUserGeo();
                }}
              >
                Find a Board Near you&nbsp; &gt;
              </StyledLearnMore>
            </p>
          </article>
        </section>
      </small>
    );
  }
  if (isLoadingBoard) return <OverlaySpinner message="Getting the flyer" />;

  if (error)
    return (
      <StyledSingleFlyerContainer>
        <div>
          <Heading as={"h3"}>
            {" "}
            Leaflit is a Digital Community Board where Locals Spread their
            Messages.
          </Heading>
          {!user && showGuidedActions()}
          <p className="no-flyer">
            Sorry, Could not retrieve the flyer. It may be deleted.{" "}
          </p>
        </div>
      </StyledSingleFlyerContainer>
    );

  return (
    <StyledSingleFlyerContainer>
      <div>
        <Heading as={"h3"}>
          {" "}
          Leaflit is a Digital Community Board where Locals Spread their
          Messages.
        </Heading>
        {!user && showGuidedActions()}
      </div>
      {/* <StyledFlyerContainer> */}
      <FlyerBlockInteractive flyer={flyer!} />
      {/* </StyledFlyerContainer> */}
    </StyledSingleFlyerContainer>
  );
}
