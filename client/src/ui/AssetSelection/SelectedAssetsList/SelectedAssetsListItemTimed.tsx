import styled from "styled-components";

import { UploadApiResponse } from "cloudinary";
import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineXCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useEffect, useState } from "react";
import useAssetMutations from "../../../features/assets/useAssetMutations";
import useGetUserProfileById from "../../../hooks/useGetUserProfileById";
import { useGlobalContext } from "../../../context/GlobalContext";

const StyledListItem = styled.li`
  position: relative;
  width: 100px;
  height: 100px;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
`;

const StyledFigure = styled.figure`
  position: relative;
  width: 100px;
  height: 100px;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
`;

const StyledIconContainer = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 25px;
  height: 25px;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    color: var(--color-brand-600);
  }
`;

const StyledCross = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: var(--color-red-600);

  border-radius: 50%;
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    color: var(--color-grey-50);
    z-index: 100;
  }

  &:hover {
    background-color: var(--color-grey-50);
  }
  &:hover svg {
    color: var(--color-red-600);
  }
`;

export default function SelectedAssetsListItemTimed({
  asset,
  idx,
  handleDeleteAsset,
}: {
  asset: UploadApiResponse;
  idx: number;
  handleDeleteAsset: (idx: number) => void;
}) {
  const { setUser } = useGlobalContext();
  const { setTimedAssetsList } = useAssetSelectionContext();
  const { addAssetFn } = useAssetMutations();
  const [isAddedToAssets, setIsAddedToAssets] = useState<boolean>(false);
  // will get userProfile and set to user after asset is added
  const { status, userProfile } = useGetUserProfileById(isAddedToAssets);

  // const [timeLeft, setTimeLeft] = useState<number>(8 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    // Set up an interval to decrement the timeLeft every second.
    const timer = setInterval(() => {
      // Check if there's still time left.
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      } else {
        // If time is 0 or less, clear the interval to stop the timer.
        clearInterval(timer);
        // #TODO: ADD as part of Assets
        if (!isAddedToAssets) {
          addAssetFn(asset, {
            onSuccess: () => {
              console.log("success");
              // this flag, triggers useGetProfileById to get updated user
              setIsAddedToAssets((prev) => !prev);
            },
            onError: () => {
              console.log("error");
            },
          });
        }
      }
    }, 1000); // Update every 1000 milliseconds (1 second).

    // Cleanup function: This runs when the component unmounts
    // or before the effect runs again if its dependencies change.
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Function to format the time from seconds into MM:SS format.
  // Add type annotations for 'seconds' parameter (number) and return type (string).
  const formatTime = (seconds: number): string => {
    const minutes: number = Math.floor(seconds / 60); // Calculate minutes.
    const remainingSeconds: number = seconds % 60; // Calculate remaining seconds.

    // Pad minutes and seconds with a leading zero if they are less than 10.
    const formattedMinutes: string = String(minutes).padStart(2, "0");
    const formattedSeconds: string = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (isAddedToAssets && status === "success") {
      // remove asset from timedAssetsList
      setTimedAssetsList((prev) =>
        prev.filter((asset) => asset.public_id !== asset.public_id)
      );
    }
  }, [isAddedToAssets, status]);

  // useEffect(() => {
  //   if (userProfile) {
  //     setUser(userProfile);
  //   }
  // }, [userProfile]);

  return (
    <StyledListItem>
      <StyledFigure>
        <img
          src={
            asset.resource_type === "video" ? asset.thumbnail_url : asset.url
          }
          alt={asset.original_filename}
        />
        {timeLeft > 0 && <p>{formatTime(timeLeft)}</p>}
        {timeLeft <= 0 && <p>Added to Assets</p>}

        <StyledIconContainer>
          <HiOutlineArrowTopRightOnSquare />
        </StyledIconContainer>
        {!isAddedToAssets && (
          <StyledCross onClick={() => handleDeleteAsset(idx)}>
            <HiOutlineXMark />
          </StyledCross>
        )}
      </StyledFigure>
    </StyledListItem>
  );
}
