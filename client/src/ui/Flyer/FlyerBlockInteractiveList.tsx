import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";
import FlyerBlockInteractive from "./FlyerBlockInteractive";
import { DB_Flyers_Response } from "../../interfaces/DB_Flyers";
import { UNREGISTERED_FLYER_DESIGN_DEFAULT } from "../../constants";
import { shortenTitle } from "../../utils/GeneralUtils";

const StyledListWrapper = styled.div`
  width: 100%;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background: #fff;
  transition: box-shadow 200ms ease;
  &:hover {
    box-shadow: var(--shadow-lg);
  }
  margin-bottom: 1.6rem;
`;

const Header = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
`;

const Thumb = styled.img`
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-sm);
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 59em) {
    width: 56px;
    height: 56px;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-700);
`;

const Sub = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.6rem;
  color: var(--color-brand-600);
`;

const CTABadge = styled.div`
  /* text-transform: uppercase; */
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 0.4rem 0.8rem;
  border: 1px solid currentColor;
  border-radius: var(--border-radius-sm);
  background-color: var(--cta-bg, var(--color-orange-600));
  color: var(--cta-fg, var(--color-grey-50));
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.6rem;
  transform-origin: center;
  will-change: transform, box-shadow, filter;
  animation: pulse-cta 2200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;

  @keyframes pulse-cta {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      filter: none;
    }
    30% {
      transform: scale(1.06);
      box-shadow: 0 10px 30px var(--cta-glow, rgba(255, 165, 0, 0.22));
      filter: brightness(1.06);
    }
    60% {
      transform: scale(1.12);
      box-shadow: 0 22px 44px var(--cta-glow, rgba(255, 165, 0, 0.28));
      filter: brightness(1.1)
        drop-shadow(0 6px 12px var(--cta-glow, rgba(255, 165, 0, 0.18)));
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      filter: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: 59em) {
    padding: 0.15rem 0.4rem;
    font-size: 0.9rem;
  }
`;

const Collapsible = styled.div`
  width: 100%;
  /* keep content visually separated */
  background: #fff;
`;

export default function FlyerBlockInteractiveList({
  flyer,
}: {
  flyer: DB_Flyers_Response;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const flyerStyles = flyer.flyerDesign || UNREGISTERED_FLYER_DESIGN_DEFAULT;

  const thumbnail =
    flyer.fileUrlArr && flyer.fileUrlArr.length > 0
      ? (flyer.fileUrlArr[0] as any).secure_url ||
        (flyer.fileUrlArr[0] as any).url
      : null;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const update = () => {
      if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    };

    // initial
    update();

    // prefer ResizeObserver to catch image loads and internal layout changes
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    } else {
      const onResize = () => update();
      window.addEventListener("resize", onResize);
      // fallback: listen for image load events inside element
      const imgs = Array.from(el.querySelectorAll("img"));
      imgs.forEach((img) => img.addEventListener("load", update));
      return () => {
        window.removeEventListener("resize", onResize);
        imgs.forEach((img) => img.removeEventListener("load", update));
      };
    }

    return () => ro && ro.disconnect();
  }, [flyer, expanded]);

  const hasCTA = Boolean(
    flyer.callToAction &&
    flyer.callToAction.ctaType &&
    flyer.callToAction.ctaType !== "none",
  );
  const ctaLabel =
    flyer.callToAction?.ctaType === "offer" ? "Deals" : "Request";

  function parseColorToRgba(color: string | undefined, alpha = 0.28) {
    if (!color) return `rgba(255,165,0,${alpha})`;
    const c = color.trim();
    if (c.startsWith("#")) {
      let hex = c.slice(1);
      if (hex.length === 3)
        hex = hex
          .split("")
          .map((h) => h + h)
          .join("");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (c.startsWith("rgb(")) {
      const inside = c.slice(4, -1);
      return `rgba(${inside}, ${alpha})`;
    }
    // fallback for css vars or unknown formats
    return `rgba(255,165,0,${alpha})`;
  }

  const ctaGlow = parseColorToRgba(
    flyerStyles?.top?.backgroundColor as string,
    0.28,
  );

  return (
    <StyledListWrapper>
      <Header
        onClick={() => setExpanded((s) => !s)}
        style={{
          backgroundColor: flyerStyles.top.backgroundColor,
          color: flyerStyles.top.color,
        }}
        aria-expanded={expanded}
      >
        {thumbnail ? (
          <Thumb src={thumbnail} alt={flyer.title || "flyer"} />
        ) : (
          <Thumb src="/images/no-image-64.png" alt="no image" />
        )}

        <Meta>
          <Title
            style={{
              color: flyerStyles?.top?.color || "var(--color-grey-700)",
            }}
          >
            {shortenTitle(flyer.title || "", 120)}
          </Title>
          <Sub
            style={{
              color: flyerStyles?.top?.color || "var(--color-grey-500)",
            }}
          >
            {flyer.category}
            {flyer.subcategory ? " • " + flyer.subcategory : ""}
          </Sub>
        </Meta>

        {hasCTA && (
          <CTABadge
            title={flyer.callToAction?.headline || "Call to action"}
            style={{
              backgroundColor: flyerStyles?.top?.color,
              color: flyerStyles?.top?.backgroundColor,
              ["--cta-glow" as any]: ctaGlow,
            }}
          >
            {ctaLabel}
          </CTABadge>
        )}

        <IconWrap
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 220ms ease",
            color: flyerStyles?.top?.color,
          }}
        >
          {expanded ? (
            <HiOutlineChevronUp size={20} />
          ) : (
            <HiOutlineChevronDown size={20} />
          )}
        </IconWrap>
      </Header>

      <Collapsible
        style={{
          maxHeight: expanded ? `${contentHeight}px` : "0px",
          opacity: expanded ? 1 : 0,
          transition: "max-height 320ms ease, opacity 240ms ease",
          overflow: "hidden",
        }}
        aria-hidden={!expanded}
      >
        <div ref={contentRef} style={{ padding: expanded ? "1rem" : "0 1rem" }}>
          <FlyerBlockInteractive flyer={flyer} listView />
        </div>
      </Collapsible>
    </StyledListWrapper>
  );
}
