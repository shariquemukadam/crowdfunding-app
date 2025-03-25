"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type LendingTransaction = {
  id: number;
  fundraiser_id: number;
  investor_id: string;
  amount_lent: number;
  created_at: string;
};

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

type Repayment = {
  id: number;
  lending_transaction_id: number;
  amount_repaid: number;
  repaid_at: string;
};

export default function InvestorTab() {
  const [userId, setUserId] = useState<string | null>(null);
  const [investments, setInvestments] = useState<LendingTransaction[]>([]);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [repayments, setRepayments] = useState<Repayment[]>([]);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  // Fetch investments (lending transactions)
  useEffect(() => {
    const fetchInvestments = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('lending_transactions')
        .select('*')
        .eq('investor_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching investments:', error);
      } else {
        setInvestments(data || []);
      }
    };
    fetchInvestments();
  }, [userId]);

  // Fetch fundraisers (to get campaign details)
  useEffect(() => {
    const fetchFundraisers = async () => {
      const { data, error } = await supabase
        .from('fundraisers')
        .select('*');
      if (error) {
        console.error('Error fetching fundraisers:', error);
      } else {
        setFundraisers(data || []);
      }
    };
    fetchFundraisers();
  }, []);

  // Fetch repayments
  useEffect(() => {
    const fetchRepayments = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('repayments')
        .select('*')
        .in('lending_transaction_id', investments.map(i => i.id));
      if (error) {
        console.error('Error fetching repayments:', error);
      } else {
        setRepayments(data || []);
      }
    };
    fetchRepayments();
  }, [investments, userId]);

  if (!userId) return <p>Loading...</p>;

  const totalInvested = investments.reduce((sum, investment) => sum + investment.amount_lent, 0);
  const totalRepaid = repayments.reduce((sum, repayment) => sum + repayment.amount_repaid, 0);
  const totalExpectedReturns = investments.reduce((sum, investment) => {
    const fundraiser = fundraisers.find(f => f.id === investment.fundraiser_id);
    if (!fundraiser) return sum;
    const interest = (investment.amount_lent * fundraiser.interest_rate) / 100; // Assuming 1-year term for simplicity
    return sum + investment.amount_lent + interest;
  }, 0);

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Total Invested</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>${totalInvested}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Total Expected Returns</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>${totalExpectedReturns.toFixed(2)}</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h3>Total Repaid</h3>
          <p style={{ fontSize: '1.5rem', color: '#0070f3' }}>${totalRepaid}</p>
        </div>
      </div>

      {/* Investments List */}
      <div>
        <h2>Your Investments</h2>
        {investments.length === 0 ? (
          <p>You haven’t invested in any campaigns yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {investments.map(investment => {
              const fundraiser = fundraisers.find(f => f.id === investment.fundraiser_id);
              const investmentRepayments = repayments.filter(r => r.lending_transaction_id === investment.id);
              const amountRepaid = investmentRepayments.reduce((sum, r) => sum + r.amount_repaid, 0);
              const expectedReturn = fundraiser
                ? investment.amount_lent + (investment.amount_lent * fundraiser.interest_rate) / 100
                : investment.amount_lent;
              return (
                <div
                  key={investment.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3>{fundraiser?.student_name || 'Unknown'}’s Campaign</h3>
                  <p>Amount Invested: ${investment.amount_lent}</p>
                  <p>Interest Rate: {fundraiser?.interest_rate || 0}%</p>
                  <p>Expected Return: ${expectedReturn.toFixed(2)}</p>
                  <p>Amount Repaid: ${amountRepaid}</p>
                  <p>Status: {amountRepaid >= investment.amount_lent ? 'Fully Repaid' : 'Pending'}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}