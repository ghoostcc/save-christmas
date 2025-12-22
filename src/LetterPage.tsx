import { useState } from "react";

interface LetterPageProps {
  onComplete: (messageYearEnd: string, messageFuture: string) => void;
}

export default function LetterPage({ onComplete }: LetterPageProps) {
  const [yearMessage, setYearMessage] = useState("");
  const [futureMessage, setFutureMessage] = useState("");

  const handleSend = () => {
    if (!yearMessage.trim() || !futureMessage.trim()) {
      alert("請完成兩段文字再送出唷 🎄");
      return;
    }
    onComplete(yearMessage, futureMessage);
  };

  return (
    <div className="letter-page">
      {/* 信紙 */}
      <div className="letter-paper">
        <div className="letter-content">
          <p>Hohoho～</p>
          <p>
            聖誕節是最靠近一年結尾，也是最貼近新一年起點的時刻呢！
            <br />
            我們一起掛上了聖誕襪，為聖誕樹集滿點燈的能量
          </p>
          <p>
            最後邀請你
            <br />
            給今年的自己、和明年的自己各說一句話，或是偷偷許個願！
          </p>

          <div className="field">
            <label>今年的我：</label>
            <textarea
              value={yearMessage}
              onChange={(e) => setYearMessage(e.target.value)}
              placeholder="寫給今年努力過的自己…"
            />
          </div>

          <div className="field">
            <label>明年的我：</label>
            <textarea
              value={futureMessage}
              onChange={(e) => setFutureMessage(e.target.value)}
              placeholder="寫給未來的自己…"
            />
          </div>

          <p className="ps">
            P.S 聖誕節可是最容易讓奇蹟悄悄降臨的日子呢～Hohoho！
          </p>
        </div>
      </div>

      {/* 送出按鈕 */}
      <img
        src="/sendButton.png"
        alt="Send Letter"
        className="send-button"
        onClick={handleSend}
      />
    </div>
  );
}
