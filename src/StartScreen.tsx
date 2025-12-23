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
          ? "url('/start-mobile.png')"
          : "url('/start.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Start 按鈕容器 - 放在紅色框內 */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "12%" : "15%",
          right: isMobile ? "8%" : "12%",
          width: isMobile ? "180px" : "220px",
          height: isMobile ? "120px" : "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={onStart}
          style={{
            width: isMobile ? "140px" : "180px",
            height: isMobile ? "70px" : "90px",
            backgroundImage: "url('/startButton.png')",
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
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="開始"
        />
      </div>
    </div>
  );
};

export default StartScreen;