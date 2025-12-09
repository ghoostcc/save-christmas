import React, { useEffect } from "react";

type LoginProps = {
  onGoogleLogin: (credential: string) => void;
};

// 定義 Google One Tap 的 TypeScript 類型
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const Login: React.FC<LoginProps> = ({ onGoogleLogin }) => {
  useEffect(() => {
    // 等待 Google Script 載入完成
    const initializeGoogleOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "595891928592-5tg3ojbseff3c61oiqoucsq8vb8je0bn.apps.googleusercontent.com",
          callback: (res: any) => {
            console.log("Google One Tap 回傳：", res);
            if (res.credential) {
              onGoogleLogin(res.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        
        // 取消自動彈出
        window.google.accounts.id.cancel();
      } else {
        // 如果 Google Script 還沒載入，等待一下再試
        setTimeout(initializeGoogleOneTap, 100);
      }
    };

    initializeGoogleOneTap();
  }, [onGoogleLogin]);

  const handleStart = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("One Tap 未顯示或被跳過");
        }
      });
    } else {
      console.error("Google One Tap 尚未載入");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/login2.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={handleStart}
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
    </div>
  );
};

export default Login;