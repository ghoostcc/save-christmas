import React, { useState } from "react";

type LetterPageProps = {
  onComplete: (messageYearEnd: string, messageFuture: string) => void;
};

const LetterPage: React.FC<LetterPageProps> = ({ onComplete }) => {
  const [messageYearEnd, setMessageYearEnd] = useState("");
  const [messageFuture, setMessageFuture] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 768;

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
    /* ====== 全頁背景（只有一張圖） ====== */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/letterbackground-mobile.png')"
          : "url('/letterbackground.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ====== 用來當座標系的容器（跟圖片一樣大） ====== */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "95%" : "650px",
          aspectRatio: "800 / 1120", // ⚠️ 請保持與圖片比例一致
        }}
      >
        {/* ===============================
            今年的我（填寫熱區）
        =============================== */}
        <textarea
          value={messageYearEnd}
          onChange={(e) => setMessageYearEnd(e.target.value)}
          placeholder=""
          disabled={isLoading}
          style={{
            position: "absolute",

            /* ⭐ 微調這四個數字即可 */
            left: "14%",
            top: "44%",
            width: "72%",
            height: "9%",

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

        {/* ===============================
            明年的我（填寫熱區）
        =============================== */}
        <textarea
          value={messageFuture}
          onChange={(e) => setMessageFuture(e.target.value)}
          placeholder=""
          disabled={isLoading}
          style={{
            position: "absolute",

            /* ⭐ 微調這四個數字即可 */
            left: "14%",
            top: "56%",
            width: "72%",
            height: "9%",

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

        {/* ===============================
            SEND LETTER（透明按鈕熱區）
        =============================== */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="送出信件"
          style={{
            position: "absolute",

            /* ⭐ 對齊圖中的 SEND LETTER */
            left: "50%",
            bottom: "7%",
            transform: "translateX(-50%)",

            width: "26%",
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
