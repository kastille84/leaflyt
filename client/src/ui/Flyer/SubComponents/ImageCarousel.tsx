import styled from "styled-components";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useGlobalContext } from "../../../context/GlobalContext";
import { UploadApiResponse } from "cloudinary";

const StyledFigure = styled.figure<{ height?: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const StyledCarouselContainer = styled.div<{ bgColor: string }>`
  & .react-multi-carousel-item {
    background-color: ${(props) => props.bgColor};
  }
  & [type="button"] {
    z-index: 99;
  }
  & .react-multi-carousel-dot-list {
    bottom: 15px;
  }
`;
export default function ImageCarousel({
  images,
  fromFlyerBlock = false,
  bgColor,
}: {
  images?: UploadApiResponse[];
  fromFlyerBlock?: boolean;
  bgColor?: string;
}) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const {
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    setCarouselImages,
    carouselImages,
  } = useGlobalContext();

  const handleImageClick = (fileUrlArr: UploadApiResponse[]) => {
    if (fromFlyerBlock) {
      setIsOpenBottomSlideIn(true);
      setBottomSlideInType("carousel");
      setCarouselImages(images!);
    }
  };

  const filesToUse = fromFlyerBlock ? images : carouselImages;
  const heightToUse = fromFlyerBlock ? 450 : 800;

  const determineImageWidth = (file: UploadApiResponse) => {
    if (file.height > heightToUse) {
      if (fromFlyerBlock) {
        return "300px";
      } else {
        return "450px";
      }
    } else {
      return "auto";
    }
  };

  return (
    <StyledCarouselContainer
      bgColor={bgColor ? bgColor : "var(--color-grey-75)"}
    >
      <Carousel
        ssr={false}
        responsive={responsive}
        showDots
        itemClass="carousel-item"
      >
        {filesToUse!.map((file, index) => (
          // <div
          //   style={{ height: "450px", objectFit: "cover" }}
          //   onClick={() => handleImageClick(filesToUse!)}
          // >
          //   <img
          //     src={file.secure_url}
          //     width={"auto"}
          //     height={"auto"}
          //     style={{ objectFit: "contain" }}
          //   />
          // </div>
          <StyledFigure
            key={index}
            onClick={() => handleImageClick(filesToUse!)}
            height={heightToUse}
          >
            {file.resource_type === "video" && "Video"}
            {file.resource_type === "image" && (
              <img
                src={file.secure_url}
                // width={file.height > heightToUse ? "300px" : "auto"}
                width={determineImageWidth(file)}
                height={"auto"}
                //  style={{ objectFit: "contain" }}
              />
            )}
          </StyledFigure>
        ))}
      </Carousel>
    </StyledCarouselContainer>
  );
}
