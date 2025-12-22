import { useEffect, useState } from "react";
import Login from "./Login";
import ProfileSetup from "./ProfileSetup";
import StartScreen from "./StartScreen";
import CanvasDrawing from "./CanvasDrawing";
import LetterPage from "./LetterPage";
import { supabase } from "./supabaseClient";

/* ========= Cloudinary ========= */
const CLOUDINARY_CLOUD_NAME = "dycwclhge";
const CLOUDINARY_UPLOAD_PRESET = "save_christmas_sock";

export default function App() {
  /* ========= auth / flow ========= */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [hasProfile, setHasProfile] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  /* ========= user ========= */
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  /* ========= sock ========= */
  const [sockId, setSockId] = useState<number | null>(null);

  /* ========= init ========= */
  useEffect(() => {
    checkAuth();

    const { data } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  /* ========= auth check ========= */
  const checkAuth = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      resetAll();
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setUserId(session.user.id);
    setUserEmail(session.user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", session.user.id)
      .single();

    setHasProfile(!!profile);
    setLoading(false);
  };

  const resetAll = () => {
    setIsLoggedIn(false);
    setAwaitingVerification(false);
    setHasProfile(false);
    setShowCanvas(false);
    setShowLetter(false);
    setSockId(null);
  };

  /* ========= login ========= */
  const handleEmailLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    setUserEmail(email);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) {
      setError(error.message);
    } else {
      setAwaitingVerification(true);
    }

    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: verificationCode,
      type: "email",
    });

    if (error) {
      setError("驗證碼錯誤");
      setIsVerifying(false);
      return;
    }

    setAwaitingVerification(false);
    await checkAuth();
  };

  /* ========= profile ========= */
  const handleProfileComplete = async (name: string, color: string) => {
    setLoading(true);

    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email: userEmail,
      name,
      color,
    });

    if (error) {
      setError(error.message);
    } else {
      setHasProfile(true);
    }

    setLoading(false);
  };

  /* ========= flow ========= */
  const handleStart = () => {
    setShowCanvas(true);
  };

  /* ========= canvas finish ========= */
  const handleCanvasFinish = async (imageDataUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      /* upload to cloudinary */
      const formData = new FormData();
      formData.append("file", imageDataUrl);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const json = await res.json();
      if (!json.secure_url) throw new Error("Cloudinary 上傳失敗");

      /* insert socks (只存必要欄位) */
      const { data, error } = await supabase
        .from("socks")
        .insert({
          user_email: userEmail,
          image_url: json.secure_url,
        })
        .select()
        .single();

      if (error) throw error;

      setSockId(data.id);
      setShowCanvas(false);
      setShowLetter(true);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  /* ========= letter finish ========= */
  const handleLetterComplete = async (
    messageYearEnd: string,
    messageFuture: string
  ) => {
    if (!sockId) return;

    setLoading(true);

    const { error } = await supabase
      .from("socks")
      .update({
        message_year_end: messageYearEnd,
        message_future: messageFuture,
      })
      .eq("id", sockId);

    if (error) {
      setError(error.message);
    } else {
      alert("🎄 聖誕襪與信件完成！");
      resetAll();
    }

    setLoading(false);
  };

  /* ========= render ========= */
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>載入中...</div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        {error}
        <br />
        <button onClick={resetAll}>返回登入</button>
      </div>
    );
  }

  if (!isLoggedIn && !awaitingVerification) {
    return <Login onEmailSubmit={handleEmailLogin} />;
  }

  if (awaitingVerification) {
    return (
      <div style={{ textAlign: "center", color: "white" }}>
        <h2>🔑 輸入驗證碼</h2>
        <input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button onClick={handleVerifyCode} disabled={isVerifying}>
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
    return <CanvasDrawing onFinish={handleCanvasFinish} />;
  }

  if (showLetter) {
    return <LetterPage onComplete={handleLetterComplete} />;
  }

  return null;
}
