import styled from "styled-components";
import { useGlobalContext } from "../../../context/GlobalContext";
import { UploadApiResponse } from "cloudinary";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";
import { useEffect, useRef } from "react";

const CarouselContainer = styled.div<{ hide?: boolean }>`
  /* Fullscreen modal must sit above the sidebar (z-index 100) and drawers (1000) */
  & .image-gallery.fullscreen-modal {
    z-index: 1100;
  }

  /* Uniform 4:3 frame for every slide (image or video), letterboxed */
  & .slide-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    overflow: hidden;
  }

  & .slide-frame img,
  & .slide-frame video {
    width: 100%;
    height: 100%;
    max-height: none;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  /* Fullscreen: frame fills the viewport, media stays contained */
  & .image-gallery.fullscreen-modal .slide-frame {
    aspect-ratio: auto;
    width: 100vw;
    height: 100dvh;
  }

  & .image-gallery-svg {
    width: 25px;
    height: 35px;
    background-color: rgba(255, 255, 255, 0.4);
  }

  & .image-gallery-left-nav,
  & .image-gallery-right-nav {
    padding: 0px 6px;
    top: 40%;
  }

  & .image-gallery-fullscreen-button {
    padding: 0px 6px;
  }
  & .image-gallery-fullscreen-button.hide {
    visibility: hidden;
  }

  & .image-gallery-icon {
    color: var(--color-brand-600);
    transition:
      color 200ms ease,
      background-color 200ms ease;
    -webkit-transition:
      color 200ms ease,
      background-color 200ms ease;
  }

  /* Ensure SVG icons use the current color and animate their fill/stroke */
  & .image-gallery-icon svg,
  & .image-gallery-icon svg * {
    fill: currentColor;
    stroke: currentColor;
    transition:
      fill 200ms ease,
      stroke 200ms ease,
      color 200ms ease;
    -webkit-transition:
      fill 200ms ease,
      stroke 200ms ease,
      color 200ms ease;
  }

  & .image-gallery-icon:hover {
    color: #fff;
    /* slight grey background for better visibility of icons and slight transparency to not be too harsh on flyers with dark backgrounds */
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
  const { contextImages } = useGlobalContext();

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
        <div className="slide-frame">
          <video src={item.original} controls />
        </div>
      );
    }

    return (
      <div className="slide-frame">
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
        showBullets={defineGalleryItems && defineGalleryItems.length > 1}
        maxBullets={3}
        // useBrowserFullscreen={true}
        onBeforeSlide={(nextIndex) => {
          hideFullScreenButtonOnVideoSlide(nextIndex);
        }}
      />
    </CarouselContainer>
  );
}
