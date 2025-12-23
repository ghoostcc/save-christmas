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
        backgroundImage: "url('/start.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Start 按鈕 - 放在藍圖中間偏右上的位置 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "80%" : "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 藍圖容器 */}
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* START 按鈕放在藍圖右上區域 */}
          <button
            onClick={onStart}
            style={{
              position: "absolute",
              top: isMobile ? "15%" : "18%",
              right: isMobile ? "10%" : "12%",
              width: isMobile ? "120px" : "160px",
              height: isMobile ? "60px" : "80px",
              backgroundImage: "url('/startButton.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.1s ease",
              outline: "none",
              zIndex: 10,
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
    </div>
  );
};

export default StartScreen;