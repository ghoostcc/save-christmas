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
  const [animationPhase, setAnimationPhase] =
    useState<"dropping" | "landed" | "none">("none");
  const [currentCount, setCurrentCount] = useState(
    totalSocksCount - (isFirstVisit ? 1 : 0)
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 每 3 個襪子亮一格
  const litProgress = Math.min(Math.floor(currentCount / 3), 10);
  const isComplete = currentCount >= 30;

  // 首次訪問掉落動畫
  useEffect(() => {
    if (isFirstVisit && userSockImage) {
      setTimeout(() => {
        setShowDropAnimation(true);
        setAnimationPhase("dropping");
      }, 500);

      setTimeout(() => {
        setAnimationPhase("landed");
        setCurrentCount(totalSocksCount);
        setShowDropAnimation(false);
      }, 4500);
    }
  }, [isFirstVisit, userSockImage, totalSocksCount]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/mainDraw-mobile.png')"
          : "url('/mainDraw.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* ================= 舞台（唯一容器） ================= */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* ===== 左上角照片（無邊框） ===== */}
        {["/happy1.png", "/happy2.png"].map((src, i) => (
          <div
            key={src}
            style={{
              position: "absolute",
              left: isMobile ? "5%" : "8%",
              top: isMobile ? `${18 + i * 12}%` : `${16 + i * 10}%`,
            }}
          >
            <img
              src={src}
              alt="photo"
              style={{
                width: isMobile ? 70 : 110,
                height: "auto",
                display: "block",
              }}
            />
            <button
              onClick={() => setSelectedPhoto(src)}
              style={{
                position: "absolute",
                inset: 0,
                background: "transparent",
                border: "none",
                cursor: "zoom-in",
              }}
            />
          </div>
        ))}

        {/* ===== 中央相框 + 襪子 ===== */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -52%)",
            width: isMobile ? 300 : 480,
            height: isMobile ? 380 : 600,
          }}
        >
          {/* 相框（視覺層） */}
          <img
            src="/frame.png"
            alt="frame"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              pointerEvents: "none",
            }}
          />

          {/* 襪子舞台（動畫層，不裁切） */}
          <div
            style={{
              position: "absolute",
              inset: "12%",
              pointerEvents: "none",
            }}
          >
            {/* 大襪子 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/bigsock.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />

            {/* 數量 */}
            <div
              style={{
                position: "absolute",
                top: "38%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: isMobile ? 32 : 48,
                fontWeight: 900,
                color: "#FF6347",
                textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
              }}
            >
              {currentCount}/30
            </div>

            {/* 掉落動畫 */}
            {showDropAnimation && userSockImage && animationPhase === "dropping" && (
              <img
                src={userSockImage}
                alt="drop sock"
                style={{
                  position: "absolute",
                  top: "-140px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? 40 : 60,
                  animation: "dropSockSlow 4s ease-in forwards",
                }}
              />
            )}

            {/* 落地後 */}
            {animationPhase === "landed" && userSockImage && (
              <img
                src={userSockImage}
                alt="landed sock"
                style={{
                  position: "absolute",
                  bottom: "30%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? 36 : 52,
                }}
              />
            )}
          </div>
        </div>

        {/* ===== 右上角星星 ===== */}
        <img
          src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
          alt="tree star"
          style={{
            position: "absolute",
            right: isMobile ? "6%" : "8%",
            top: isMobile ? "6%" : "8%",
            width: isMobile ? 48 : 80,
            filter: isComplete
              ? "brightness(1.4) drop-shadow(0 0 25px #FFD700)"
              : "brightness(0.8)",
            animation: isComplete ? "starGlow 2s infinite" : "none",
          }}
        />

        {/* ===== 底部：進度條 + 圖鑑 ===== */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: isMobile ? 16 : 32,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* 進度條 */}
          <div
            style={{
              position: "relative",
              width: isMobile ? 300 : 420,
            }}
          >
            <img
              src="/prograssmain.png"
              alt="progress base"
              style={{ width: "100%", display: "block" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {[...Array(10)].map((_, i) => (
                <img
                  key={i}
                  src={i < litProgress ? "/prograsson.png" : "/prograssoff.png"}
                  style={{
                    width: isMobile ? 18 : 26,
                    filter:
                      i < litProgress
                        ? "brightness(1.2) drop-shadow(0 0 8px #FFD700)"
                        : "brightness(0.7)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* 圖鑑 + 手指 */}
          <div style={{ position: "relative" }}>
            <img
              src="/illustratedbook.png"
              alt="book"
              style={{
                width: isMobile ? 70 : 100,
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
              }}
            />
            <button
              onClick={() => alert("圖鑑功能開發中")}
              style={{
                position: "absolute",
                inset: 0,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            />
            <img
              src="/handpoint.png"
              alt="hand"
              style={{
                position: "absolute",
                top: -42,
                right: -32,
                width: isMobile ? 52 : 70,
                animation: "floatFinger 1.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== 照片放大 ===== */}
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
            zIndex: 999,
          }}
        >
          <img
            src={selectedPhoto}
            alt="enlarged"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
            }}
          />
        </div>
      )}

      {/* ===== 動畫 ===== */}
      <style>{`
        @keyframes dropSockSlow {
          0% {
            top: -140px;
            transform: translateX(-50%) rotate(0deg) scale(1);
          }
          100% {
            top: 55%;
            transform: translateX(-50%) rotate(360deg) scale(0.6);
          }
        }

        @keyframes starGlow {
          0%,100% {
            filter: brightness(1.4) drop-shadow(0 0 20px #FFD700);
          }
          50% {
            filter: brightness(1.7) drop-shadow(0 0 35px #FFD700);
          }
        }

        @keyframes floatFinger {
          0%,100% {
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
