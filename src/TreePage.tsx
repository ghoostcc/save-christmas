import { useState } from "react";

interface TreePageProps {
  totalSocksCount: number;
}

export default function TreePage({ totalSocksCount }: TreePageProps) {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "relative",
      backgroundImage: "url('/tree.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden"
    }}>
      {/* 壁爐火焰動畫 - 左側壁爐位置 */}
      <div style={{
        position: "absolute",
        left: "180px",
        bottom: "120px",
        width: "80px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
      }}>
        {/* 火焰效果 */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: "0",
              left: `${i * 15}px`,
              width: "20px",
              height: `${40 + Math.random() * 40}px`,
              background: `linear-gradient(to top, #ff6b00, #ff9500, #ffd700)`,
              borderRadius: "50% 50% 0 0",
              animation: `flicker ${0.3 + Math.random() * 0.3}s infinite alternate`,
              opacity: 0.8,
              filter: "blur(2px)"
            }}
          />
        ))}
      </div>

      {/* 聖誕樹下壁爐火焰 - 右側聖誕樹旁壁爐 */}
      <div style={{
        position: "absolute",
        right: "280px",
        bottom: "120px",
        width: "60px",
        height: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
      }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: "0",
              left: `${i * 12}px`,
              width: "15px",
              height: `${30 + Math.random() * 30}px`,
              background: `linear-gradient(to top, #ff6b00, #ff9500, #ffd700)`,
              borderRadius: "50% 50% 0 0",
              animation: `flicker ${0.4 + Math.random() * 0.3}s infinite alternate`,
              opacity: 0.8,
              filter: "blur(2px)"
            }}
          />
        ))}
      </div>

      {/* 左上角圖鑑框互動區 */}
      <button
        onClick={() => setShowGallery(true)}
        style={{
          position: "absolute",
          left: "140px",
          top: "85px",
          width: "90px",
          height: "120px",
          backgroundColor: "transparent",
          border: "3px solid transparent",
          cursor: "pointer",
          transition: "all 0.3s",
          borderRadius: "8px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "3px solid #FFD700";
          e.currentTarget.style.backgroundColor = "rgba(255, 215, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "3px solid transparent";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <span style={{
          position: "absolute",
          bottom: "-30px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
          opacity: 0,
          transition: "opacity 0.3s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
        >
          點擊查看圖鑑
        </span>
      </button>

      {/* 左下角相框互動區 */}
      <button
        onClick={() => alert("相框功能開發中")}
        style={{
          position: "absolute",
          left: "205px",
          bottom: "280px",
          width: "75px",
          height: "75px",
          backgroundColor: "transparent",
          border: "3px solid transparent",
          cursor: "pointer",
          transition: "all 0.3s",
          borderRadius: "8px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "3px solid #FFD700";
          e.currentTarget.style.backgroundColor = "rgba(255, 215, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "3px solid transparent";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      />

      {/* 左下角指引手位置的相框 */}
      <button
        onClick={() => alert("相簿功能開發中")}
        style={{
          position: "absolute",
          left: "295px",
          bottom: "280px",
          width: "85px",
          height: "75px",
          backgroundColor: "transparent",
          border: "3px solid transparent",
          cursor: "pointer",
          transition: "all 0.3s",
          borderRadius: "8px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "3px solid #FFD700";
          e.currentTarget.style.backgroundColor = "rgba(255, 215, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "3px solid transparent";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      />

      {/* 襪子數量顯示 */}
      <div style={{
        position: "absolute",
        top: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(26, 71, 42, 0.9)",
        padding: "15px 30px",
        borderRadius: "20px",
        color: "white",
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        border: "3px solid #FFD700",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
      }}>
        🧦 共有 {totalSocksCount} 個聖誕襪
      </div>

      {/* 圖鑑彈窗 */}
      {showGallery && (
        <div
          onClick={() => setShowGallery(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1a472a",
              padding: "40px",
              borderRadius: "20px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
              border: "3px solid #FFD700"
            }}
          >
            <h2 style={{ color: "white", marginBottom: "20px", textAlign: "center" }}>
              🎄 聖誕襪圖鑑
            </h2>
            <p style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>
              目前收集了 {totalSocksCount} 個聖誕襪！
            </p>
            <button
              onClick={() => setShowGallery(false)}
              style={{
                display: "block",
                margin: "0 auto",
                padding: "10px 30px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              關閉
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes flicker {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.1) translateY(-5px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}