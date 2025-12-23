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
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    /* ====== 全頁背景 ====== */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: isMobile
          ? "url('/letterbackground-mobile.png')"
          : "url('/letterbackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      {/* ====== 信紙畫布（比例已確認 OK） ====== */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "95%" : "650px",
          aspectRatio: "800 / 1120",
          backgroundImage: "url('/letter.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        {/* ====== 內容層 ====== */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "18% 12% 14% 12%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            fontFamily: "'Noto Sans TC', sans-serif",
            color: "#C65D3B",
          }}
        >
          {/* ====== 開頭文字 ====== */}
          <div
            style={{
              fontSize: isMobile ? "0.8rem" : "0.95rem",
              lineHeight: 1.7,
              marginBottom: "6%",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "4%" }}>Hohoho～</p>
            <p>聖誕節是最靠近一年結尾，也是最貼近新一年起點的時刻呢！</p>
            <p>我們一起掛上了聖誕襪，為聖誕樹集滿點燈的能量</p>
            <p>最後邀請你</p>
            <p>
              給今年的自己、和明年的自己各說一句話，或是偷偷許個願！
            </p>
          </div>

          {/* ====== 今年的我 ====== */}
          <div style={{ marginBottom: "6%" }}>
            <label style={{ fontWeight: 600, marginBottom: "2%", display: "block" }}>
              今年的我：
            </label>
            <textarea
              value={messageYearEnd}
              onChange={(e) => setMessageYearEnd(e.target.value)}
              placeholder="寫下給今年自己的話..."
              rows={4}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "4%",
                fontSize: isMobile ? "0.85rem" : "1rem",
                lineHeight: 1.6,
                border: "1px dashed #D2691E",
                borderRadius: 8,
                backgroundColor: "rgba(255,250,240,0.95)",
                color: "#5A2E1A", // ✅ 強制指定文字顏色
                resize: "none",
                boxSizing: "border-box",
                fontFamily: "'Noto Sans TC', sans-serif",
              }}
            />
          </div>

          {/* ====== 明年的我 ====== */}
          <div style={{ marginBottom: "6%" }}>
            <label style={{ fontWeight: 600, marginBottom: "2%", display: "block" }}>
              明年的我：
            </label>
            <textarea
              value={messageFuture}
              onChange={(e) => setMessageFuture(e.target.value)}
              placeholder="寫下給明年自己的話..."
              rows={4}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "4%",
                fontSize: isMobile ? "0.85rem" : "1rem",
                lineHeight: 1.6,
                border: "1px dashed #D2691E",
                borderRadius: 8,
                backgroundColor: "rgba(255,250,240,0.95)",
                color: "#5A2E1A", // ✅ 強制指定文字顏色
                resize: "none",
                boxSizing: "border-box",
                fontFamily: "'Noto Sans TC', sans-serif",
              }}
            />
          </div>

          {/* ====== PS ====== */}
          <div
            style={{
              fontSize: isMobile ? "0.75rem" : "0.85rem",
              fontStyle: "italic",
              marginTop: "auto",
              marginBottom: "8%",
            }}
          >
            P.S 聖誕節可是最容易讓奇蹟悄悄降臨的日子呢～Hohoho！
          </div>
        </div>

        {/* ====== Send Letter 按鈕（蓋住蠟封） ====== */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="送出信件"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "6%",
            transform: "translateX(-50%)",

            width: isMobile ? "140px" : "180px",
            aspectRatio: "1 / 1",

            backgroundImage: "url('/sendButton.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            zIndex: 5,
          }}
          onMouseDown={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform =
                "translateX(-50%) scale(0.95)";
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
          }}
        />
      </div>
    </div>
  );
};

export default LetterPage;
