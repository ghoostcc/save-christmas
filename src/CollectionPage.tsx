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

  const litProgress = Math.min(Math.floor(currentCount / 3), 10);
  const isComplete = currentCount >= 30;

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
    /* ===== 全螢幕外框 ===== */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#F3A21B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ===== 固定比例舞台（關鍵）===== */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1920px",
          aspectRatio: "16 / 9",
        }}
      >
        {/* 背景圖 */}
        <img
          src={isMobile ? "/mainDraw-mobile.png" : "/mainDraw.png"}
          alt="background"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {/* 左上照片 */}
        {["/happy1.png", "/happy2.png"].map((src, i) => (
          <div
            key={src}
            style={{
              position: "absolute",
              left: "6%",
              top: `${12 + i * 10}%`,
            }}
          >
            <img src={src} style={{ width: 110 }} />
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

        {/* 中央襪子區 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "28%",
            aspectRatio: "3 / 4",
            transform: "translate(-50%, -55%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/bigsock.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 48,
              fontWeight: 900,
              color: "#FF6347",
              textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
            }}
          >
            {currentCount}/30
          </div>

          {showDropAnimation && animationPhase === "dropping" && userSockImage && (
            <img
              src={userSockImage}
              style={{
                position: "absolute",
                top: "-20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "20%",
                animation: "dropSock 4s ease-in forwards",
              }}
            />
          )}
        </div>

        {/* 星星 */}
        <img
          src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
          style={{
            position: "absolute",
            right: "10%",
            top: "12%",
            width: "5%",
            filter: isComplete
              ? "brightness(1.4) drop-shadow(0 0 25px #FFD700)"
              : "brightness(0.8)",
            animation: isComplete ? "starGlow 2s infinite" : "none",
          }}
        />

        {/* 底部進度 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "6%",
            transform: "translateX(-50%)",
          }}
        >
          <img src="/prograssmain.png" style={{ width: 420 }} />
        </div>
      </div>

      {/* 放大照片 */}
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
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}

      <style>{`
        @keyframes dropSock {
          to {
            top: 55%;
            transform: translateX(-50%) rotate(360deg) scale(0.6);
          }
        }
        @keyframes starGlow {
          0%,100% { filter: brightness(1.4) drop-shadow(0 0 20px #FFD700); }
          50% { filter: brightness(1.7) drop-shadow(0 0 35px #FFD700); }
        }
      `}</style>
    </div>
  );
};

export default CollectionPage;
