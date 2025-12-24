import React, { useState, useEffect } from "react";

type CollectionPageProps = {
  userSockImage?: string; // 使用者剛畫好的襪子圖片 URL
  totalSocksCount: number; // 總襪子數量（從資料庫取得）
  isFirstVisit: boolean; // 是否為剛畫完的第一次訪問
};

const CollectionPage: React.FC<CollectionPageProps> = ({
  userSockImage,
  totalSocksCount,
  isFirstVisit,
}) => {
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  const [currentCount, setCurrentCount] = useState(totalSocksCount - (isFirstVisit ? 1 : 0));
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // 計算燈泡數量（每3個襪子點亮1顆燈）
  const litBulbs = Math.min(Math.floor(currentCount / 3), 10);
  const isComplete = currentCount >= 30;

  // 首次訪問播放掉落動畫
  useEffect(() => {
    if (isFirstVisit && userSockImage) {
      setShowDropAnimation(true);
      
      // 動畫持續 2 秒後更新計數
      setTimeout(() => {
        setCurrentCount(totalSocksCount);
        setShowDropAnimation(false);
      }, 2000);
    }
  }, [isFirstVisit, userSockImage, totalSocksCount]);

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
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 主要內容容器 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1400px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: isMobile ? "20px" : "40px 60px",
          boxSizing: "border-box",
        }}
      >
        {/* 上方區域 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: isMobile ? "20px" : "40px" }}>
          {/* 左側：壁爐 + 照片 */}
          <div style={{ position: "relative", width: isMobile ? "120px" : "220px" }}>
            {/* 壁爐上方照片 */}
            <div
              style={{
                position: "absolute",
                top: isMobile ? "-40px" : "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: isMobile ? "8px" : "15px",
                zIndex: 10,
              }}
            >
              <img
                src="/happy1.png"
                alt="Photo 1"
                onClick={() => setSelectedPhoto("/happy1.png")}
                style={{
                  width: isMobile ? "60px" : "100px",
                  height: isMobile ? "40px" : "65px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "3px solid #8B4513",
                  borderRadius: "5px",
                  transition: "transform 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <img
                src="/happy2.png"
                alt="Photo 2"
                onClick={() => setSelectedPhoto("/happy2.png")}
                style={{
                  width: isMobile ? "60px" : "100px",
                  height: isMobile ? "40px" : "65px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "3px solid #8B4513",
                  borderRadius: "5px",
                  transition: "transform 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </div>

          {/* 中間：大聖誕襪相框 */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "240px" : "400px",
              height: isMobile ? "300px" : "500px",
              border: "15px solid #CD853F",
              borderRadius: "20px",
              backgroundColor: "#4682B4",
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)
              `,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* 大聖誕襪 - 使用 bigsock.png */}
            <div
              style={{
                position: "relative",
                width: "85%",
                height: "85%",
                backgroundImage: "url('/bigsock.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/* 顯示收集進度文字 */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: isMobile ? "28px" : "42px",
                  fontWeight: "bold",
                  color: "#FF6347",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                  fontFamily: "'Arial Black', sans-serif",
                }}
              >
                {currentCount}/30
              </div>
            </div>

            {/* 掉落動畫的小襪子 */}
            {showDropAnimation && userSockImage && (
              <img
                src={userSockImage}
                alt="Dropping sock"
                style={{
                  position: "absolute",
                  top: "-100px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? "50px" : "70px",
                  height: isMobile ? "65px" : "90px",
                  animation: "dropSock 2s ease-in-out forwards",
                  zIndex: 10,
                }}
              />
            )}
          </div>

          {/* 右側：聖誕樹 + 星星 */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "120px" : "250px",
              height: isMobile ? "160px" : "320px",
            }}
          >
            {/* 聖誕樹星星 */}
            <img
              src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
              alt="Tree Star"
              style={{
                position: "absolute",
                top: isMobile ? "-25px" : "-50px",
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? "40px" : "70px",
                height: isMobile ? "40px" : "70px",
                transition: "filter 1s ease",
                filter: isComplete ? "brightness(1.3) drop-shadow(0 0 20px #FFD700)" : "brightness(0.8)",
                animation: isComplete ? "starGlow 2s ease-in-out infinite" : "none",
              }}
            />
          </div>
        </div>

        {/* 下方區域：進度條 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? "15px" : "25px",
            paddingBottom: isMobile ? "30px" : "50px",
          }}
        >
          {/* 進度條主體 */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "90%" : "700px",
              height: isMobile ? "50px" : "70px",
              backgroundImage: "url('/prograssmain.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0 30px",
              boxSizing: "border-box",
            }}
          >
            {/* 10 顆燈泡 */}
            {[...Array(10)].map((_, index) => (
              <img
                key={index}
                src={index < litBulbs ? "/lighton.png" : "/lightoff.png"}
                alt={`Bulb ${index + 1}`}
                style={{
                  width: isMobile ? "28px" : "45px",
                  height: isMobile ? "28px" : "45px",
                  transition: "all 0.5s ease",
                  filter: index < litBulbs ? "brightness(1.2) drop-shadow(0 0 10px #FFD700)" : "brightness(0.7)",
                }}
              />
            ))}
          </div>

          {/* 圖鑑按鈕 + 浮動手指 */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* 圖鑑按鈕 */}
            <img
              src="/illustratedbook.png"
              alt="Illustrated Book"
              onClick={() => alert("圖鑑功能開發中...")}
              style={{
                width: isMobile ? "80px" : "120px",
                height: isMobile ? "80px" : "120px",
                cursor: "pointer",
                transition: "transform 0.2s",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* 浮動手指提示 */}
            <img
              src="/handpoint.png"
              alt="Hand Point"
              style={{
                position: "absolute",
                top: isMobile ? "-40px" : "-50px",
                right: isMobile ? "-30px" : "-40px",
                width: isMobile ? "50px" : "70px",
                height: isMobile ? "50px" : "70px",
                animation: "floatFinger 1.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* 照片 Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
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
              boxShadow: "0 0 60px rgba(255, 255, 255, 0.4)",
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
              background: "rgba(0, 0, 0, 0.5)",
              border: "none",
              cursor: "pointer",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)")}
          >
            ✕
          </button>
        </div>
      )}

      {/* CSS 動畫 */}
      <style>{`
        @keyframes dropSock {
          0% {
            top: -100px;
            opacity: 1;
            transform: translateX(-50%) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) rotate(180deg);
          }
          100% {
            top: 50%;
            opacity: 0;
            transform: translateX(-50%) rotate(360deg) scale(0.5);
          }
        }

        @keyframes starGlow {
          0%, 100% {
            filter: brightness(1.3) drop-shadow(0 0 20px #FFD700);
          }
          50% {
            filter: brightness(1.6) drop-shadow(0 0 30px #FFD700);
          }
        }

        @keyframes floatFinger {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default CollectionPage;