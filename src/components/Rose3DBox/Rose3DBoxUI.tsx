import { useState } from "react";
import { GlassButton } from "../GlassButton";
import { GlassButtonGroup } from "../GlassButtonGroup";
import { PageHeader } from "../PageHeader";
import { PageText } from "../PageText";
import { PageFooter } from "../PageFooter";
import "../Rose3DBox/styles.css";

type Rose3DBoxUIProps = {
  hideUI: boolean;
  onYesClick: () => void;
  boxOpened: boolean;
};

const messages = [
  "Please think again 😢",
  "Why so harsh? 😭",
  "Don't break my heart 💔",
  "Give me a chance 🥺",
  "I'll be the best Valentine 😢",
  "Just one yes, please? 😭",
];

const Rose3DBoxUI = ({ hideUI, onYesClick, boxOpened }: Rose3DBoxUIProps) => {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleNoHover = () => {
    if (!hasInteracted) {
      setShowTooltip(true);
    }
  };

  const handleNoLeave = () => {
    setShowTooltip(false);
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    setShowTooltip(false);

    // Get button and viewport dimensions
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate direction away from cursor
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    // Direction away from cursor
    const deltaX = buttonCenterX - cursorX;
    const deltaY = buttonCenterY - cursorY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Normalize and multiply by move distance
    const moveDistance = 150;
    let newX = noButtonPos.x + (deltaX / distance) * moveDistance;
    let newY = noButtonPos.y + (deltaY / distance) * moveDistance;

    // Clamp to viewport bounds
    const maxX = (viewportWidth - rect.width) / 2 - 100;
    const maxY = (viewportHeight - rect.height) / 2 - 100;
    newX = Math.max(-maxX, Math.min(maxX, newX));
    newY = Math.max(-maxY, Math.min(maxY, newY));

    setNoButtonPos({ x: newX, y: newY });
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };
  return (
    <>
      <PageHeader hideUI={hideUI} position="left">
        💝 A Special Valentine's Question
      </PageHeader>

      <PageText
        key={boxOpened ? 'opened' : 'initial'}
        line1={boxOpened ? "" : "This Valentine's Day could be special"}
        highlight={boxOpened ? "I Love you Buddi" : "Will you be my Valentine?"}
        line2={boxOpened ? "" : "✨ Say yes and make this day magical"}
        hideUI={hideUI}
        position="center-left"
      />

      <div className={`flower-controls ${hideUI || boxOpened ? "fade-out" : ""}`}>
        <GlassButtonGroup>
          <GlassButton icon="💖" onClick={onYesClick}>
            Yes
          </GlassButton>
          <GlassButton icon="💔" style={{ visibility: "hidden" }}>
            No
          </GlassButton>
        </GlassButtonGroup>
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          <GlassButton
            icon="💔"
            onMouseEnter={handleNoHover}
            onMouseLeave={handleNoLeave}
            onClick={handleNoClick}
            style={{
              whiteSpace: "normal",
              maxWidth: "200px",
              textAlign: "center"
            }}
          >
            {hasInteracted ? messages[messageIndex] : "No"}
          </GlassButton>
          <div style={{ position: "relative" }}>
            {showTooltip && !hasInteracted && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "8px",
                  padding: "8px 12px",
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                  pointerEvents: "none",
                  zIndex: 1000,
                }}
              >
                {messages[0]}
              </div>
            )}
          </div>
        </div>
      </div>

      <PageFooter hideUI={hideUI}>
        Made with Love | Happy Propose Day
      </PageFooter>
    </>
  );
};

export default Rose3DBoxUI;
