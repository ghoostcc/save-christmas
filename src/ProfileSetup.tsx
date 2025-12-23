import React, { useState } from "react";

type ProfileSetupProps = {
  onComplete: (name: string, color: string) => void;
};

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#d08919");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("請輸入你的名字");
      return;
    }
    setIsLoading(true);
    onComplete(name, color);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/profileMobile.png')"
          : "url('/profile.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* 內容容器（⚠️ 已移除 translateY） */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1440px",
          height: "100%",
        }}
      >
        {/* 歡迎 */}
        <div
          style={{
            position: "absolute",
            top: "346px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#2d5016",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          歡迎,來到電卡索聖誕村的小精靈
        </div>

        {/* 我該怎麼稱呼你 */}
        <div
          style={{
            position: "absolute",
            top: "425px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#2d5016",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          我該怎麼稱呼你呢?
        </div>

        {/* 名字輸入框 */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="輸入你的名字"
          disabled={isLoading}
          style={{
            position: "absolute",
            top: "465px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "270px",
            height: "38.9px",
            padding: "0 12px",
            fontSize: "14px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "rgba(255, 249, 240, 0.9)",
            outline: "none",
            boxSizing: "border-box",
            color: "#333",
          }}
        />

        {/* 你喜歡甚麼顏色 */}
        <div
          style={{
            position: "absolute",
            top: "537px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#2d5016",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          你喜歡甚麼顏色呢?
        </div>

        {/* 調色盤 */}
        <div
          style={{
            position: "absolute",
            top: "578px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "100px",
          }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100px",
              height: "100px",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              appearance: "none",
              padding: 0,
            }}
          />
        </div>

        {/* 色票框 */}
        <input
          type="text"
          value={color.toUpperCase()}
          readOnly
          style={{
            position: "absolute",
            top: "708px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "270px",
            height: "38.9px",
            padding: "0 12px",
            fontSize: "14px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "rgba(255, 249, 240, 0.9)",
            textAlign: "center",
            fontWeight: "bold",
            boxSizing: "border-box",
            color: "#333",
          }}
        />

        {/* Continue 按鈕 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            position: "absolute",
            top: "773px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            height: "70px",
            backgroundImage: "url('/continueButton.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "transform 0.1s ease",
            outline: "none",
            opacity: isLoading ? 0.6 : 1,
          }}
          onMouseDown={(e) => {
            if (!isLoading)
              e.currentTarget.style.transform =
                "translateX(-50%) scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform =
              "translateX(-50%) scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateX(-50%) scale(1)";
          }}
          aria-label="繼續"
        />

        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "820px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#2d5016",
              fontSize: "14px",
            }}
          >
            儲存中...
          </div>
        )}
      </div>

      {/* color input reset */}
      <style>{`
        input[type="color"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: none;
          border: 0;
          cursor: pointer;
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
          border: none;
        }
        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 50%;
        }
        input[type="color"]::-moz-color-swatch {
          border: none;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default ProfileSetup;
