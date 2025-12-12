import React, { useState } from "react";

type LoginProps = {
  onEmailSubmit: (email: string) => void;
};

const Login: React.FC<LoginProps> = ({ onEmailSubmit }) => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClick = () => {
    setShowEmailInput(true);
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes("@")) {
      alert("請輸入有效的 Email");
      return;
    }
    setIsLoading(true);
    onEmailSubmit(email);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 背景圖片 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          backgroundImage: "url('/login2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 內容容器 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {!showEmailInput ? (
          /* START 按鈕 */
          <button
            type="button"
            onClick={handleStartClick}
            style={{
              width: "190px",
              height: "90px",
              backgroundImage: "url('/startButton.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.1s ease",
              outline: "none",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label="開始遊戲"
          />
        ) : (
          /* Email 輸入區塊 */
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              maxWidth: "90%",
              width: "400px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "#2d5016",
                marginBottom: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              拯救聖誕節之前,先幫我填寫email吧!!
            </h2>
            <p
              style={{
                color: "#666",
                fontSize: "14px",
                marginBottom: "25px",
              }}
            >
              (一定要填寫正確喔,聖誕老公公才可以寄驚喜消息給你)
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleEmailSubmit();
                }
              }}
              placeholder="請輸入你的 Email"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "10px",
                marginBottom: "20px",
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4CAF50";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
              }}
            />

            <button
              type="button"
              onClick={handleEmailSubmit}
              disabled={isLoading}
              style={{
                width: "220px",
                height: "80px",
                backgroundImage: "url('/iamreadyButton.png')",
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
              aria-label="我準備好了"
            >
              {isLoading && (
                <span style={{ color: "#fff", fontSize: "14px" }}>
                  發送中...
                </span>
              )}
            </button>


          </div>
        )}
      </div>
    </div>
  );
};

export default Login;