import { useState, useEffect } from "react";
import Login from "./Login";
import ProfileSetup from "./ProfileSetup";
import StartScreen from "./StartScreen";
import CanvasDrawing from "./CanvasDrawing";
import LetterPage from "./LetterPage";
import { supabase } from "./supabaseClient";

// ✅ Cloudinary 設定（已確認正確）
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
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  // ========= 初始化登入狀態 =========
  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          await checkAuth();
        }
        if (event === "SIGNED_OUT") {
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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        resetToLogin();
        return;
      }

      setIsLoggedIn(true);
      setUserId(session.user.id);
      setUserEmail(session.user.email || "");

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
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setIsLoggedIn(false);
    setHasProfile(false);
    setShowCanvas(false);
    setShowLetter(false);
    setAwaitingVerification(false);
    setLoading(false);
  };

  // ========= Email 登入 =========
  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    setUserEmail(email);

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

  // ========= 驗證碼 =========
  const handleVerifyCode = async (code: string) => {
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
    }
  };

  // ========= Profile =========
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

  // ========= Start =========
  const handleStart = () => {
    setShowCanvas(true);
  };

  // ========= Canvas Finish =========
  const handleCanvasFinish = async (imageDataUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageDataUrl);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.secure_url) {
        throw new Error("Cloudinary 上傳失敗");
      }

      const { data: sock, error } = await supabase
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

      setSockId(sock.id);
      setShowCanvas(false);
      setShowLetter(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ========= Letter =========
  const handleLetterComplete = async (
    messageYearEnd: string,
    messageFuture: string
  ) => {
    setLoading(true);

    try {
      if (!sockId) throw new Error("找不到襪子 ID");

      const { error } = await supabase
        .from("socks")
        .update({
          message_year_end: messageYearEnd,
          message_future: messageFuture,
        })
        .eq("id", sockId);

      if (error) throw error;

      alert("完成囉 🎄");
      setShowLetter(false);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ========= Render =========
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#1a472a",
          color: "#fff",
          fontSize: "24px",
        }}
      >
        載入中...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a472a",
          color: "red",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>{error}</p>
        <button onClick={resetToLogin}>返回登入</button>
      </div>
    );
  }

  if (!isLoggedIn && !awaitingVerification) {
    return <Login onEmailSubmit={handleEmailLogin} />;
  }

  if (awaitingVerification) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a472a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>輸入驗證碼</h2>
        <p>{userEmail}</p>
        <input
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(e.target.value.replace(/\D/g, ""))
          }
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
