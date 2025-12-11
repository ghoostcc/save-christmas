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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 背景圖片 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          backgroundImage: window.innerWidth > 768 
            ? "url('/profile.png')" 
            : "url('/profileMobile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 信紙內容容器 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(90%, 500px)",
          maxHeight: "90vh",
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            color: "#2d5016",
            marginBottom: "30px",
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "1.4",
          }}
        >
          歡迎你來到電卡索聖誕村
        </h2>

        {/* 名字輸入 */}
        <div style={{ width: "100%", marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              color: "#2d5016",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "10px",
              lineHeight: "1.5",
            }}
          >
            初次見面,我是電卡索創辦人之一的 CC<br />
            你呢,我該怎麼稱呼你?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="輸入你的名字"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #8B4513",
              borderRadius: "8px",
              backgroundColor: "#FFF9F0",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* 顏色選擇 */}
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#2d5016",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "10px",
              lineHeight: "1.5",
            }}
          >
            聖誕村的傳統就是選一個喜歡的顏色<br />
            讓我們能透過顏色先認識你
          </label>
          
          {/* 調色盤 */}
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={isLoading}
              style={{
                width: "200px",
                height: "200px",
                border: "3px solid #8B4513",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          </div>

          {/* 色票號顯示 */}
          <input
            type="text"
            value={color}
            readOnly
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #8B4513",
              borderRadius: "8px",
              backgroundColor: "#FFF9F0",
              textAlign: "center",
              fontWeight: "bold",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Continue 按鈕 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: "220px",
            height: "80px",
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
            marginTop: "20px",
          }}
          onMouseDown={(e) => {
            if (!isLoading) e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="繼續"
        >
          {isLoading && (
            <span style={{ color: "#fff", fontSize: "14px" }}>
              儲存中...
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;