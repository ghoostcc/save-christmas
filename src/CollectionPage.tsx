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

  /** 進度燈（TS 不會再報錯） */
  const litProgress = Math.min(Math.floor(currentCount / 3), 10);
  const isComplete = currentCount >= 30;

  /** 掉落動畫 */
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
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundColor: "#F3A21B",
        overflow: "hidden",
      }}
    >
      {/* ================= 舞台安全區 ================= */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        {/* 左上照片 */}
        {["/happy1.png", "/happy2.png"].map((src, i) => (
          <div
            key={src}
            style={{
              position: "absolute",
              left: "6%",
              top: `${14 + i * 12}%`,
            }}
          >
            <img
              src={src}
              alt="photo"
              style={{ width: isMobile ? 70 : 110, display: "block" }}
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

        {/* ================= 中央襪子舞台 ================= */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? 280 : 420,
            aspectRatio: "3 / 4",
          }}
        >
          {/* 大襪子 */}
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

          {/* 掉落中 */}
          {showDropAnimation && animationPhase === "dropping" && userSockImage && (
            <img
              src={userSockImage}
              alt="drop"
              style={{
                position: "absolute",
                top: "-120px",
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? 40 : 60,
                animation: "dropSock 4s ease-in forwards",
              }}
            />
          )}

          {/* 掉落完成 */}
          {animationPhase === "landed" && userSockImage && (
            <img
              src={userSockImage}
              alt="landed"
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

        {/* ================= 進度條 ================= */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: isMobile ? 100 : 120,
            transform: "translateX(-50%)",
            width: isMobile ? 280 : 420,
          }}
        >
          <img src="/prograssmain.png" style={{ width: "100%" }} />
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

        {/* ================= 圖鑑 ================= */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
          }}
        >
          <img
            src="/illustratedbook.png"
            style={{ width: isMobile ? 70 : 100 }}
          />
          <button
            onClick={() => alert("圖鑑功能開發中")}
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              border: "none",
            }}
          />
        </div>
      </div>

      {/* 照片放大 */}
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
          from { top: -120px; transform: translateX(-50%) rotate(0deg) scale(1); }
          to { top: 55%; transform: translateX(-50%) rotate(360deg) scale(0.6); }
        }
      `}</style>
    </div>
  );
};

export default CollectionPage;
