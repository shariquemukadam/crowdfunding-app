"use client";

import { useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard"); // Redirect to dashboard if logged in
      }
    };
    fetchUser();
  }, [router]);

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h1>Welcome to Dakshina</h1>
      <p>Please sign in to access your account.</p>
      <a href="/auth" style={{ color: "#0070f3", textDecoration: "underline" }}>
        Sign In
      </a>
    </div>
  );
}
