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

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    /* ===== 全畫面背景 ===== */
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: isMobile
          ? "url('/profileMobile.png')"
          : "url('/profile.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ===== 信紙外殼（只負責圖片） ===== */}
      <div
        style={{
          width: "420px",
          maxWidth: "90vw",
          aspectRatio: "420 / 720",
          backgroundImage: "url('/profileLetter.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* ===== 內容安全區（真正排版） ===== */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "10%",
            right: "10%",
            bottom: "10%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 標題 */}
          <h2
            style={{
              color: "#2d5016",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: "1.3",
            }}
          >
            歡迎，來到電卡索聖誕村的小精靈
          </h2>

          {/* 名字輸入 */}
          <div style={{ width: "100%", marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#2d5016",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              我該怎麼稱呼你呢？
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
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              你喜歡什麼顏色呢？
            </label>

            {/* 調色盤 */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: `
                    conic-gradient(
                      #ff0000,
                      #ff8800,
                      #ffff00,
                      #00ff00,
                      #00ffff,
                      #0000ff,
                      #ff0000
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
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
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

            {/* 色碼 */}
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
              }}
            />
          </div>

          {/* Continue */}
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
              opacity: isLoading ? 0.6 : 1,
              marginTop: "10px",
            }}
          />

          {isLoading && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "13px",
                color: "#2d5016",
              }}
            >
              儲存中…
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
