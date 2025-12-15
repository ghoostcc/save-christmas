import React, { useState } from "react";

type ProfileSetupProps = {
  onComplete: (name: string, color: string) => void;
};

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#008919");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("請輸入你的名字");
      return;
    }
    setIsLoading(true);
    onComplete(name, color);
  };

  // 檢測是否為手機
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: isMobile 
          ? "url('/profileMobile.png')" 
          : "url('/profile.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 內容容器 - 對齊信紙中心 */}
      <div
        style={{
          width: isMobile ? "85%" : "450px",
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: isMobile ? "80px" : "100px",
        }}
      >
        {/* 標題 */}
        <h2
          style={{
            color: "#2d5016",
            marginBottom: "35px",
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "1.4",
          }}
        >
          歡迎,來到電卡索聖誕村的小精靈
        </h2>

        {/* 名字輸入 */}
        <div style={{ width: "100%", marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              color: "#2d5016",
              fontSize: isMobile ? "13px" : "14px",
              fontWeight: "600",
              marginBottom: "8px",
              lineHeight: "1.4",
            }}
          >
            我該怎麼稱呼你呢?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="輸入你的名字"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "15px",
              border: "2px solid #8B4513",
              borderRadius: "6px",
              backgroundColor: "#FFF9F0",
              outline: "none",
              boxSizing: "border-box",
              color: "#333",
            }}
          />
        </div>

        {/* 顏色選擇 */}
        <div style={{ width: "100%", marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              color: "#2d5016",
              fontSize: isMobile ? "13px" : "14px",
              fontWeight: "600",
              marginBottom: "12px",
              lineHeight: "1.4",
            }}
          >
            你喜歡甚麼顏色呢?
          </label>
          
          {/* 調色盤 */}
          <div style={{ 
            textAlign: "center", 
            marginBottom: "12px",
            position: "relative",
          }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={isLoading}
              style={{
                width: isMobile ? "150px" : "180px",
                height: isMobile ? "150px" : "180px",
                border: "3px solid #8B4513",
                borderRadius: "50%",
                cursor: "pointer",
                WebkitAppearance: "none",
                appearance: "none",
                padding: 0,
              }}
            />
          </div>

          {/* 色票號顯示 */}
          <input
            type="text"
            value={color.toUpperCase()}
            readOnly
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "15px",
              border: "2px solid #8B4513",
              borderRadius: "6px",
              backgroundColor: "#FFF9F0",
              textAlign: "center",
              fontWeight: "bold",
              boxSizing: "border-box",
              color: "#333",
            }}
          />
        </div>

        {/* Continue 按鈕 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: isMobile ? "160px" : "200px",
            height: isMobile ? "60px" : "70px",
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
            marginTop: "15px",
          }}
          onMouseDown={(e) => {
            if (!isLoading) e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (!isLoading) e.currentTarget.style.transform = "scale(0.95)";
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="繼續"
        />
        
        {isLoading && (
          <p style={{ 
            color: "#2d5016", 
            marginTop: "15px",
            fontSize: "14px",
          }}>
            儲存中...
          </p>
        )}
      </div>

      <style>{`
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
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