import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import styled from "styled-components";

const StyledLandingItem = styled.div<{ type: "warning" | "success" }>`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 25rem;
  padding: 2.4rem;
  background-color: ${({ type }) =>
    type === "warning" ? "var(--color-grey-50)" : "#fff"};
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-brand-500);
  text-align: center;
`;
const StyledLandingItemIcon = styled.div<{ type: "warning" | "success" }>`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ type }) =>
    type === "warning" ? "var(--color-orange-700)" : "var(--color-brand-600)"};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledLandingItemTitle = styled.h3<{ type: "warning" | "success" }>`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ type }) =>
    type === "warning" ? "var(--color-orange-700)" : "var(--color-brand-600)"};
`;
const StyledLandingItemDescription = styled.p``;

export default function LandingItem({
  type,
  title,
  description,
}: {
  type: "warning" | "success";
  title: string;
  description: string;
}) {
  return (
    <StyledLandingItem type={type}>
      <StyledLandingItemIcon type={type}>
        {type === "warning" ? (
          <HiOutlineExclamationTriangle />
        ) : (
          <HiOutlineCheckCircle />
        )}
      </StyledLandingItemIcon>
      <StyledLandingItemTitle type={type}>{title}</StyledLandingItemTitle>
      <StyledLandingItemDescription>{description}</StyledLandingItemDescription>
    </StyledLandingItem>
  );
}
