import React, { useState, useEffect } from "react";

type LetterPageProps = {
  onComplete: (messageYearEnd: string, messageFuture: string) => void;
};

const LetterPage: React.FC<LetterPageProps> = ({ onComplete }) => {
  const [messageYearEnd, setMessageYearEnd] = useState("");
  const [messageFuture, setMessageFuture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async () => {
    if (!messageYearEnd.trim() || !messageFuture.trim()) {
      alert("請填寫兩個訊息欄位");
      return;
    }
    setIsLoading(true);
    try {
      await onComplete(messageYearEnd, messageFuture);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* ✅ 全頁固定 viewport，DevTools 不影響 */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/letterbackground-mobile.png')"
          : "url('/letterbackground.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundColor: "#000", // 防止留白
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ✅ 當作「圖片座標系」的容器 */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "95%" : "650px",
          aspectRatio: "800 / 1120",
        }}
      >
        {/* 今年的我 */}
        <textarea
          value={messageYearEnd}
          onChange={(e) => setMessageYearEnd(e.target.value)}
          disabled={isLoading}
          style={{
            position: "absolute",
            left: "24%",
            top: "44%",
            width: "330px",
            height: "54px",

            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            resize: "none",

            fontFamily: "'Noto Sans TC', sans-serif",
            fontSize: isMobile ? "0.85rem" : "1rem",
            lineHeight: 1.6,
            color: "#5A2E1A",

            boxSizing: "border-box",
          }}
        />

        {/* 明年的我 */}
        <textarea
          value={messageFuture}
          onChange={(e) => setMessageFuture(e.target.value)}
          disabled={isLoading}
          style={{
            position: "absolute",
            left: "24%",
            top: "55%",
            width: "330px",
            height: "54px",

            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            resize: "none",

            fontFamily: "'Noto Sans TC', sans-serif",
            fontSize: isMobile ? "0.85rem" : "1rem",
            lineHeight: 1.6,
            color: "#5A2E1A",

            boxSizing: "border-box",
          }}
        />

        {/* SEND LETTER 按鈕熱區 */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="送出信件"
          style={{
            position: "absolute",
            left: "49%",
            bottom: "20%",
            transform: "translateX(-50%)",
            width: "24%",
            height: "10%",
            backgroundColor: "transparent",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default LetterPage;
