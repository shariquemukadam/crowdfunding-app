"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useLend } from '../lend/LendContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Fundraiser = {
  id: number;
  student_id: string;
  student_name: string;
  amount_requested: number;
  interest_rate: number;
  goal_amount: number;
  status: string;
  created_at: string;
};

type LendingTransaction = {
  id: number;
  fundraiser_id: number;
  investor_id: string;
  amount_lent: number;
  created_at: string;
};

export default function OverviewTab() {
  const { fundraisers } = useLend();
  const [userId, setUserId] = useState<string | null>(null);
  const [lendingTransactions, setLendingTransactions] = useState<LendingTransaction[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  // Fetch lending transactions
  useEffect(() => {
    const fetchLendingTransactions = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('lending_transactions')
        .select('*')
        .in('fundraiser_id', fundraisers.filter(f => f.student_id === userId).map(f => f.id))
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching lending transactions:', error);
      } else {
        setLendingTransactions(data || []);
      }
    };
    fetchLendingTransactions();
  }, [userId, fundraisers]);

  // Calculate analytics data (money raised per month)
  useEffect(() => {
    const calculateAnalytics = () => {
      const monthlyData: { [key: string]: number } = {};
      lendingTransactions.forEach(transaction => {
        const date = new Date(transaction.created_at);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + transaction.amount_lent;
      });

      const labels = Object.keys(monthlyData).sort();
      const data = labels.map(label => monthlyData[label]);
      setAnalyticsData({ labels, data });
    };
    calculateAnalytics();
  }, [lendingTransactions]);

  const handleRepay = async (lendingTransactionId: number, amount: number) => {
    const { error } = await supabase
      .from('repayments')
      .insert({
        lending_transaction_id: lendingTransactionId,
        amount_repaid: amount,
      });
    if (error) {
      alert('Error making repayment: ' + error.message);
    } else {
      alert('Repayment successful!');
      // Refetch lending transactions to update the UI
      const { data, error: fetchError } = await supabase
        .from('lending_transactions')
        .select('*')
        .in('fundraiser_id', fundraisers.filter(f => f.student_id === userId).map(f => f.id))
        .order('created_at', { ascending: false });
      if (fetchError) {
        console.error('Error fetching lending transactions:', fetchError);
      } else {
        setLendingTransactions(data || []);
      }
    }
  };

  if (!userId) return <p>Loading...</p>;

  const userFundraisers = fundraisers.filter(f => f.student_id === userId);
  const activeCampaigns = userFundraisers.filter(f => f.status === 'active').length;
  const totalMoneyRaised = lendingTransactions.reduce((sum, t) => sum + t.amount_lent, 0);
  const totalSupporters = new Set(lendingTransactions.map(t => t.investor_id)).size;
  const averageDonation = totalSupporters > 0 ? (totalMoneyRaised / totalSupporters).toFixed(2) : 0;

  // Chart data for analytics
  const chartData = {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Money Raised ($)',
        data: analyticsData.data,
        borderColor: '#0070f3',
        backgroundColor: 'rgba(0, 112, 243, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Total Money Raised</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>${totalMoneyRaised}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Active Campaigns</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>{activeCampaigns}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Total Supporters</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>{totalSupporters}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Average Donation</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>${averageDonation}</p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Analytics (Money Raised Over Time)</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>

      {/* Recent Donations */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Recent Donations</h2>
        {lendingTransactions.length === 0 ? (
          <p>No recent donations.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {lendingTransactions.slice(0, 5).map(transaction => {
              const fundraiser = fundraisers.find(f => f.id === transaction.fundraiser_id);
              return (
                <li
                  key={transaction.id}
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{fundraiser?.student_name}’s Campaign</span>
                  <span>${transaction.amount_lent}</span>
                  <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Campaign Performance */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Campaign Performance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {userFundraisers.map(fundraiser => {
            const fundraiserTransactions = lendingTransactions.filter(t => t.fundraiser_id === fundraiser.id);
            const moneyRaised = fundraiserTransactions.reduce((sum, t) => sum + t.amount_lent, 0);
            return (
              <div
                key={fundraiser.id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f0f8ff',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3>{fundraiser.student_name}’s Campaign</h3>
                <p>Goal: ${fundraiser.goal_amount}</p>
                <p>Raised: ${moneyRaised}</p>
                <p>Status: {fundraiser.status}</p>
                {fundraiserTransactions.length > 0 && (
                  <div>
                    <h4>Investors:</h4>
                    {fundraiserTransactions.map(transaction => (
                      <div key={transaction.id} style={{ marginTop: '0.5rem' }}>
                        <p>Investor ID: {transaction.investor_id}</p>
                        <p>Amount Lent: ${transaction.amount_lent}</p>
                        <button
                          onClick={() => {
                            const amount = prompt('Enter repayment amount:');
                            if (amount && !isNaN(parseInt(amount))) {
                              handleRepay(transaction.id, parseInt(amount));
                            }
                          }}
                          style={{ padding: '0.5rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                          Make Repayment
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Campaigns */}
      <div>
        <h2>Active Campaigns</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {userFundraisers.filter(f => f.status === 'active').map(fundraiser => {
            const moneyRaised = lendingTransactions
              .filter(t => t.fundraiser_id === fundraiser.id)
              .reduce((sum, t) => sum + t.amount_lent, 0);
            const progress = fundraiser.goal_amount > 0 ? (moneyRaised / fundraiser.goal_amount) * 100 : 0;
            return (
              <div
                key={fundraiser.id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f0f8ff',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3>{fundraiser.student_name}’s Campaign</h3>
                <p>Goal: ${fundraiser.goal_amount}</p>
                <p>Raised: ${moneyRaised}</p>
                <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px', height: '20px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      backgroundColor: '#0070f3',
                      height: '100%',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <p>{progress.toFixed(2)}% Complete</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}