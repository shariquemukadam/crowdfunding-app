"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Keep Image import
import styles from "./styles/Header.module.css";

type UserState = {
  email?: string;
} | null;

export default function Header() {
  const [user, setUser] = useState<UserState>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* Replace text logo with an image */}
        <Link href="/">
          <Image src="/logo.png" alt="Dakshina Logo" width={100} height={50} />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/lend">Lend</Link>
        <Link href="/dashboard">Dashboard</Link>
        {user ? (
          <div className={styles.userSection}>
            <span>{user.email}</span>
            <button
              onClick={handleSignOut}
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/auth">
            <button
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
}
