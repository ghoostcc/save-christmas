import React from "react";

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/mainnoDraw-mobile.png')"
          : "url('/mainnoDraw.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundColor: "#F3A21B",
        overflow: "hidden",
      }}
    >
      {/* ✅ 用一個 overlay 當「定位層」：滿版、但不影響背景 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {/* ✅ START 按鈕（兩張圖版本的唯一互動元件） */}
        <button
          type="button"
          onClick={onStart}
          aria-label="開始繪製"
          style={{
            position: "absolute",

            /**
             * ⭐ 只需要調這兩個數字：按鈕中心點的位置
             * - left / top 是「相對螢幕」的百分比
             * - 建議你先用 50% / 50% 讓它在正中間，確認能點，再慢慢對到設計稿位置
             */
            left: "57%",
            top: "25%",
            transform: "translate(-50%, -50%)",

            /**
             * ⭐ 按鈕大小：
             * - 桌機用 clamp 讓它在不同螢幕尺寸自動縮放
             * - 手機會自然變小
             */
            width: "clamp(180px, 32vw, 300px)",
            aspectRatio: "630 / 260",
            height: "auto",

            backgroundImage: "url('/drawstartButton.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "transparent",
            border: "none",
            padding: 0,

            cursor: "pointer",
            outline: "none",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform =
              "translate(-50%, -50%) scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform =
              "translate(-50%, -50%) scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translate(-50%, -50%) scale(1)";
          }}
        />
      </div>
    </div>
  );
};

export default StartScreen;
