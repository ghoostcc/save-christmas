import React, { useState, useEffect } from "react";

type TreePageProps = {
  totalSocksCount: number;
};

const TreePage: React.FC<TreePageProps> = ({ totalSocksCount }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const isMobile = windowWidth <= 768;
  const isComplete = totalSocksCount >= 30;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    /* ✅ 最外層：固定 viewport，不受 DevTools 影響 */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/tree.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundColor: "#000", // 防止留白
        overflow: "hidden",
      }}
    >
      {/* 主容器 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 上方區域 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "70%",
          }}
        >
          {/* 左側：壁爐 + 照片 */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? "5%" : "8%",
              top: isMobile ? "35%" : "30%",
              width: isMobile ? "120px" : "200px",
              height: isMobile ? "140px" : "230px",
            }}
          >
            {/* 火焰 */}
            {isComplete && (
              <>
                <div
                  style={{
                    position: "absolute",
                    bottom: "25%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "50%",
                    height: "40%",
                    background:
                      "radial-gradient(ellipse at bottom, #FF6B00, #FF4500, #FFA500, transparent)",
                    borderRadius: "50%",
                    animation: "flicker 1.5s infinite",
                    filter: "blur(2px)",
                    zIndex: 5,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40%",
                    height: "35%",
                    background:
                      "radial-gradient(ellipse at bottom, #FFD700, #FFA500, #FF6347, transparent)",
                    borderRadius: "50%",
                    animation: "flicker 1.2s infinite reverse",
                    filter: "blur(1px)",
                    zIndex: 6,
                  }}
                />
              </>
            )}

            {/* 照片 */}
            {["/happy1.png", "/happy2.png"].map((src, i) => (
              <img
                key={src}
                src={src}
                onClick={() => setSelectedPhoto(src)}
                style={{
                  position: "absolute",
                  top: isMobile ? `${-50 + i * 45}px` : `${-70 + i * 60}px`,
                  left: "5%",
                  width: isMobile ? "60px" : "95px",
                  height: isMobile ? "40px" : "63px",
                  objectFit: "cover",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>

          {/* 右側：聖誕樹星星 */}
          <img
            src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
            style={{
              position: "absolute",
              right: isMobile ? "8%" : "10%",
              top: isMobile ? "10%" : "8%",
              width: isMobile ? "50px" : "80px",
              filter: isComplete
                ? "brightness(1.4) drop-shadow(0 0 25px #FFD700)"
                : "brightness(0.8)",
              animation: isComplete ? "starGlow 2s infinite" : "none",
            }}
          />
        </div>

        {/* 下方按鈕 */}
        <div style={{ paddingBottom: "30px" }}>
          <img
            src="/illustratedbook.png"
            style={{
              width: isMobile ? "70px" : "100px",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={selectedPhoto}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "12px",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes flicker {
          0%,100% { opacity:1; }
          50% { opacity:0.85; }
        }
        @keyframes starGlow {
          0%,100% { filter: brightness(1.3) drop-shadow(0 0 20px #FFD700); }
          50% { filter: brightness(1.6) drop-shadow(0 0 35px #FFD700); }
        }
      `}</style>
    </div>
  );
};

export default TreePage;
