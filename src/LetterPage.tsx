import React, { useState } from "react";

type LetterPageProps = {
  onComplete: (messageYearEnd: string, messageFuture: string) => void;
};

const LetterPage: React.FC<LetterPageProps> = ({ onComplete }) => {
  const [messageYearEnd, setMessageYearEnd] = useState("");
  const [messageFuture, setMessageFuture] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!messageYearEnd.trim() || !messageFuture.trim()) {
      alert("請填寫兩個訊息欄位");
      return;
    }
    setIsLoading(true);
    try {
      await onComplete(messageYearEnd, messageFuture);
    } catch (error) {
      console.error("提交失敗:", error);
      setIsLoading(false);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: isMobile ? "url('/letterbackground-mobile.png')" : "url('/letterbackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      {/* 整個信紙區域 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: isMobile ? "95%" : "650px",
          backgroundImage: "url('/letter.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          paddingTop: isMobile ? "140%" : "140%",
        }}
      >
        {/* 內容層 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            padding: isMobile ? "15% 10% 8% 10%" : "17% 12% 10% 12%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Hohoho 開頭 */}
          <div
            style={{
              width: "100%",
              color: "#C65D3B",
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              lineHeight: "1.6",
              marginBottom: "4%",
              textAlign: "left",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          >
            <p style={{ margin: "0 0 3% 0", fontWeight: "bold", fontSize: "1.1em" }}>Hohoho～</p>
            <p style={{ margin: "0 0 2.5% 0" }}>聖誕節是最靠近一年結尾，也是最貼近新一年起點的時刻呢！</p>
            <p style={{ margin: "0 0 2.5% 0" }}>我們一起掛上了聖誕襪，為聖誕樹集滿點燈的能量</p>
            <p style={{ margin: "0 0 2% 0" }}>最後邀請你</p>
            <p style={{ margin: "0 0 4% 0" }}>給今年的自己、和明年的自己各說一句話，或是偷偷許個願！</p>
          </div>

          {/* 今年的我 */}
          <div style={{ width: "100%", marginBottom: "4%" }}>
            <label
              style={{
                display: "block",
                color: "#C65D3B",
                fontSize: isMobile ? "0.8rem" : "0.95rem",
                marginBottom: "2%",
                fontWeight: "600",
                fontFamily: "'Noto Sans TC', sans-serif",
              }}
            >
              今年的我:
            </label>
            <textarea
              value={messageYearEnd}
              onChange={(e) => setMessageYearEnd(e.target.value)}
              placeholder="寫下給今年自己的話..."
              disabled={isLoading}
              rows={3}
              style={{
                width: "100%",
                padding: "3%",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                border: "1px dashed #D2691E",
                borderRadius: "5px",
                backgroundColor: "rgba(255, 250, 240, 0.95)",
                resize: "vertical",
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#333",
                boxSizing: "border-box",
                lineHeight: "1.5",
              }}
            />
          </div>

          {/* 明年的我 */}
          <div style={{ width: "100%", marginBottom: "4%" }}>
            <label
              style={{
                display: "block",
                color: "#C65D3B",
                fontSize: isMobile ? "0.8rem" : "0.95rem",
                marginBottom: "2%",
                fontWeight: "600",
                fontFamily: "'Noto Sans TC', sans-serif",
              }}
            >
              明年的我:
            </label>
            <textarea
              value={messageFuture}
              onChange={(e) => setMessageFuture(e.target.value)}
              placeholder="寫下給明年自己的話..."
              disabled={isLoading}
              rows={3}
              style={{
                width: "100%",
                padding: "3%",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                border: "1px dashed #D2691E",
                borderRadius: "5px",
                backgroundColor: "rgba(255, 250, 240, 0.95)",
                resize: "vertical",
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#333",
                boxSizing: "border-box",
                lineHeight: "1.5",
              }}
            />
          </div>

          {/* P.S. */}
          <div
            style={{
              width: "100%",
              color: "#C65D3B",
              fontSize: isMobile ? "0.7rem" : "0.8rem",
              marginBottom: "5%",
              textAlign: "left",
              fontStyle: "italic",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          >
            P.S 聖誕節可是最容易讓奇蹟悄悄降臨的日子呢～Hohoho！
          </div>

          {/* Send Button - 靠近信封口 */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "auto" }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: isMobile ? "90px" : "110px",
                height: isMobile ? "45px" : "55px",
                backgroundImage: "url('/sendButton.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "transparent",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "transform 0.1s ease",
                outline: "none",
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseDown={(e) => {
                if (!isLoading) e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              aria-label="發送信件"
            >
              {isLoading && <span style={{ color: "#fff", fontSize: "12px" }}>發送中...</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterPage;