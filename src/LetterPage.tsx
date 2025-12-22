import { useState } from "react";
import { supabase } from "./supabaseClient";

type LetterPageProps = {
  userEmail: string;
  imageUrl: string; // Canvas finish 後傳進來的
};

export default function LetterPage({ userEmail, imageUrl }: LetterPageProps) {
  const [yearEnd, setYearEnd] = useState("");
  const [future, setFuture] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!yearEnd || !future) {
      alert("請把今年與明年的話都寫完 🎄");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("socks").insert({
      user_email: userEmail,
      message_year_end: yearEnd,
      message_future: future,
      image_url: imageUrl,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("送出失敗，請再試一次");
      return;
    }

    alert("信已送出 🎅");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
      }}
    >
      {/* 信紙 */}
      <img
        src="/letter.png"
        alt="letter"
        style={{
          width: "280px",
          marginBottom: "30px",
        }}
      />

      <div
        style={{
          width: "320px",
          color: "#fff",
          textAlign: "left",
        }}
      >
        <p>Hohoho～</p>
        <p style={{ fontSize: "14px", lineHeight: 1.6 }}>
          聖誕節是一年的尾聲，也是新的開始。  
          寫下你想對今年的自己、與未來的自己說的話吧。
        </p>

        <label style={{ marginTop: "20px", display: "block" }}>
          今年的我：
        </label>
        <textarea
          value={yearEnd}
          onChange={(e) => setYearEnd(e.target.value)}
          placeholder="寫給今年努力過的自己…"
          style={{
            width: "100%",
            height: "80px",
            marginTop: "6px",
            borderRadius: "6px",
            padding: "8px",
            resize: "none",
          }}
        />

        <label style={{ marginTop: "20px", display: "block" }}>
          明年的我：
        </label>
        <textarea
          value={future}
          onChange={(e) => setFuture(e.target.value)}
          placeholder="寫給未來的自己…"
          style={{
            width: "100%",
            height: "80px",
            marginTop: "6px",
            borderRadius: "6px",
            padding: "8px",
            resize: "none",
          }}
        />
      </div>

      {/* SEND LETTER */}
      <img
        src="/sendButton.png"
        alt="send letter"
        onClick={handleSend}
        style={{
          width: "160px",
          marginTop: "30px",
          cursor: "pointer", // 🔥 手手在這
          opacity: loading ? 0.6 : 1,
        }}
      />
    </div>
  );
}
