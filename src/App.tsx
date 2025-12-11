import { useState, useEffect } from "react";
import Login from "./Login";
import ProfileSetup from "./ProfileSetup";
import { supabase } from "./supabaseClient";

export default function App() {
  const [page, setPage] = useState<"login" | "check-email" | "profile-setup" | "home">("login");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // 檢查用戶是否已登入
  useEffect(() => {
    checkUser();

    // 監聽登入狀態變化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        
        if (event === "SIGNED_IN" && session) {
          await handleUserSession(session.user);
        } else if (event === "SIGNED_OUT") {
          setPage("login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await handleUserSession(session.user);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("檢查用戶狀態錯誤：", err);
      setLoading(false);
    }
  };

  const handleUserSession = async (user: any) => {
    try {
      setUserId(user.id);
      setUserEmail(user.email);

      // 檢查 profiles 資料表是否有此用戶資料
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("查詢 profile 錯誤：", profileError);
      }

      if (!profile) {
        // 新用戶，需要設定個人資料
        console.log("新用戶，導向個人資料設定頁");
        setPage("profile-setup");
      } else {
        // 老用戶，直接進入遊戲
        console.log("老用戶，導向遊戲首頁");
        setPage("home");
      }
      setLoading(false);
    } catch (err) {
      console.error("處理用戶 session 錯誤：", err);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    setUserEmail(email);
    
    try {
      console.log("檢查 Email:", email);

      // 先檢查這個 Email 是否已經在 profiles 資料庫中
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("查詢資料庫錯誤：", profileError);
        setError("查詢失敗，請稍後再試");
        setLoading(false);
        return;
      }

      // 無論新舊用戶，都發送 Magic Link
      console.log("發送 Magic Link 到:", email);
      
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (signInError) {
        console.error("發送失敗：", signInError);
        setError("發送失敗，請檢查 Email 是否正確");
        setLoading(false);
        return;
      }

      if (existingProfile) {
        console.log("老用戶 - Magic Link 已發送");
      } else {
        console.log("新用戶 - Magic Link 已發送");
      }
      
      setPage("check-email");
      setLoading(false);
    } catch (err) {
      console.error("登入過程發生錯誤：", err);
      setError("發生錯誤，請稍後再試");
      setLoading(false);
    }
  };

  const handleProfileComplete = async (name: string, color: string) => {
    setLoading(true);
    try {
      // 儲存用戶資料到 profiles 資料表
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userEmail,
          name: name,
          color: color,
        });

      if (insertError) {
        console.error("儲存個人資料失敗：", insertError);
        setError("儲存失敗，請稍後再試");
        setLoading(false);
        return;
      }

      console.log("個人資料已儲存");
      setPage("home");
      setLoading(false);
    } catch (err) {
      console.error("儲存個人資料錯誤：", err);
      setError("發生錯誤");
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
        <div style={{ color: "white", fontSize: "24px" }}>載入中...</div>
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
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          返回登入
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
        <p style={{ fontSize: "16px", color: "#aaa", marginBottom: "10px" }}>
          請點擊信件中的連結完成登入
        </p>
        <p style={{ fontSize: "14px", color: "#888" }}>
          💡 提示：驗證後，下次訪問將自動登入，無需再次驗證
        </p>
      </div>
    );
  }

  if (page === "profile-setup") {
    return <ProfileSetup onComplete={handleProfileComplete} />;
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
        遊戲首頁
      </div>
    );
  }

  return null;
}