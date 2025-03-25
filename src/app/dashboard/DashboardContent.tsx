"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../styles/Page.module.css';
import OverviewTab from './OverviewTab.tsx';
import SettingsTab from './SettingsTab.tsx';
import InvestorTab from './InvestorTab.tsx';

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'investor'>('overview');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push('/auth'); // Redirect to auth page if not logged in
      }
    };
    fetchUser();
  }, [router]);

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>Your Dashboard</h1>
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              backgroundColor: activeTab === 'overview' ? '#0070f3' : '#e0e0e0',
              color: activeTab === 'overview' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('investor')}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              backgroundColor: activeTab === 'investor' ? '#0070f3' : '#e0e0e0',
              color: activeTab === 'investor' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Investor View
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === 'settings' ? '#0070f3' : '#e0e0e0',
              color: activeTab === 'settings' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Settings
          </button>
        </div>
        {activeTab === 'overview' ? (
          <OverviewTab />
        ) : activeTab === 'investor' ? (
          <InvestorTab />
        ) : (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}