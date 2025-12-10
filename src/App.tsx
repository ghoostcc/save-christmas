import { useState } from "react";
import Login from "./Login";
import { supabase } from "./supabaseClient";

export default function App() {
  const [page, setPage] = useState<"login" | "check-email" | "home" | "new-user">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    setUserEmail(email);
    
    try {
      console.log("發送 Magic Link 到:", email);

      // 使用 Supabase 的 Magic Link 登入
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        console.error("發送失敗：", signInError);
        setError("發送失敗，請檢查 Email 是否正確");
        setLoading(false);
        return;
      }

      console.log("Magic Link 已發送到:", email);
      setPage("check-email");
    } catch (err) {
      console.error("登入過程發生錯誤：", err);
      setError("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a472a"
      }}>
        <div style={{ color: "white", fontSize: "24px" }}>發送中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a472a"
      }}>
        <div style={{ color: "red", fontSize: "20px", marginBottom: "20px" }}>{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setPage("login");
          }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          重新登入
        </button>
      </div>
    );
  }

  if (page === "login") {
    return <Login onEmailSubmit={handleEmailLogin} />;
  }

  if (page === "check-email") {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a472a",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>📧 請查收您的信箱</h1>
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          我們已經發送驗證連結到：
        </p>
        <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "30px" }}>
          {userEmail}
        </p>
        <p style={{ fontSize: "16px", color: "#aaa" }}>
          請點擊信件中的連結完成登入
        </p>
        <button
          onClick={() => setPage("login")}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          返回登入頁
        </button>
      </div>
    );
  }

  if (page === "home") {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a472a",
        color: "white",
        fontSize: "32px"
      }}>
        遊戲首頁（老使用者）
      </div>
    );
  }

  if (page === "new-user") {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a472a",
        color: "white",
        fontSize: "32px"
      }}>
        新精靈設定頁（新使用者）
      </div>
    );
  }

  return null;
}