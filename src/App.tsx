import { useState, useEffect } from "react";
import Login from "./Login";
import ProfileSetup from "./ProfileSetup";
import StartScreen from "./StartScreen";
import CanvasDrawing from "./CanvasDrawing";
import LetterPage from "./LetterPage";
import { supabase } from "./supabaseClient";

// Cloudinary 設定
const CLOUDINARY_CLOUD_NAME = "dycwc1hge";
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

  /* ================= 初始化 ================= */

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

  const resetToLogin = () => {
    setIsLoggedIn(false);
    setHasProfile(false);
    setShowCanvas(false);
    setShowLetter(false);
    setLoading(false);
  };

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        resetToLogin();
        return;
      }

      setUserId(session.user.id);
      setUserEmail(session.user.email || "");
      setIsLoggedIn(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setUserName(profile.name);
        setUserColor(profile.color);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  /* ================= Login / Verify ================= */

  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setUserEmail(email);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;

      setAwaitingVerification(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: code,
        type: "email",
      });

      if (error) throw error;

      setAwaitingVerification(false);
      await checkAuth();
    } catch {
      setError("驗證碼錯誤");
      setIsVerifying(false);
    }
  };

  /* ================= Profile ================= */

  const handleProfileComplete = async (name: string, color: string) => {
    setLoading(true);

    try {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        email: userEmail,
        name,
        color,
      });

      if (error) throw error;

      setUserName(name);
      setUserColor(color);
      setHasProfile(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ================= Canvas ================= */

  const handleStart = () => {
    setShowCanvas(true);
  };

  const handleCanvasFinish = async (imageDataUrl: string) => {
    setLoading(true);

    try {
      // ✅ 修正 1：base64 → Blob
      const blob = await fetch(imageDataUrl).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("Cloudinary 上傳失敗");
      }

      const { data: sockData, error } = await supabase
        .from("socks")
        .insert({
          user_email: userEmail,
          sock_name: userName,
          color_hex: userColor,
          image_url: data.secure_url,
        })
        .select()
        .single();

      if (error) throw error;

      setSockId(sockData.id);

      // ✅ 成功後才切頁
      setShowCanvas(false);
      setShowLetter(true);
    } catch (err: any) {
      console.error(err);
      setError(`儲存失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Letter ================= */

  const handleLetterComplete = async (
    messageYearEnd: string,
    messageFuture: string
  ) => {
    if (!sockId) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("socks")
        .update({
          message_year_end: messageYearEnd,
          message_future: messageFuture,
        })
        .eq("id", sockId);

      if (error) throw error;

      alert("你的聖誕襪和祝福已經完成了！🎄");
      setShowLetter(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Render ================= */

  if (loading) {
    return <div style={{ color: "white" }}>載入中...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={resetToLogin}>返回登入</button>
      </div>
    );
  }

  if (!isLoggedIn && !awaitingVerification) {
    return <Login onEmailSubmit={handleEmailLogin} />;
  }

  if (awaitingVerification) {
    return (
      <div>
        <input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button onClick={() => handleVerifyCode(verificationCode)}>
          驗證
        </button>
      </div>
    );
  }

  if (isLoggedIn && !hasProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  // ✅ 修正 2：避免搶渲染
  if (isLoggedIn && hasProfile && !showCanvas && !showLetter) {
    return <StartScreen onStart={handleStart} />;
  }

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

  if (showLetter) {
    return <LetterPage onComplete={handleLetterComplete} />;
  }

  return null;
}
