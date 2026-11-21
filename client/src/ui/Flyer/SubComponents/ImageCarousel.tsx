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

  /* Fullscreen: size everything from the modal's own box (not 100vw/100dvh,
     which include the scrollbar / mobile browser chrome), media stays contained */
  & .image-gallery.fullscreen-modal {
    inset: 0;
    width: 100%;
    height: 100%;
  }
  & .image-gallery.fullscreen-modal .image-gallery-content {
    top: 0;
    transform: none;
    height: 100%;
  }
  & .image-gallery.fullscreen-modal .image-gallery-slide-wrapper,
  & .image-gallery.fullscreen-modal .image-gallery-swipe,
  & .image-gallery.fullscreen-modal .image-gallery-slides,
  & .image-gallery.fullscreen-modal .image-gallery-slides-container,
  & .image-gallery.fullscreen-modal .image-gallery-slide {
    height: 100%;
  }
  & .image-gallery.fullscreen-modal .slide-frame {
    aspect-ratio: auto;
    width: 100%;
    height: 100%;
  }

  /* Controls: round, dark translucent chips with white icons so they stay
     legible over both light and dark media */
  & .image-gallery-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.6rem;
    height: 3.6rem;
    padding: 0;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.45);
    border-radius: 50%;
    filter: none;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition:
      color 200ms ease,
      background-color 200ms ease;
    -webkit-transition:
      color 200ms ease,
      background-color 200ms ease;
  }

  & .image-gallery-svg {
    width: 2rem;
    height: 2rem;
    background: none;
  }

  & .image-gallery-left-nav,
  & .image-gallery-right-nav {
    top: 40%;
    padding: 0;
  }
  & .image-gallery-left-nav {
    left: 0.8rem;
  }
  & .image-gallery-right-nav {
    right: 0.8rem;
  }

  & .image-gallery-fullscreen-button {
    right: 0.8rem;
    bottom: 0.8rem;
    padding: 0;
  }
  & .image-gallery-fullscreen-button.hide {
    visibility: hidden;
  }

  & .image-gallery-icon:focus-visible {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }

  /* Bullets: visible on light and dark images */
  & .image-gallery-bullets .image-gallery-bullet {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.45);
    box-shadow: none;
  }
  & .image-gallery-bullets .image-gallery-bullet.active {
    background-color: #fff;
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
    background-color: rgba(0, 0, 0, 0.7);
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
