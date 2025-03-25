"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignUp) {
      // Sign Up
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign-up successful! Please check your email to confirm.');
      }
    } else {
      // Sign In
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign-in successful!');
        window.location.href = '/dashboard'; // Redirect to dashboard
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleAuth}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
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
          <label>
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
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}