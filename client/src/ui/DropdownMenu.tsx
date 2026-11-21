import { useEffect, useRef, useState } from "react";
import { HiOutlineBars2 } from "react-icons/hi2";
import styled, { css, keyframes } from "styled-components";

const menuOpen = keyframes`
  from {
    opacity: 0;
    transform: translateY(-0.4rem) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const StyledDropdownContainer = styled.div`
  position: relative;
`;

const StyledTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  font-size: 2.4rem;
  color: inherit;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:focus-visible {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }
`;

const StyledDropdownMenuContainer = styled.div`
  position: absolute;
  top: calc(100% + 0.8rem);
  right: 0;
  min-width: 18rem;
  max-width: calc(100vw - 3.2rem);
  padding: 0.8rem;
  background-color: var(--color-grey-50);
  color: var(--color-grey-900);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 20;
  transform-origin: top right;
  animation: ${menuOpen} 120ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledUl = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const itemDanger = css`
  color: var(--color-red-600);

  &:hover,
  &:focus-visible {
    background-color: var(--color-red-100);
  }
`;

const StyledItem = styled.li<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.2rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;

  & svg {
    flex-shrink: 0;
    font-size: 1.8rem;
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-brand-50);
  }
  &:focus-visible {
    outline: 2px solid var(--color-brand-600);
    outline-offset: -2px;
  }

  ${(props) => props.$danger && itemDanger}

  @media (max-width: 34em) {
    padding: 1.2rem 1.4rem;
  }
`;

const StyledDivider = styled.li`
  height: 1px;
  margin: 0.4rem 0;
  background-color: var(--color-grey-200);
`;

export function DropdownMenuItem({
  $danger,
  children,
  onClick,
}: {
  $danger?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <StyledItem
      role="menuitem"
      tabIndex={-1}
      $danger={$danger}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
    >
      {children}
    </StyledItem>
  );
}

export function DropdownMenuDivider() {
  return <StyledDivider role="separator" />;
}

export default function DropdownMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  function getItems(): HTMLElement[] {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
  }

  // close on outside press or Escape; listeners only exist while open
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // move focus into the menu when it opens
  useEffect(() => {
    if (isOpen) getItems()[0]?.focus();
  }, [isOpen]);

  function handleToggle() {
    setIsOpen((prevVal) => !prevVal);
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    const items = getItems();
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    let next: number | null = null;

    if (e.key === "ArrowDown") next = (current + 1) % items.length;
    else if (e.key === "ArrowUp")
      next = (current - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else if (e.key === "Tab") setIsOpen(false);

    if (next !== null) {
      e.preventDefault();
      items[next].focus();
    }
  }

  return (
    <StyledDropdownContainer ref={containerRef}>
      <StyledTrigger
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Flyer options"
        onClick={handleToggle}
      >
        <HiOutlineBars2 />
      </StyledTrigger>
      {isOpen && (
        <StyledDropdownMenuContainer>
          <StyledUl
            ref={menuRef}
            role="menu"
            onKeyDown={handleMenuKeyDown}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </StyledUl>
        </StyledDropdownMenuContainer>
      )}
    </StyledDropdownContainer>
  );
}
