import { useState, useEffect } from "react";
import Login from "./Login";
import ProfileSetup from "./ProfileSetup";
import StartScreen from "./StartScreen";
import CanvasDrawing from "./CanvasDrawing";
import LetterPage from "./LetterPage";
import { supabase } from "./supabaseClient";

// Cloudinary 設定
const CLOUDINARY_CLOUD_NAME = "dycwclhge";
const CLOUDINARY_UPLOAD_PRESET = "save_christmas_sock";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userColor, setUserColor] = useState("");
  const [sockId, setSockId] = useState<number | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  // 初始化：檢查用戶登入狀態
  useEffect(() => {
    console.log("🚀 App 初始化");
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔔 Auth event:", event);
        if (event === "SIGNED_IN" && session) {
          await checkAuth();
        } else if (event === "SIGNED_OUT") {
          resetToLogin();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log("🔍 檢查認證狀態...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("❌ 未登入");
        resetToLogin();
        return;
      }

      console.log("✅ 已登入, userId:", session.user.id);
      setUserId(session.user.id);
      setUserEmail(session.user.email || "");
      setIsLoggedIn(true);

      // 檢查是否有 profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        console.log("✅ 找到 profile:", profile);
        setUserName(profile.name);
        setUserColor(profile.color);
        setHasProfile(true);
      } else {
        console.log("❌ 沒有 profile，需要設定");
        setHasProfile(false);
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ 檢查認證錯誤:", err);
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setIsLoggedIn(false);
    setHasProfile(false);
    setShowCanvas(false);
    setShowLetter(false);
    setLoading(false);
  };

  // 登入處理
  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    setUserEmail(email);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: true },
      });

      if (signInError) throw signInError;

      console.log("✅ 驗證碼已發送");
      setAwaitingVerification(true);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ 登入錯誤:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // 驗證碼處理
  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: code,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      console.log("✅ 驗證成功");
      setAwaitingVerification(false);
      await checkAuth();
    } catch (err: any) {
      console.error("❌ 驗證錯誤:", err);
      setError("驗證碼錯誤");
      setIsVerifying(false);
    }
  };

  // Profile 設定完成
  const handleProfileComplete = async (name: string, color: string) => {
    setLoading(true);
    
    try {
      console.log("💾 儲存 profile...");
      
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userEmail,
          name: name,
          color: color,
        });

      if (insertError) throw insertError;

      console.log("✅ Profile 儲存成功");
      setUserName(name);
      setUserColor(color);
      setHasProfile(true);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ 儲存錯誤:", err);
      setError(`儲存失敗: ${err.message}`);
      setLoading(false);
    }
  };

  // Start 按鈕
  const handleStart = () => {
    console.log("▶️ 開始繪製");
    setShowCanvas(true);
  };

  // Canvas 完成
  const handleCanvasFinish = async (imageDataUrl: string) => {
    setLoading(true);
    
    try {
      console.log("📤 上傳圖片到 Cloudinary...");
      
      // 上傳到 Cloudinary
      const formData = new FormData();
      formData.append('file', imageDataUrl);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      const imageUrl = data.secure_url;

      console.log("✅ 圖片上傳成功:", imageUrl);

      // 儲存到 Supabase
      const { data: sockData, error: insertError } = await supabase
        .from('socks')
        .insert({
          user_email: userEmail,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("✅ 襪子已儲存，ID:", sockData.id);
      setSockId(sockData.id);
      setShowCanvas(false);
      setShowLetter(true);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ 儲存失敗:", err);
      setError(`儲存失敗: ${err.message}`);
      setLoading(false);
    }
  };

  // Letter 完成
  const handleLetterComplete = async (messageYearEnd: string, messageFuture: string) => {
    setLoading(true);
    
    try {
      console.log("💌 更新信件內容...");

      if (!sockId) {
        throw new Error("找不到襪子 ID");
      }

      // 更新 Supabase socks 資料
      const { error: updateError } = await supabase
        .from('socks')
        .update({
          message_year_end: messageYearEnd,
          message_future: messageFuture,
        })
        .eq('id', sockId);

      if (updateError) throw updateError;

      console.log("✅ 信件已儲存！");
      alert("你的聖誕襪和祝福已經完成了！🎄");
      setShowLetter(false);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ 儲存信件失敗:", err);
      setError(`儲存失敗: ${err.message}`);
      setLoading(false);
    }
  };

  // Loading 畫面
  if (loading) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#1a472a" }}>
        <div style={{ color: "white", fontSize: "24px" }}>載入中...</div>
      </div>
    );
  }

  // Error 畫面
  if (error) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#1a472a", padding: "20px" }}>
        <div style={{ color: "red", fontSize: "20px", marginBottom: "20px", textAlign: "center" }}>{error}</div>
        <button onClick={() => { setError(null); resetToLogin(); }} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
          返回登入
        </button>
      </div>
    );
  }

  // 未登入 - 顯示登入頁
  if (!isLoggedIn && !awaitingVerification) {
    return <Login onEmailSubmit={handleEmailLogin} />;
  }

  // 等待驗證碼
  if (awaitingVerification) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#1a472a", color: "white", padding: "20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>🔑 輸入驗證碼</h1>
        <p style={{ fontSize: "18px", marginBottom: "30px" }}>已發送到：{userEmail}</p>
        <input
          type="text"
          inputMode="numeric"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          placeholder="請輸入驗證碼"
          disabled={isVerifying}
          style={{ width: "320px", padding: "15px", fontSize: "24px", textAlign: "center", letterSpacing: "4px", border: "2px solid #ddd", borderRadius: "10px", marginBottom: "20px", color: "#333" }}
        />
        <button onClick={() => handleVerifyCode(verificationCode)} disabled={isVerifying || verificationCode.length < 6} style={{ padding: "12px 40px", fontSize: "18px", cursor: verificationCode.length >= 6 ? "pointer" : "not-allowed", backgroundColor: verificationCode.length >= 6 ? "#4CAF50" : "#ccc", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
          {isVerifying ? "驗證中..." : "驗證"}
        </button>
      </div>
    );
  }

  // 已登入但沒有 profile - 顯示設定頁
  if (isLoggedIn && !hasProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  // 已登入且有 profile，但還沒開始繪製 - 顯示 Start 畫面
  if (isLoggedIn && hasProfile && !showCanvas && !showLetter) {
    return <StartScreen onStart={handleStart} />;
  }

  // 顯示畫布
  if (showCanvas) {
    return (
      <CanvasDrawing
        userEmail={userEmail}
        userName={userName}
        userColor={userColor}
        onFinish={handleCanvasFinish}
      />
    );
  }

  // 顯示信件頁面
  if (showLetter) {
    return <LetterPage onComplete={handleLetterComplete} />;
  }

  return null;
}