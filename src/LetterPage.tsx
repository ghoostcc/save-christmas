import { useState } from "react";

type LetterPageProps = {
  onComplete: (messageYearEnd: string, messageFuture: string) => void;
};

export default function LetterPage({ onComplete }: LetterPageProps) {
  const [yearEnd, setYearEnd] = useState("");
  const [future, setFuture] = useState("");

  const handleSend = () => {
    if (!yearEnd.trim() || !future.trim()) {
      alert("請把兩段話都寫完喔 🎄");
      return;
    }

    onComplete(yearEnd, future);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/letterbackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 信紙 */}
      <div
        style={{
          width: "360px",
          height: "600px",
          backgroundImage: "url('/letter.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          padding: "80px 30px 140px",
          boxSizing: "border-box",
          color: "#333",
        }}
      >
        <p>Hohoho～</p>

        <p style={{ fontSize: "14px", lineHeight: 1.6 }}>
          聖誕節是最靠近一年結尾，也是最貼近新一年起點的時刻呢！
          <br />
          最後請你，給今年的自己，和明年的自己各說一句話。
        </p>

        <label>今年的我：</label>
        <textarea
          value={yearEnd}
          onChange={(e) => setYearEnd(e.target.value)}
          placeholder="寫給今年努力過的自己..."
          style={{
            width: "100%",
            height: "60px",
            marginBottom: "12px",
          }}
        />

        <label>明年的我：</label>
        <textarea
          value={future}
          onChange={(e) => setFuture(e.target.value)}
          placeholder="寫給未來的自己..."
          style={{
            width: "100%",
            height: "60px",
          }}
        />

        {/* Send Button */}
        <div
          onClick={handleSend}
          style={{
            marginTop: "30px",
            width: "160px",
            height: "70px",
            backgroundImage: "url('/sendButton.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            cursor: "pointer",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    </div>
  );
}
