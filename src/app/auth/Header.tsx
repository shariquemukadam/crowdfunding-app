"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get the current user
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
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f0f8ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link href="/about" style={{ marginRight: '1rem' }}>About</Link>
        <Link href="/campaigns" style={{ marginRight: '1rem' }}>Campaigns</Link>
        <Link href="/contact" style={{ marginRight: '1rem' }}>Contact</Link>
        <Link href="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link href="/lend" style={{ marginRight: '1rem' }}>Lend</Link>
        <Link href="/donate">Donate</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>{user.email}</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <Link href="/auth">Sign In</Link>
        )}
      </div>
    </header>
  );
}