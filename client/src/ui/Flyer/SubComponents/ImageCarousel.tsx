import styled from "styled-components";
import { useGlobalContext } from "../../../context/GlobalContext";
import { UploadApiResponse } from "cloudinary";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import { useEffect, useRef } from "react";

const CarouselContainer = styled.div<{ hide?: boolean }>`
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
    stroke: 2px;
  }

  & .image-gallery-left-nav,
  & .image-gallery-right-nav {
    padding: 0px 6px;
    top: 40%;
  }

  & .image-gallery-fullscreen-button.hide {
    visibility: hidden;
  }

  & .image-gallery-icon:hover {
    color: var(--color-brand-600);
    // slight grey background for better visibility of icons and slight transparency to not be too harsh on flyers with dark backgrounds
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
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
    contextImages,
  } = useGlobalContext();

  // either use provided images (from flyer block) or context images (from bottom slide-in)
  const filesToUse = fromFlyerBlock ? images : contextImages;

  const galleryRef = useRef<ImageGalleryRef>(null);

  const defineGalleryItems = filesToUse?.map((file) => ({
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

  function hideFullScreenButtonOnVideoSlide(nextIndex: number) {
      const fullScreenIcon = document.querySelector(
        ".image-gallery-fullscreen-button",
      );
      // add visibility hidden to full screen button if it's a video slide, otherwise show it
      fullScreenIcon?.classList.toggle(
        "hide",
        defineGalleryItems[nextIndex].isVideo,
      );
  }

  useEffect(() => {
    // on initial load, hide full screen button if first slide is video
    hideFullScreenButtonOnVideoSlide(0);
  }, []);

  return (
    <CarouselContainer>
      <ImageGallery
        ref={galleryRef}
        items={defineGalleryItems ? defineGalleryItems : ([] as GalleryItem[])}
        showPlayButton={false}
        showThumbnails={false}
        renderItem={renderGalleryItem}
        useBrowserFullscreen={true}
        onBeforeSlide={(nextIndex) => {
          hideFullScreenButtonOnVideoSlide(nextIndex);
        }}
        onImageLoad={(event) => {
          const imgElement = event.target as HTMLImageElement;
          console.log("imgElement:", imgElement);
          // imgElement.style.objectFit = "contain";
          // imgElement.style.objectPosition = "center";
        }}
      />
    </CarouselContainer>
  );
}
