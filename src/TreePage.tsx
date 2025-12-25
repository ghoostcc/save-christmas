import React, { useState, useEffect } from "react";

type TreePageProps = {
  totalSocksCount: number;
};

const TreePage: React.FC<TreePageProps> = ({ totalSocksCount }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  
  const isMobile = windowWidth <= 768;
  const isComplete = totalSocksCount >= 30;

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: isMobile ? "url('/mainDraw-mobile.png')" : "url('/mainDraw.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 左側：壁爐 + 火焰動畫 + 照片 */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? "5%" : "8%",
              top: isMobile ? "35%" : "30%",
              width: isMobile ? "120px" : "200px",
              height: isMobile ? "140px" : "230px",
            }}
          >
            {/* 壁爐 */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* 火焰動畫（只在完成時顯示） */}
              {isComplete && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "25%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "50%",
                    height: "40%",
                    background: "radial-gradient(ellipse at bottom, #FF6B00, #FF4500, #FFA500, transparent)",
                    borderRadius: "50% 50% 40% 40%",
                    animation: "flicker 1.5s ease-in-out infinite",
                    filter: "blur(2px)",
                    zIndex: 5,
                  }}
                />
              )}
              {isComplete && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "28%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40%",
                    height: "35%",
                    background: "radial-gradient(ellipse at bottom, #FFD700, #FFA500, #FF6347, transparent)",
                    borderRadius: "50% 50% 45% 45%",
                    animation: "flicker 1.2s ease-in-out infinite reverse",
                    filter: "blur(1px)",
                    zIndex: 6,
                  }}
                />
              )}
            </div>

            {/* 照片 1 */}
            <img
              src="/happy1.png"
              alt="Photo 1"
              onClick={() => setSelectedPhoto("/happy1.png")}
              style={{
                position: "absolute",
                top: isMobile ? "-50px" : "-70px",
                left: "5%",
                width: isMobile ? "60px" : "95px",
                height: isMobile ? "40px" : "63px",
                objectFit: "cover",
                cursor: "pointer",
                transition: "transform 0.2s",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* 照片 2 */}
            <img
              src="/happy2.png"
              alt="Photo 2"
              onClick={() => setSelectedPhoto("/happy2.png")}
              style={{
                position: "absolute",
                top: isMobile ? "-5px" : "-10px",
                left: "5%",
                width: isMobile ? "60px" : "95px",
                height: isMobile ? "40px" : "63px",
                objectFit: "cover",
                cursor: "pointer",
                transition: "transform 0.2s",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* 右側：聖誕樹 + 星星 */}
          <div
            style={{
              position: "absolute",
              right: isMobile ? "5%" : "8%",
              top: isMobile ? "15%" : "10%",
            }}
          >
            {/* 聖誕樹星星 */}
            <img
              src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
              alt="Tree Star"
              style={{
                position: "absolute",
                top: isMobile ? "-30px" : "-50px",
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? "50px" : "80px",
                height: isMobile ? "50px" : "80px",
                filter: isComplete ? "brightness(1.3) drop-shadow(0 0 25px #FFD700)" : "brightness(0.8)",
                animation: isComplete ? "starGlow 2s ease-in-out infinite" : "none",
                zIndex: 10,
              }}
            />
          </div>
        </div>

        {/* 下方區域：圖鑑按鈕 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "20%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          {/* 圖鑑按鈕 + 手指 */}
          <div style={{ position: "relative" }}>
            <img
              src="/illustratedbook.png"
              alt="Illustrated Book"
              onClick={() => alert("圖鑑功能開發中...")}
              style={{
                width: isMobile ? "70px" : "100px",
                height: isMobile ? "70px" : "100px",
                cursor: "pointer",
                transition: "transform 0.2s",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* 浮動手指 */}
            <img
              src="/handpoint.png"
              alt="Hand Point"
              style={{
                position: "absolute",
                top: "-45px",
                right: "-35px",
                width: "55px",
                height: "55px",
                animation: "floatFinger 1.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* 照片 Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <img
            src={selectedPhoto}
            alt="Enlarged"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "15px",
              boxShadow: "0 0 60px rgba(255, 255, 255, 0.5)",
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              fontSize: "50px",
              color: "white",
              background: "rgba(0, 0, 0, 0.6)",
              border: "none",
              cursor: "pointer",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* CSS 動畫 */}
      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            transform: translateX(-50%) scaleY(1);
          }
          25% {
            opacity: 0.9;
            transform: translateX(-50%) scaleY(1.05);
          }
          50% {
            opacity: 0.95;
            transform: translateX(-50%) scaleY(0.98);
          }
          75% {
            opacity: 0.92;
            transform: translateX(-50%) scaleY(1.02);
          }
        }

        @keyframes starGlow {
          0%, 100% {
            filter: brightness(1.3) drop-shadow(0 0 25px #FFD700);
          }
          50% {
            filter: brightness(1.6) drop-shadow(0 0 35px #FFD700);
          }
        }

        @keyframes floatFinger {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
};

export default TreePage;