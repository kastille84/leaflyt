import styled from "styled-components";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useGlobalContext } from "../../../context/GlobalContext";
import { UploadApiResponse } from "cloudinary";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import { useRef } from "react";

const StyledFigure = styled.figure<{
  height?: number | string;
  backgroundColor?: string;
}>`
  width: 100%;
  height: ${(props) =>
    typeof props.height === "number" ? `${props.height}px` : `${props.height}`};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "#fff"};
  /* opacity: 0.85; */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @media (max-height: 34em) {
    width: 50%;
    height: auto;
    margin: auto;
  }
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

const CarouselContainer = styled.div`
  /* Force uniform container dimensions */
  & .image-gallery-slide {
    /* height: 250px; Set your desired frame height */
  }

  /* Normalize and center the image within the frame */
  & .image-gallery-image {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Crops/scales images to fit the 500px box perfectly */
    object-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .video-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .image-gallery-svg {
    width: 25px;
    height: 50px;
  }

  & .image-gallery-left-nav,
  & .image-gallery-right-nav {
    padding: 0px 6px;
    top: 40%;
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
    bottomSlideInType,
    setBottomSlideInType,
    setContextImages,
    contextImages,
  } = useGlobalContext();

  const handleImageClick = (fileUrlArr: UploadApiResponse[]) => {
    if (fromFlyerBlock && bottomSlideInType !== "hasTemplates") {
      setIsOpenBottomSlideIn(true);
      setBottomSlideInType("carousel");
      setContextImages(images!);
    }
  };
  // either use provided images (from flyer block) or context images (from bottom slide-in)
  const filesToUse = fromFlyerBlock ? images : contextImages;
  // const heightToUse = fromFlyerBlock ? 250 : 800;

  const determineImageWidth = (file: UploadApiResponse) => {
    // if (file.height > heightToUse) {
    //   if (fromFlyerBlock) {
    //     return "300px";
    //   } else {
    //     return "450px";
    //   }
    // } else {
    //   return "auto";
    // }

    return "100%";
  };

  const galleryRef = useRef<ImageGalleryRef>(null);

  const defineGalleryItems = images?.map((file) => ({
    original: file.secure_url,
    thumbnail: file.secure_url,
    isVideo: file.resource_type === "video",
  })) as GalleryItem[];

  const renderGalleryItem = (item) => {
    if (item.isVideo) {
      return (
        <div
          className="video-wrapper"
          style={{
            // position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
          }}
        >
          <video
            src={item.original}
            controls
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
            // poster={item.original} // Fallback background image before play
          />
        </div>
      );
    }

    // Default return for standard images fallback
    return (
      <div className="image-gallery-image">
        <img
          src={item.original}
          alt={item.originalAlt}
          title={item.originalTitle}
        />
        {item.description && (
          <span className="image-gallery-description">{item.description}</span>
        )}
      </div>
    );
  };

  return (
    <CarouselContainer>
      <ImageGallery
        ref={galleryRef}
        items={defineGalleryItems ? defineGalleryItems : ([] as GalleryItem[])}
        onSlide={(index) => console.log("Slid to", index)}
        showPlayButton={false}
        showThumbnails={false}
        renderItem={renderGalleryItem}
      />
    </CarouselContainer>
  );
  return (
    <StyledCarouselContainer
      bgColor={bgColor ? bgColor : "var(--color-grey-75)"}
    >
      <Carousel
        ssr={false}
        responsive={responsive}
        // showDots
        itemClass="carousel-item"
        afterChange={(index) => {}}
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
            height={fromFlyerBlock ? 250 : 800}
            // height={file.height > heightToUse ? "auto" : heightToUse}
            backgroundColor={file.resource_type === "video" ? bgColor : "#fff"}
          >
            {file.resource_type === "video" && (
              <video
                controls
                src={file.secure_url}
                width={fromFlyerBlock ? "100%" : "60%"}
                height={fromFlyerBlock ? "250px" : "80%"}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => e.target.pause()}
              />
            )}
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
