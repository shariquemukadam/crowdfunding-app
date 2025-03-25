"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from './styles/Header.module.css';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Listen for auth state changes
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
    router.push('/'); // Redirect to home page after sign-out
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">FundRaiser</Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/lend">Lend</Link>
        <Link href="/dashboard">Dashboard</Link>
        {user ? (
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{user.email}</span>
            <button
              onClick={handleSignOut}
              className={styles.authButton}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '1rem',
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link href="/auth">
              <button
                className={styles.authButton}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '1rem',
                }}
              >
                Sign In
              </button>
            </Link>
            <Link href="/auth">
              <button
                className={styles.authButton}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e0e0e0',
                  color: 'black',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}