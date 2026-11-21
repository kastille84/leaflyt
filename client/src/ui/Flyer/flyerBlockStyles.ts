import styled, { css, keyframes } from "styled-components";
import { FlyerDesign } from "../../interfaces/DB_Flyers";

/**
 * Shared look & feel for FlyerBlockStatic / Interactive / Configurable.
 * User-chosen colors, font and corner radii still come from `flyerDesign`.
 */

export const cardStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid var(--color-grey-75);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-lg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const cardRadius = ({ flyerDesign }: { flyerDesign: FlyerDesign }) => css`
  border-top-left-radius: ${flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${flyerDesign.borderTopRightRadius}px;
  border-bottom-left-radius: ${flyerDesign.borderBottomLeftRadius}px;
  border-bottom-right-radius: ${flyerDesign.borderBottomRightRadius}px;
`;

export const StyledTopTextContainer = styled.div<{ flyerDesign: FlyerDesign }>`
  width: 100%;
  padding: 1.2rem 2rem;
  background-color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.14),
    rgba(0, 0, 0, 0.08)
  );
  color: ${({ flyerDesign }) => flyerDesign.top.color};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopLeftRadius}px;
  border-top-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderTopRightRadius}px;

  @media (max-width: 34em) {
    padding: 1rem 1.6rem;
  }
`;

export const StyledInfoContentContainer = styled.div`
  padding: 1.6rem 2rem;
  background-color: #fff;

  @media (max-width: 34em) {
    padding: 1.4rem 1.6rem;
  }
`;

export const StyledActionContainer = styled.section<{
  flyerDesign: FlyerDesign;
}>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  background-color: #fff;
  border-top: 1px solid var(--color-grey-75);
  border-bottom-left-radius: ${({ flyerDesign }) =>
    flyerDesign.borderBottomLeftRadius}px;
  border-bottom-right-radius: ${({ flyerDesign }) =>
    flyerDesign.borderBottomRightRadius}px;
`;

export const StyledActionIconContainer = styled.div<{
  flyerDesign: FlyerDesign;
}>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color 0.2s ease;

  & svg {
    font-size: 1.8rem;
    color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  }
  & small {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-grey-600);
  }

  &:hover {
    background-color: ${({ flyerDesign }) =>
      `color-mix(in srgb, ${flyerDesign.top.backgroundColor} 12%, transparent)`};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const StyledAvatarContainer = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;

export const StyledAvatar = styled.div<{ flyerDesign: FlyerDesign }>`
  background-color: ${({ flyerDesign }) => flyerDesign.top.color};
  color: ${({ flyerDesign }) => flyerDesign.top.backgroundColor};
  width: 3.6rem;
  height: 3.6rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 100%;
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.6),
    0 2px 6px rgba(0, 0, 0, 0.18);
`;

export const StyledAvatarName = styled.div`
  font-weight: 600;
`;

export const PillsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.6rem;
`;

const pillStyle = {
  info: {
    active: css`
      background-color: var(--color-brand-600);
      color: #fff;
      border-color: var(--color-brand-600);
    `,
    idle: css`
      background-color: var(--color-brand-0);
      color: var(--color-brand-700);
      border-color: transparent;
      &:hover {
        background-color: var(--color-brand-50);
      }
    `,
  },
  contact: {
    active: css`
      background-color: var(--color-brand-600);
      color: #fff;
      border-color: var(--color-brand-600);
    `,
    idle: css`
      background-color: var(--color-brand-0);
      color: var(--color-brand-700);
      border-color: transparent;
      &:hover {
        background-color: var(--color-brand-50);
      }
    `,
  },
  cta: {
    active: css`
      background-color: var(--color-orange-600);
      color: #fff;
      border-color: var(--color-orange-600);
    `,
    idle: css`
      background-color: var(--color-orange-100);
      color: var(--color-orange-700);
      border-color: transparent;
      &:hover {
        background-color: var(--color-orange-200);
      }
    `,
  },
};

const nudge = keyframes`
  0%, 12%, 100% { transform: scale(1) rotate(0deg); }
  3% { transform: scale(1.08) rotate(-3deg); }
  6% { transform: scale(1.08) rotate(3deg); }
  9% { transform: scale(1.08) rotate(-3deg); }
`;

export const Pill = styled.div<{
  contentType: "info" | "contact" | "cta";
  type: "info" | "contact" | "cta";
}>`
  ${({ contentType, type }) =>
    contentType === type ? pillStyle[type].active : pillStyle[type].idle}
  padding: 0.4rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 999px;
  letter-spacing: 0.8px;
  text-transform: capitalize;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  ${({ type }) =>
    type === "cta" &&
    css`
      @media (prefers-reduced-motion: no-preference) {
        animation: ${nudge} 5s infinite;
      }
    `}

  @media (max-width: 34em) {
    font-size: 1.2rem;
  }
`;
