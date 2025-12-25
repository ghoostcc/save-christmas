import React, { useState } from "react";

type TreePageProps = {
  totalSocksCount: number;
};

const TreePage: React.FC<TreePageProps> = ({ totalSocksCount }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const isComplete = totalSocksCount >= 30;

  return (
    /* ===============================
       外層：整個瀏覽器視窗
    =============================== */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#EB9B09", // 你指定的底色
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ===============================
         內層：桌機橫向舞台
      =============================== */}
      <div
        style={{
          position: "relative",
          height: "100vh",               // ⭐ 關鍵：高度鎖死
          aspectRatio: "1920 / 1080",    // ⭐ 橫式場景
          backgroundImage: "url('/tree.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",     // 不裁切、不放大
        }}
      >
        {/* 左側：壁爐 + 火焰 + 照片 */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: "32%",
            width: "200px",
            height: "230px",
          }}
        >
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
                }}
              />
            </>
          )}

          {["/happy1.png", "/happy2.png"].map((src, i) => (
            <img
              key={src}
              src={src}
              onClick={() => setSelectedPhoto(src)}
              style={{
                position: "absolute",
                top: `${-70 + i * 60}px`,
                left: "5%",
                width: "95px",
                height: "63px",
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
            right: "12%",
            top: "8%",
            width: "80px",
            filter: isComplete
              ? "brightness(1.4) drop-shadow(0 0 25px #FFD700)"
              : "brightness(0.8)",
            animation: isComplete ? "starGlow 2s infinite" : "none",
          }}
        />
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
