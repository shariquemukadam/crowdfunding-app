"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import styles from '../styles/Page.module.css';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        router.push('/dashboard'); // Redirect to dashboard if already logged in
      }
    };
    fetchUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isSignUp) {
      // Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Sign-up successful! Please check your email to confirm.');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
      }
    } else {
      // Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Sign-in successful!');
        setUser(data.user);
        router.push('/dashboard'); // Redirect to dashboard after sign-in
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const redirectTo = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : 'http://localhost:3000/dashboard';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) {
      setError('Error signing in with Google: ' + error.message);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form fields and messages when switching modes
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setError(null);
    setSuccess(null);
  };

  if (user) {
    return null; // Redirecting to dashboard, so render nothing
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={handleAuth} style={{ maxWidth: '400px', margin: '0 auto' }}>
          {isSignUp && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  First Name:
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Last Name:
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                  />
                </label>
              </div>
            </>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </label>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.5rem 2rem',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={handleToggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#0070f3',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem',
              }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        {/* Add Google Sign-In Button */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={handleGoogleSignIn}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Sign in with Google
          </button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{success}</p>}
      </main>
      <FloatingIcon />
    </div>
  );
}