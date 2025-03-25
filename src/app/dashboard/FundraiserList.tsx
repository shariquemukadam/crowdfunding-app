"use client";

import { useEffect, useState } from 'react';
import { useLend } from '../lend/LendContext';
import { supabase } from '../lib/supabaseClient';
export default function FundraiserList() {
  const { fundraisers } = useLend();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  const userFundraisers = fundraisers.filter((fundraiser) => fundraiser.student_id === userId);

  return (
    <div>
      {userFundraisers.length === 0 ? (
        <p>No fundraisers created yet.</p>
      ) : (
        userFundraisers.map((fundraiser) => (
          <div
            key={fundraiser.id}
            style={{
              backgroundColor: '#f0f8ff',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#000080' }}>
              {fundraiser.student_name}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              Amount Requested: ${fundraiser.amount_requested}
            </p>
            <p style={{ margin: '0' }}>
              Interest Rate: {fundraiser.interest_rate}% per year
            </p>
          </div>
        ))
      )}
    </div>
  );
}