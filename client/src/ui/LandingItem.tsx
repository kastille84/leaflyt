import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import styled from "styled-components";

type ItemType = "warning" | "success";

// A "problem" is a crumpled, tilted note; a "fix" is a neat sheet pinned straight.
const StyledLandingItem = styled.div<{ $type: ItemType }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1 1 24rem;
  min-width: 0;
  padding: 2.8rem 2.4rem 2.4rem;
  background-color: ${({ $type }) =>
    $type === "warning" ? "var(--color-orange-200)" : "var(--color-brand-0)"};
  border-radius: var(--border-radius-tiny);
  box-shadow: var(--shadow-md);
  transform: ${({ $type }) =>
    $type === "warning" ? "rotate(-1.2deg)" : "none"};

  /* piece of tape holding the sheet to the board */
  &::before {
    content: "";
    position: absolute;
    top: -0.9rem;
    left: 50%;
    width: 6.4rem;
    height: 1.8rem;
    transform: translateX(-50%) rotate(-2deg);
    background-color: ${({ $type }) =>
      $type === "warning"
        ? "rgba(148, 86, 26, 0.25)"
        : "rgba(43, 138, 64, 0.25)"};
  }

  @media (max-width: 44em) {
    transform: none;
  }
`;

const StyledLandingItemIcon = styled.div<{ $type: ItemType }>`
  font-size: 2.8rem;
  color: ${({ $type }) =>
    $type === "warning" ? "var(--color-orange-700)" : "var(--color-brand-600)"};
  display: flex;
`;

const StyledLandingItemTitle = styled.h3<{ $type: ItemType }>`
  font-family: var(--font-display, inherit);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.15;
  color: ${({ $type }) =>
    $type === "warning" ? "var(--color-orange-800)" : "var(--color-brand-800)"};
`;

const StyledLandingItemDescription = styled.p`
  color: var(--color-grey-700);
`;

export default function LandingItem({
  type,
  title,
  description,
}: {
  type: ItemType;
  title: string;
  description: string;
}) {
  return (
    <StyledLandingItem $type={type}>
      <StyledLandingItemIcon $type={type}>
        {type === "warning" ? (
          <HiOutlineExclamationTriangle />
        ) : (
          <HiOutlineCheckCircle />
        )}
      </StyledLandingItemIcon>
      <StyledLandingItemTitle $type={type}>{title}</StyledLandingItemTitle>
      <StyledLandingItemDescription>{description}</StyledLandingItemDescription>
    </StyledLandingItem>
  );
}
