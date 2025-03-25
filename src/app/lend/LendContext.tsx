"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
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

type LendContextType = {
  fundraisers: Fundraiser[];
  addFundraiser: (fundraiser: Omit<Fundraiser, 'id' | 'student_id' | 'created_at' | 'status'>) => Promise<void>;
};

const LendContext = createContext<LendContextType | undefined>(undefined);

export function LendProvider({ children }: { children: ReactNode }) {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  // Fetch fundraisers from Supabase
  useEffect(() => {
    const fetchFundraisers = async () => {
      const { data, error } = await supabase
        .from('fundraisers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching fundraisers:', error);
      } else {
        setFundraisers(data || []);
      }
    };
    fetchFundraisers();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('public:fundraisers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fundraisers' }, (payload) => {
        fetchFundraisers(); // Refetch on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addFundraiser = async (fundraiser: Omit<Fundraiser, 'id' | 'student_id' | 'created_at' | 'status'>) => {
    if (!userId) {
      throw new Error('User must be logged in to create a fundraiser');
    }
    const { error } = await supabase
      .from('fundraisers')
      .insert({
        student_id: userId,
        student_name: fundraiser.student_name,
        amount_requested: fundraiser.amount_requested,
        interest_rate: fundraiser.interest_rate,
        goal_amount: fundraiser.goal_amount,
      });
    if (error) {
      console.error('Error adding fundraiser:', error);
      throw error;
    }
  };

  return (
    <LendContext.Provider value={{ fundraisers, addFundraiser }}>
      {children}
    </LendContext.Provider>
  );
}

export function useLend() {
  const context = useContext(LendContext);
  if (!context) {
    throw new Error('useLend must be used within a LendProvider');
  }
  return context;
}