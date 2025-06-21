import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { UploadApiResponse } from "cloudinary";
import styled from "styled-components";
import { set } from "react-hook-form";

const StyledFigure = styled.figure`
  position: relative;

  & img {
    border-radius: var(--border-radius-sm);
  }

  & small {
    display: block;
  }
`;

const StyledCross = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: var(--color-red-600);
  opacity: 0.8;
  border-radius: 50%;
  display: inline-block;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    color: var(--color-grey-50);
    z-index: 100;
  }

  &:hover {
    opacity: 1;
    background-color: var(--color-grey-50);
    & svg {
      color: var(--color-red-600);
    }
  }
`;

export default function ImagePreviewItem({
  imageUrl,
  idx,
  handleDeleteImage,
}: {
  imageUrl: UploadApiResponse;
  idx: number;
  handleDeleteImage: (idx: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(2 * 60);

  useEffect(() => {
    // Set up an interval to decrement the timeLeft every second.
    const timer = setInterval(() => {
      // Check if there's still time left.
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      } else {
        // If time is 0 or less, clear the interval to stop the timer.
        clearInterval(timer);
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

  return (
    <StyledFigure key={imageUrl.public_id}>
      <img
        src={imageUrl.thumbnail_url}
        alt={imageUrl.public_id}
        key={imageUrl.public_id}
        style={{ width: "100px", height: "100px" }}
      />
      {timeLeft > 60 && <p>{formatTime(timeLeft)}</p>}
      {timeLeft <= 60 && (
        <small>
          Auto delete <br />
          in {formatTime(timeLeft)}
        </small>
      )}
      <StyledCross onClick={() => handleDeleteImage(idx)}>
        <HiOutlineXMark />
      </StyledCross>
    </StyledFigure>
  );
}
