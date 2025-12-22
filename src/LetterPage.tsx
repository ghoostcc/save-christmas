import React, { useState } from "react";

type LetterPageProps = {
  onComplete: (messageYearEnd: string, messageFuture: string) => void;
};

const LetterPage: React.FC<LetterPageProps> = ({ onComplete }) => {
  const [messageYearEnd, setMessageYearEnd] = useState("");
  const [messageFuture, setMessageFuture] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!messageYearEnd.trim() || !messageFuture.trim()) {
      alert("請填寫兩個訊息欄位");
      return;
    }
    setIsLoading(true);
    onComplete(messageYearEnd, messageFuture);
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
        backgroundImage: isMobile
          ? "url('/letterbackground-mobile.png')"
          : "url('/letterbackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* 信紙容器 - 放大尺寸 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "700px",
          minHeight: "850px",
          backgroundImage: "url('/letter.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: isMobile ? "120px 60px 100px 60px" : "140px 80px 120px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* 內文 */}
        <div
          style={{
            width: "100%",
            color: "#8B4513",
            fontSize: isMobile ? "14px" : "15px",
            lineHeight: "1.8",
            marginBottom: "20px",
            textAlign: "left",
            fontFamily: "'Noto Sans TC', sans-serif",
          }}
        >
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>Hohoho～</p>
          <p style={{ margin: "0 0 10px 0" }}>
            聖誕節是最靠近一年結尾，也是最貼近新一年起點的時刻呢！
          </p>
          <p style={{ margin: "0 0 10px 0" }}>
            我們一起掛上了聖誕襪，為聖誕樹集滿點燈的能量
          </p>
          <p style={{ margin: "0 0 8px 0" }}>最後邀請你</p>
          <p style={{ margin: "0 0 20px 0" }}>
            給今年的自己、和明年的自己各說一句話，或是偷偷許個願！
          </p>
        </div>

        {/* 今年的我 */}
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#8B4513",
              fontSize: isMobile ? "14px" : "15px",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            今年的我:
          </label>
          <textarea
            value={messageYearEnd}
            onChange={(e) => setMessageYearEnd(e.target.value)}
            placeholder="寫下給今年自己的話..."
            disabled={isLoading}
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              fontSize: isMobile ? "13px" : "14px",
              border: "1px dashed #D2691E",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 250, 240, 0.9)",
              resize: "vertical",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#333",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* 明年的我 */}
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#8B4513",
              fontSize: isMobile ? "14px" : "15px",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            明年的我:
          </label>
          <textarea
            value={messageFuture}
            onChange={(e) => setMessageFuture(e.target.value)}
            placeholder="寫下給明年自己的話..."
            disabled={isLoading}
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              fontSize: isMobile ? "13px" : "14px",
              border: "1px dashed #D2691E",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 250, 240, 0.9)",
              resize: "vertical",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#333",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* P.S. 文字 */}
        <div
          style={{
            width: "100%",
            color: "#8B4513",
            fontSize: isMobile ? "12px" : "13px",
            marginBottom: "25px",
            textAlign: "left",
            fontStyle: "italic",
          }}
        >
          P.S 聖誕節可是最容易讓奇蹟悄悄降臨的日子呢～Hohoho！
        </div>

        {/* Send Letter 按鈕 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: "150px",
            height: "70px",
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
        />
      </div>
    </div>
  );
};

export default LetterPage;