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
      {/* 信紙圖片容器 */}
      <div
        style={{
          position: "relative",
          width: "420px",
          height: "720px",
          backgroundImage: "url('/profileLetter.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 40px 40px 40px",
        }}
      >
        {/* 標題 */}
        <h2
          style={{
            color: "#2d5016",
            marginBottom: "25px",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "1.3",
          }}
        >
          歡迎,來到電卡索聖誕村的小精靈
        </h2>

        {/* 名字輸入 */}
        <div style={{ width: "100%", marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              color: "#2d5016",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "6px",
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
              padding: "8px 10px",
              fontSize: "14px",
              border: "2px solid #8B4513",
              borderRadius: "5px",
              backgroundColor: "#FFF9F0",
              outline: "none",
              boxSizing: "border-box",
              color: "#333",
            }}
          />
        </div>

        {/* 顏色選擇 */}
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#2d5016",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            你喜歡甚麼顏色呢?
          </label>
          
          {/* 彩色調色盤 - 使用漸層背景 */}
          <div style={{ 
            textAlign: "center", 
            marginBottom: "10px",
            position: "relative",
          }}>
            <div
              style={{
                width: "160px",
                height: "160px",
                margin: "0 auto",
                borderRadius: "50%",
                background: `
                  conic-gradient(
                    from 0deg,
                    #ff0000 0deg 60deg,
                    #ff8800 60deg 120deg,
                    #ffff00 120deg 180deg,
                    #00ff00 180deg 240deg,
                    #00ffff 240deg 300deg,
                    #0000ff 300deg 360deg
                  )
                `,
                border: "3px solid #8B4513",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  opacity: 0,
                  position: "absolute",
                }}
              />
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "3px solid #8B4513",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* 色票號顯示 */}
          <input
            type="text"
            value={color.toUpperCase()}
            readOnly
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              border: "2px solid #8B4513",
              borderRadius: "5px",
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
            width: "180px",
            height: "65px",
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
            marginTop: "10px",
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
            marginTop: "10px",
            fontSize: "13px",
          }}>
            儲存中...
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;