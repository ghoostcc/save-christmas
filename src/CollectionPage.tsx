import React, { useState, useEffect } from "react";

type CollectionPageProps = {
  userSockImage?: string;
  totalSocksCount: number;
  isFirstVisit: boolean;
};

const CollectionPage: React.FC<CollectionPageProps> = ({
  userSockImage,
  totalSocksCount,
  isFirstVisit,
}) => {
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  const [currentCount, setCurrentCount] = useState(totalSocksCount - (isFirstVisit ? 1 : 0));
  const [animationPhase, setAnimationPhase] = useState<"dropping" | "landed" | "none">("none");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // 計算進度條數量（每3個襪子點亮1個進度條）
  const litProgress = Math.min(Math.floor(currentCount / 3), 10);
  const isComplete = currentCount >= 30;

  // 首次訪問播放掉落動畫
  useEffect(() => {
    if (isFirstVisit && userSockImage) {
      setShowDropAnimation(true);
      setAnimationPhase("dropping");
      
      // 4秒後動畫完成，襪子停在底部
      setTimeout(() => {
        setAnimationPhase("landed");
        setCurrentCount(totalSocksCount);
        setShowDropAnimation(false);
      }, 4000);
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
          {/* 左側壁爐 + 照片 */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? "5%" : "8%",
              top: "20%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* 照片 - 無框 */}
            <img
              src="/happy1.png"
              alt="Photo 1"
              onClick={() => setSelectedPhoto("/happy1.png")}
              style={{
                width: isMobile ? "70px" : "110px",
                height: isMobile ? "47px" : "73px",
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "transform 0.2s",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <img
              src="/happy2.png"
              alt="Photo 2"
              onClick={() => setSelectedPhoto("/happy2.png")}
              style={{
                width: isMobile ? "70px" : "110px",
                height: isMobile ? "47px" : "73px",
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "transform 0.2s",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* 中間相框區域 */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "280px" : "450px",
              height: isMobile ? "350px" : "550px",
              marginTop: isMobile ? "40px" : "60px",
            }}
          >
            {/* 大聖誕襪 - 作為容器 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "70%",
                backgroundImage: "url('/bigsock.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingBottom: "15%",
              }}
            >
              {/* 已收集的小襪子堆疊在底部 */}
              {!showDropAnimation && currentCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "10%",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "3px",
                    maxWidth: "60%",
                  }}
                >
                  {[...Array(Math.min(currentCount, 12))].map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: isMobile ? "15px" : "20px",
                        height: isMobile ? "20px" : "25px",
                        backgroundImage: "url('/bigsock.png')",
                        backgroundSize: "cover",
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* 掉落動畫中的小襪子 */}
              {showDropAnimation && userSockImage && (
                <img
                  src={userSockImage}
                  alt="Dropping sock"
                  style={{
                    position: "absolute",
                    top: animationPhase === "dropping" ? "-150px" : "auto",
                    bottom: animationPhase === "landed" ? "10%" : "auto",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isMobile ? "40px" : "60px",
                    height: isMobile ? "50px" : "75px",
                    animation: animationPhase === "dropping" ? "dropSockSlow 4s ease-in forwards" : "none",
                    zIndex: 100,
                  }}
                />
              )}

              {/* 顯示數量 */}
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: isMobile ? "32px" : "48px",
                  fontWeight: "bold",
                  color: "#FF6347",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                  fontFamily: "'Arial Black', sans-serif",
                  zIndex: 10,
                }}
              >
                {currentCount}/30
              </div>
            </div>
          </div>

          {/* 右側聖誕樹星星 */}
          <div
            style={{
              position: "absolute",
              right: isMobile ? "5%" : "8%",
              top: isMobile ? "5%" : "8%",
            }}
          >
            <img
              src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
              alt="Tree Star"
              style={{
                width: isMobile ? "50px" : "80px",
                height: isMobile ? "50px" : "80px",
                filter: isComplete ? "brightness(1.3) drop-shadow(0 0 25px #FFD700)" : "brightness(0.8)",
                animation: isComplete ? "starGlow 2s ease-in-out infinite" : "none",
              }}
            />
          </div>
        </div>

        {/* 下方進度條區域 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "20%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            paddingBottom: "30px",
          }}
        >
          {/* 進度條容器（背景圖已包含進度條底） */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "85%" : "650px",
              height: "60px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0 30px",
            }}
          >
            {/* 10個進度條 */}
            {[...Array(10)].map((_, index) => (
              <img
                key={index}
                src={index < litProgress ? "/prograsson.png" : "/prograssoff.png"}
                alt={`Progress ${index + 1}`}
                style={{
                  width: isMobile ? "35px" : "50px",
                  height: isMobile ? "35px" : "50px",
                  transition: "all 0.5s ease",
                  filter: index < litProgress ? "brightness(1.2)" : "brightness(0.7)",
                }}
              />
            ))}

            {/* 燈泡（在進度條後面，全部亮才顯示） */}
            <img
              src={isComplete ? "/lighton.png" : "/lightoff.png"}
              alt="Main Light"
              style={{
                position: "absolute",
                right: "-60px",
                width: "70px",
                height: "70px",
                filter: isComplete ? "brightness(1.3) drop-shadow(0 0 20px #FFD700)" : "brightness(0.6)",
                transition: "all 1s ease",
                zIndex: isComplete ? 10 : 0,
              }}
            />
          </div>

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
        @keyframes dropSockSlow {
          0% {
            top: -150px;
            opacity: 1;
            transform: translateX(-50%) rotate(0deg) scale(1);
          }
          25% {
            transform: translateX(-50%) rotate(90deg) scale(0.9);
          }
          50% {
            transform: translateX(-50%) rotate(180deg) scale(0.8);
          }
          75% {
            transform: translateX(-50%) rotate(270deg) scale(0.7);
          }
          100% {
            top: 60%;
            opacity: 1;
            transform: translateX(-50%) rotate(360deg) scale(0.6);
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

export default CollectionPage;