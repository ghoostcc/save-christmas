// src/App.tsx
import { useState } from "react";
import Login from "./Login";
import { supabase } from "./supabaseClient";

export default function App() {
  const [page, setPage] = useState<"login" | "home" | "new-user">("login");

  const handleGoogleLogin = async (credential: string) => {
    console.log("Google Token:", credential);

    // 送到 Supabase 伺服器驗證 Google Token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: credential,
    });

    if (error) {
      console.error("登入失敗：", error);
      return;
    }

    const user = data.user;
    console.log("使用者登入成功：", user);

    // 檢查是否已有 profiles 資料
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (!profile) {
      // 新使用者 → 跳到第二頁
      setPage("new-user");
    } else {
      // 老使用者 → 跳到遊戲主畫面
      setPage("home");
    }
  };

  if (page === "login") return <Login onGoogleLogin={handleGoogleLogin} />;
  if (page === "home") return <div>第一張圖 → 遊戲首頁</div>;
  if (page === "new-user") return <div>第二張圖 → 新精靈設定頁</div>;
}
