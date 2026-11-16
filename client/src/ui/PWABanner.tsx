import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { HiXMark } from "react-icons/hi2";
import { usePWAInstallation } from "../hooks/usePWAInstallation";
import Button from "./Button";

// Wait before showing so the prompt never competes with a first visit.
export const PWA_BANNER_DELAY_MS = 8000;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(1.6rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledBanner = styled.div`
  position: fixed;
  right: 1.6rem;
  bottom: max(1.6rem, env(safe-area-inset-bottom));
  z-index: 900;
  width: min(40rem, calc(100% - 3.2rem));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1.2rem;
  padding: 0.8rem 0.8rem 0.8rem 1.6rem;
  background-color: #fff;
  color: var(--color-grey-700);
  border: 1px solid var(--color-brand-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  animation: ${slideUp} 0.3s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: 34em) {
    right: 0.8rem;
    left: 0.8rem;
    bottom: max(0.8rem, env(safe-area-inset-bottom));
    width: auto;
  }
`;

const StyledBannerText = styled.p`
  flex: 1 1 0;
  min-width: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-grey-700);
`;

const StyledActions = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const StyledActionButton = styled(Button)`
  min-height: 4.4rem;
  white-space: nowrap;
`;

const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 4.4rem;
  width: 4.4rem;
  height: 4.4rem;
  font-size: 2.2rem;
  color: var(--color-grey-700);
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: 50%;

  &:hover {
    background-color: var(--color-grey-200);
  }
`;

const StyledInstructions = styled.p`
  flex: 1 0 100%;
  padding: 0.4rem 0.8rem 0.8rem 0;
  font-size: 1.4rem;
  line-height: 1.5;
  color: var(--color-grey-600);

  strong {
    color: var(--color-grey-700);
  }
`;

export function PWAInstallBanner({
  delayMs = PWA_BANNER_DELAY_MS,
}: {
  delayMs?: number;
}): React.JSX.Element | null {
  const { isInstallable, platform, triggerChromiumInstall, dismissPrompt } =
    usePWAInstallation();
  const [isReady, setIsReady] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (!isInstallable) return;
    const timer = setTimeout(() => setIsReady(true), delayMs);
    return () => clearTimeout(timer);
  }, [isInstallable, delayMs]);

  if (!isInstallable || !isReady) {
    return null;
  }

  const isIOSOtherBrowser = platform.isIOS && !platform.isIOSSafari;

  return (
    <StyledBanner role="region" aria-label="Install Leaflit">
      <StyledBannerText>
        {isIOSOtherBrowser
          ? "Install Leaflit from Safari"
          : "Install Leaflit for faster access"}
      </StyledBannerText>

      <StyledActions>
        {/* Case A: Desktop or Android Chromium environments */}
        {platform.isChromium && (
          <StyledActionButton onClick={triggerChromiumInstall}>
            Install Now
          </StyledActionButton>
        )}

        {/* Case B: Native iOS Safari */}
        {platform.isIOSSafari && (
          <StyledActionButton
            variation="brand-outlined"
            aria-expanded={showSteps}
            onClick={() => setShowSteps((open) => !open)}
          >
            How
          </StyledActionButton>
        )}

        <StyledCloseButton onClick={dismissPrompt} aria-label="Dismiss">
          <HiXMark />
        </StyledCloseButton>
      </StyledActions>

      {platform.isIOSSafari && showSteps && (
        <StyledInstructions>
          Tap the <strong>Share icon</strong> in Safari's toolbar, then choose{" "}
          <strong>"Add to Home Screen"</strong>.
        </StyledInstructions>
      )}

      {/* Case C: iOS third-party browsers (Chrome, Edge, Firefox) */}
      {isIOSOtherBrowser && (
        <StyledInstructions>
          App installation requires Safari on iOS. Please copy this URL and open
          it inside Apple Safari to install.
        </StyledInstructions>
      )}
    </StyledBanner>
  );
}
