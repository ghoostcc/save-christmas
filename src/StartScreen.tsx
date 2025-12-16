import React from "react";

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: isMobile
          ? "url('/mainnoDraw-mobile.png')"
          : "url('/mainnoDraw.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* START 按鈕 */}
      <button
        type="button"
        onClick={onStart}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "250px",
          height: "90px",
          backgroundImage: "url('/drawstartButton.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "transform 0.1s ease",
          outline: "none",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(0.95)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(0.95)";
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
        }}
        aria-label="開始繪製"
      />
    </div>
  );
};

export default StartScreen;