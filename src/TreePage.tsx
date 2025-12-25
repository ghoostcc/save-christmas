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
    /* ===============================
       外層：整個螢幕
    =============================== */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#EB9B09",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ===============================
         中層：9:16 固定比例舞台
      =============================== */}
      <div
        style={{
          position: "relative",
          height: "100%",
          aspectRatio: "9 / 16", // ⭐ 關鍵：對應 1080x1920
          backgroundImage: "url('/tree.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain", // ⭐ 不裁切、不放大
        }}
      >
        {/* ===============================
            左側：壁爐 + 火焰 + 照片
        =============================== */}
        <div
          style={{
            position: "absolute",
            left: isMobile ? "6%" : "8%",
            top: isMobile ? "42%" : "38%",
            width: isMobile ? "120px" : "200px",
            height: isMobile ? "140px" : "230px",
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
                top: `${-60 + i * 55}px`,
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

        {/* ===============================
            右上：星星
        =============================== */}
        <img
          src={isComplete ? "/treestaron.png" : "/treestaroff.png"}
          alt="Tree Star"
          style={{
            position: "absolute",
            right: "12%",
            top: "8%",
            width: isMobile ? "50px" : "80px",
            filter: isComplete
              ? "brightness(1.4) drop-shadow(0 0 25px #FFD700)"
              : "brightness(0.8)",
            animation: isComplete ? "starGlow 2s infinite" : "none",
          }}
        />

        {/* ===============================
            下方：圖鑑
        =============================== */}
        <img
          src="/illustratedbook.png"
          alt="Illustrated Book"
          style={{
            position: "absolute",
            bottom: "6%",
            left: "50%",
            transform: "translateX(-50%)",
            width: isMobile ? "70px" : "100px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* ===============================
          Lightbox
      =============================== */}
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
            alt="Preview"
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
