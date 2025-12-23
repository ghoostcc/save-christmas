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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#FF9933",
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255, 140, 0, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.3) 0%, transparent 50%)
        `,
      }}
    >
      {/* 左下角壁爐 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: isMobile ? "5%" : "8%",
          width: isMobile ? "120px" : "200px",
          height: isMobile ? "140px" : "240px",
          backgroundImage: "url('/fireplace.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      />

      {/* 右下角聖誕樹 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: isMobile ? "5%" : "8%",
          width: isMobile ? "150px" : "280px",
          height: isMobile ? "200px" : "380px",
          backgroundImage: "url('/christmas-tree.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      />

      {/* 中央藍圖 */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "85%" : "600px",
          height: isMobile ? "auto" : "500px",
          aspectRatio: "1 / 1",
          backgroundImage: "url('/blueprint.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* START 按鈕 - 放在紅框位置 */}
        <button
          onClick={onStart}
          style={{
            position: "absolute",
            top: "20%",
            right: "15%",
            width: isMobile ? "100px" : "140px",
            height: isMobile ? "50px" : "70px",
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