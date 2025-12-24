import React, { useEffect, useMemo, useState } from "react";

type CollectionPageProps = {
  userSockImage?: string; // 使用者剛畫好的襪子圖片 URL（cloudinary）
  totalSocksCount: number; // 總襪子數量（從資料庫取得）
  isFirstVisit: boolean; // 是否為剛畫完的第一次訪問
};

const CollectionPage: React.FC<CollectionPageProps> = ({
  userSockImage,
  totalSocksCount,
  isFirstVisit,
}) => {
  const [showDropAnimation, setShowDropAnimation] = useState(false);

  // 這段保留你原本邏輯：首次進來先顯示 total-1，動畫完再補回 total
  const [currentCount, setCurrentCount] = useState(
    totalSocksCount - (isFirstVisit ? 1 : 0)
  );

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // 手機判斷：避免 SSR/首次 render 取不到 window
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 計算燈泡數量（每3個襪子點亮1顆燈）✅ 你截圖那段
  const litBulbs = Math.min(Math.floor(currentCount / 3), 10);
  const isComplete = currentCount >= 30;

  // 首次訪問播放掉落動畫 ✅ 你截圖那段
  useEffect(() => {
    if (isFirstVisit && userSockImage) {
      setShowDropAnimation(true);

      // 動畫持續 2 秒後更新計數
      const t = setTimeout(() => {
        setCurrentCount(totalSocksCount);
        setShowDropAnimation(false);
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [isFirstVisit, userSockImage, totalSocksCount]);

  // 兩張相片清單
  const photos = useMemo(() => ["/happy1.png", "/happy2.png"], []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        backgroundImage: isMobile
          ? "url('/mainDraw-mobile.png')"
          : "url('/mainDraw.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* ===== 房間定位容器：所有 overlay 都用 absolute 疊在這層上 ===== */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* =======================
            互動層：照片（無邊框）+ 透明 hit area
            ======================= */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 18 : 26,
            left: isMobile ? 24 : 50,
            display: "flex",
            gap: isMobile ? 8 : 14,
            zIndex: 20,
          }}
        >
          {photos.map((src) => (
            <div key={src} style={{ position: "relative" }}>
              <img
                src={src}
                alt="photo"
                style={{
                  width: isMobile ? 62 : 105,
                  height: isMobile ? 42 : 68,
                  objectFit: "cover",
                  display: "block",
                  // ✅ 不要邊框
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  transform: "translateZ(0)",
                }}
              />
              {/* ✅ 透明按鈕當 hit area（不影響圖片/排版） */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(src)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "zoom-in",
                }}
                aria-label="Open photo"
              />
            </div>
          ))}
        </div>

        {/* =======================
            中央相框 + 襪子舞台（分層：frame 視覺 / stage 動畫）
            ======================= */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -52%)",
            width: isMobile ? 320 : 520,
            height: isMobile ? 390 : 620,
            zIndex: 10,
          }}
        >
          {/* 相框視覺層：推薦用圖片 frame.png（最穩）
              如果你沒有 frame.png，可以先用下面註解的 CSS 版本代替 */}
          <img
            src="/frame.png"
            alt="frame"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              pointerEvents: "none",
            }}
            onError={(e) => {
              // 若沒有 frame.png，避免破圖
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* 如果沒有 frame.png，可改用這個 CSS 相框（但仍然不要裁切動畫）
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "15px solid #CD853F",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(70,130,180,0.85)",
              pointerEvents: "none",
            }}
          />
          */}

          {/* ✅ 襪子舞台（stage）：不裁切、只放動畫/內容 */}
          <div
            style={{
              position: "absolute",
              // 這個 inset 你可依 frame.png 的內框留白微調
              inset: isMobile ? "10% 12%" : "10% 12%",
              pointerEvents: "none",
              overflow: "visible", // ✅ 不裁切動畫
            }}
          >
            {/* 大襪子（純內容，不要被藍框綁死） */}
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

            {/* 收集數字 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: isMobile ? 28 : 42,
                fontWeight: 900,
                color: "#FF6347",
                textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                fontFamily: "'Arial Black', sans-serif",
              }}
            >
              {currentCount}/30
            </div>

            {/* 掉落動畫的小襪子 */}
            {showDropAnimation && userSockImage && (
              <img
                src={userSockImage}
                alt="Dropping sock"
                style={{
                  position: "absolute",
                  top: -120,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? 50 : 70,
                  height: "auto",
                  animation: "dropSock 2s ease-in-out forwards",
                  zIndex: 5,
                }}
              />
            )}
          </div>
        </div>

        {/* =======================
            右側星星（完成狀態發亮）
            ======================= */}
        <img
          src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
          alt="Tree Star"
          style={{
            position: "absolute",
            top: isMobile ? 60 : 72,
            right: isMobile ? 52 : 92,
            width: isMobile ? 42 : 72,
            height: "auto",
            transition: "filter 1s ease",
            filter: isComplete
              ? "brightness(1.3) drop-shadow(0 0 20px #FFD700)"
              : "brightness(0.85)",
            animation: isComplete ? "starGlow 2s ease-in-out infinite" : "none",
            zIndex: 12,
            pointerEvents: "none",
          }}
        />

        {/* =======================
            下方進度條（保留 prograssmain.png + 10 顆燈）
            ======================= */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: isMobile ? 90 : 110,
            transform: "translateX(-50%)",
            width: isMobile ? "92%" : 760,
            height: isMobile ? 54 : 76,
            backgroundImage: "url('/prograssmain.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: isMobile ? "0 18px" : "0 30px",
            boxSizing: "border-box",
            zIndex: 15,
            pointerEvents: "none",
          }}
        >
          {[...Array(10)].map((_, index) => (
            <img
              key={index}
              src={index < litBulbs ? "/lighton.png" : "/lightoff.png"}
              alt={`Bulb ${index + 1}`}
              style={{
                width: isMobile ? 28 : 45,
                height: isMobile ? 28 : 45,
                transition: "all 0.5s ease",
                filter:
                  index < litBulbs
                    ? "brightness(1.2) drop-shadow(0 0 10px #FFD700)"
                    : "brightness(0.7)",
              }}
            />
          ))}
        </div>

        {/* =======================
            圖鑑 + 浮動手指（保留）
            ======================= */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: isMobile ? 10 : 18,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 30,
          }}
        >
          {/* 圖鑑圖片（視覺） */}
          <div style={{ position: "relative" }}>
            <img
              src="/illustratedbook.png"
              alt="Illustrated Book"
              style={{
                width: isMobile ? 86 : 120,
                height: "auto",
                display: "block",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
                transform: "translateZ(0)",
              }}
            />
            {/* ✅ 透明 hit area（不讓圖片本體參與互動排版） */}
            <button
              type="button"
              onClick={() => alert("圖鑑功能開發中...")}
              style={{
                position: "absolute",
                inset: 0,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Open illustrated book"
            />

            {/* 浮動手指提示（不接收點擊） */}
            <img
              src="/handpoint.png"
              alt="Hand Point"
              style={{
                position: "absolute",
                top: isMobile ? -42 : -54,
                right: isMobile ? -30 : -40,
                width: isMobile ? 52 : 72,
                height: "auto",
                animation: "floatFinger 1.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== 照片 Lightbox Modal ===== */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
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
              top: 24,
              right: 24,
              fontSize: 42,
              color: "white",
              background: "rgba(0, 0, 0, 0.55)",
              border: "none",
              cursor: "pointer",
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* CSS 動畫 */}
      <style>{`
        @keyframes dropSock {
          0% {
            top: -120px;
            opacity: 1;
            transform: translateX(-50%) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) rotate(180deg);
          }
          100% {
            top: 52%;
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
