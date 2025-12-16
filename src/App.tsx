import { useState, useEffect } from "react";
import Login from "./Login";
import ProfileSetup from "./ProfileSetup";
import StartScreen from "./StartScreen";
import CanvasDrawing from "./CanvasDrawing";
import { supabase } from "./supabaseClient";

// Cloudinary 設定
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME"; // 替換成你的 cloud name
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // 替換成你的 upload preset

export default function App() {
  const [page, setPage] = useState<"login" | "verify-code" | "profile-setup" | "start" | "canvas" | "home">("login");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userColor, setUserColor] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // 除錯：監控 page 狀態變化
  useEffect(() => {
    console.log("📍 當前頁面:", page);
    console.log("👤 用戶資料:", { userName, userColor, userEmail });
  }, [page, userName, userColor, userEmail]);

  // 檢查用戶是否已登入
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        await checkUser();
      } catch (err) {
        console.error("初始化錯誤：", err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('access_token')) {
      console.log("檢測到驗證 token，正在處理...");
      window.history.replaceState(null, '', window.location.pathname);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session);
        
        if (event === "SIGNED_IN" && session && mounted) {
          await handleUserSession(session.user);
        } else if (event === "SIGNED_OUT" && mounted) {
          setPage("login");
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      console.log("🔍 檢查用戶登入狀態...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ 取得 session 錯誤：", error);
        setLoading(false);
        return;
      }
      
      if (session) {
        console.log("✅ 找到 session，用戶已登入");
        await handleUserSession(session.user);
      } else {
        console.log("❌ 無 session，顯示登入頁");
        setLoading(false);
      }
    } catch (err) {
      console.error("檢查用戶狀態錯誤：", err);
      setLoading(false);
    }
  };

  const handleUserSession = async (user: any) => {
    try {
      console.log("🔄 處理用戶 session:", user.id);
      setUserId(user.id);
      setUserEmail(user.email);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("❌ 查詢 profile 錯誤：", profileError);
      }

      if (!profile) {
        console.log("👤 新用戶，導向個人資料設定頁");
        setPage("profile-setup");
      } else {
        console.log("👤 老用戶，資料:", profile);
        setUserName(profile.name);
        setUserColor(profile.color);
        console.log("🎯 導向 START 頁面");
        setPage("start");
      }
    } catch (err) {
      console.error("處理用戶 session 錯誤：", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    setUserEmail(email);
    
    try {
      console.log("📧 發送驗證碼到:", email);

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (signInError) {
        console.error("❌ 發送失敗：", signInError);
        setError("發送失敗，請檢查 Email 是否正確");
        setLoading(false);
        return;
      }

      console.log("✅ 驗證碼已發送");
      setPage("verify-code");
      setLoading(false);
    } catch (err) {
      console.error("登入過程發生錯誤：", err);
      setError("發生錯誤，請稍後再試");
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      console.log("🔐 驗證碼：", code);

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: code,
        type: 'email',
      });

      if (verifyError) {
        console.error("❌ 驗證失敗：", verifyError);
        setError("驗證碼錯誤，請重新輸入");
        setIsVerifying(false);
        return;
      }

      if (data.user) {
        await handleUserSession(data.user);
      }
      setIsVerifying(false);
    } catch (err) {
      console.error("驗證過程發生錯誤：", err);
      setError("驗證失敗");
      setIsVerifying(false);
    }
  };

  const handleProfileComplete = async (name: string, color: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("💾 儲存個人資料:", { userId, userEmail, name, color });

      if (!userId) {
        setError("用戶 ID 不存在，請重新登入");
        setLoading(false);
        setPage("login");
        return;
      }

      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userEmail,
          name: name,
          color: color,
        });

      if (insertError) {
        console.error("❌ 儲存個人資料失敗：", insertError);
        setError(`儲存失敗：${insertError.message}`);
        setLoading(false);
        return;
      }

      console.log("✅ 個人資料已儲存成功，重新載入頁面");
      
      // 儲存成功後重新載入頁面，讓系統重新檢查用戶狀態
      window.location.reload();
    } catch (err: any) {
      console.error("儲存個人資料錯誤：", err);
      setError(`發生錯誤：${err.message || '未知錯誤'}`);
      setLoading(false);
    }
  };

  const handleStart = () => {
    console.log("▶️ 按下 START，導向畫布頁面");
    setPage("canvas");
  };

  const handleCanvasFinish = async (imageDataUrl: string) => {
    setLoading(true);
    
    try {
      console.log("📤 開始上傳圖片到 Cloudinary...");

      const formData = new FormData();
      formData.append('file', imageDataUrl);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'save-christmas');

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Cloudinary 上傳失敗');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      console.log("✅ 圖片上傳成功:", imageUrl);

      const { error: insertError } = await supabase
        .from('socks')
        .insert({
          user_email: userEmail,
          sock_name: userName,
          color_hex: userColor,
          image_url: imageUrl,
        });

      if (insertError) {
        console.error("❌ 儲存到資料庫失敗：", insertError);
        setError(`儲存失敗：${insertError.message}`);
        setLoading(false);
        return;
      }

      console.log("✅ 襪子已儲存成功");
      setPage("home");
      setLoading(false);
    } catch (err: any) {
      console.error("❌ 儲存圖片失敗：", err);
      setError(`上傳失敗：${err.message || '未知錯誤'}`);
      setLoading(false);
    }
  };

  // 渲染前的 debug 資訊
  console.log("🎨 準備渲染頁面:", page);

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
    console.log("✅ 渲染 Login 頁面");
    return <Login onEmailSubmit={handleEmailLogin} />;
  }

  if (page === "verify-code") {
    console.log("✅ 渲染驗證碼頁面");
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
        <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>🔑 輸入驗證碼</h1>
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          我們已經發送驗證碼到：
        </p>
        <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "30px" }}>
          {userEmail}
        </p>
        
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setVerificationCode(value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" && verificationCode.length >= 6) {
              handleVerifyCode(verificationCode);
            }
          }}
          placeholder="請輸入驗證碼"
          disabled={isVerifying}
          style={{
            width: "320px",
            padding: "15px",
            fontSize: "24px",
            textAlign: "center",
            letterSpacing: "4px",
            border: "2px solid #ddd",
            borderRadius: "10px",
            marginBottom: "20px",
            outline: "none",
            backgroundColor: isVerifying ? "#f0f0f0" : "white",
            color: "#333",
          }}
        />

        <button
          onClick={() => handleVerifyCode(verificationCode)}
          disabled={isVerifying || verificationCode.length < 6}
          style={{
            padding: "12px 40px",
            fontSize: "18px",
            cursor: isVerifying || verificationCode.length < 6 ? "not-allowed" : "pointer",
            backgroundColor: verificationCode.length >= 6 ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          {isVerifying ? "驗證中..." : "驗證"}
        </button>
      </div>
    );
  }

  if (page === "profile-setup") {
    console.log("✅ 渲染 ProfileSetup 頁面");
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  if (page === "start") {
    console.log("✅ 渲染 StartScreen 頁面");
    return <StartScreen onStart={handleStart} />;
  }

  if (page === "canvas") {
    console.log("✅ 渲染 CanvasDrawing 頁面");
    return (
      <CanvasDrawing
        userEmail={userEmail}
        userName={userName}
        userColor={userColor}
        onFinish={handleCanvasFinish}
      />
    );
  }

  if (page === "home") {
    console.log("✅ 渲染完成頁面");
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a472a",
        color: "white"
      }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>🎄</h1>
        <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>完成！</h2>
        <p style={{ fontSize: "18px" }}>你的聖誕襪已經準備好了</p>
      </div>
    );
  }

  console.log("⚠️ 未知頁面狀態:", page);
  return null;
}