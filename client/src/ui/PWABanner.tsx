import React from "react";
import styled from "styled-components";
import { usePWAInstallation } from "../hooks/usePWAInstallation";

/* Styled Components Definitions */

const BannerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #222222;
  color: #ffffff;
  padding: 24px 16px 16px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 999;
  width: 90%;
  max-width: 420px;
  text-align: center;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background-color: transparent;
  color: #aaaaaa;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const BannerText = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  padding-right: 12px;
  line-height: 1.4;
`;

const InstallButton = styled.button`
  background-color: #0070f3;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0051b3;
  }
`;

const InstructionText = styled.div`
  font-size: 13px;
  color: #cccccc;
  line-height: 1.5;

  strong {
    color: #ffffff;
  }
`;

export function PWAInstallBanner(): React.JSX.Element | null {
  const { isInstallable, platform, triggerChromiumInstall, dismissPrompt } =
    usePWAInstallation();

  if (!isInstallable) {
    return null;
  }

  return (
    <BannerContainer>
      <CloseButton onClick={dismissPrompt} aria-label="Dismiss">
        ✕
      </CloseButton>

      <BannerText>
        Install the app for faster access to Community Boards!
      </BannerText>

      {/* Case A: Desktop or Android Chromium Environments */}
      {platform.isChromium && (
        <InstallButton onClick={triggerChromiumInstall}>
          Install Now
        </InstallButton>
      )}

      {/* Case B: Native iOS Apple Safari */}
      {platform.isIOSSafari && (
        <InstructionText>
          To install, tap the <strong>Share icon</strong> (
          <span role="img" aria-label="share">
            ⎋
          </span>
          ) below, then choose <strong>"Add to Home Screen"</strong>.
        </InstructionText>
      )}

      {/* Case C: iOS Third Party Browsers (Chrome, Edge, Firefox) */}
      {platform.isIOS && !platform.isIOSSafari && (
        <InstructionText>
          App installation requires Safari on iOS. Please copy this URL and open
          it inside Apple Safari to install.
        </InstructionText>
      )}
    </BannerContainer>
  );
}
